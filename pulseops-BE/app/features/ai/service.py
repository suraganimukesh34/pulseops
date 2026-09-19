import time

from app.core.config import settings
from app.features.ai.prompts import SYSTEM_PROMPT
from app.features.ai.schemas import AIInsight, AIInsightsResponse, AIStatusResponse
from app.features.beds.service import get_beds
from app.features.departments.service import get_departments
from google import genai
from google.genai import errors as genai_errors
from google.genai import types
from sqlalchemy.orm import Session

# PulseOps AI Copilot is not built yet. Everything returned from this module
# is a static, clearly-labeled preview so the product experience can be
# designed before the real models are trained/integrated.

_client = (
    genai.Client(api_key=settings.gemini_api_key) if settings.gemini_api_key else None
)

_conversations: dict[str, list[dict[str, str]]] = {}
MAX_TURNS = 6
MAX_RETRIES = 3
BASE_DAILY_SECONDS = 1.5

CACHE_TTL_SECONDS = 60

_response_cache: dict[str, tuple[float, str]] = {}

PLACEHOLDER_INSIGHTS: list[AIInsight] = [
    AIInsight(
        id="preview-1",
        title="Predictive Bed Demand",
        description="Forecast ward-level bed demand 24-48 hours ahead so admissions and discharges can be planned proactively.",
        impact="High",
        category="Capacity Planning",
    ),
    AIInsight(
        id="preview-2",
        title="Patient Risk Scoring",
        description="Flag high-risk patients earlier using vitals and history trends, prioritizing clinician attention.",
        impact="High",
        category="Clinical Safety",
    ),
    AIInsight(
        id="preview-3",
        title="Smart Staff Scheduling",
        description="Recommend shift assignments based on predicted patient load and staff availability.",
        impact="Medium",
        category="Workforce Optimization",
    ),
    AIInsight(
        id="preview-4",
        title="Inventory Reorder Forecasting",
        description="Predict pharmacy and supply depletion before stock hits critical levels.",
        impact="Medium",
        category="Supply Chain",
    ),
]


def _make_tools(db: Session):
    def get_bed_occupancy(department: str) -> str:
        """Get bed occupancy (total, occupied, free) for one hospital department.

        Args:
            department: The department name, e.g. "Cardiology" or "ICU".
        """
        departments = get_departments(db)
        match = next(
            (d for d in departments if d.name.lower() == department.lower()), None
        )
        if match is None:
            return f"No department named '{department}' was found."

        beds = get_beds(db)
        dept_beds = [b for b in beds if b.department_id == match.id]
        occupied = sum(1 for b in dept_beds if b.status == "Occupied")
        return (
            f"{match.name}: {len(dept_beds)} total beds, "
            f"{occupied} occupied, {len(dept_beds) - occupied} free."
        )

    return [get_bed_occupancy]


def _get_stream_with_retry(db: Session, prompt: str):
    tools = _make_tools(db)
    config = {"tools": tools, "automatic_function_calling": {"disable": True}}
    contents = [prompt]

    for attempt in range(MAX_RETRIES):
        try:
            response = _client.models.generate_content(
                model=settings.gemini_model, contents=contents, config=config
            )
            part = response.candidates[0].content.parts[0]

            if part.function_call:
                tool_fn = next(
                    t for t in tools if t.__name__ == part.function_call.name
                )
                result = tool_fn(**dict(part.function_call.args))
                contents.append(response.candidates[0].content)
                contents.append(
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_function_response(
                                name=part.function_call.name,
                                response={"result": result},
                            )
                        ],
                    )
                )

            return _client.models.generate_content_stream(
                model=settings.gemini_model, contents=contents, config=config
            )
        except genai_errors.APIError as e:
            if attempt == MAX_RETRIES - 1:
                raise
            delay = BASE_DAILY_SECONDS * (2**attempt)
            print(f"Gemini call failed ({e.code}), retrying in {delay}s...")
            time.sleep(delay)


def _history_as_text(session_id: str) -> str:
    turns = _conversations.get(session_id, [])
    lines = [f"{t['role'].upper()}: {t['text']}" for t in turns]
    return "\n".join(lines)


def ask_copilot(message: str) -> str:
    if _client is None:
        return "AI Copilot is not configured - GEMINI_API_KEY is missing."

    prompt = f"{SYSTEM_PROMPT} \n\n QUESTION: {message}"

    response = _client.models.generate_content(
        model=settings.gemini_model, contents=prompt
    )

    return response.text


def _cache_key(session_id: str, message: str) -> str:
    return f"{session_id}:{_history_as_text(session_id)}:{message}"


def ask_copilot_stream(db: Session, session_id: str, message: str):
    if _client is None:
        yield "AI Copilot is not configured - GEMINI_API_KEY is missing."
        return

    key = _cache_key(session_id, message)
    cached = _response_cache.get(key)
    if cached and (time.time() - cached[0]) < CACHE_TTL_SECONDS:
        yield cached[1]
        return

    history = _conversations.setdefault(session_id, [])
    history_text = _history_as_text(session_id)

    prompt = (
        f"{SYSTEM_PROMPT} \n\nCONVERSATION SO FAR:\n {history_text}\n\nUSER: {message}"
    )

    try:
        stream = _get_stream_with_retry(db, prompt)
    except genai_errors.APIError:
        yield "The AI Copilot is temperorily busy. Please try again in a moment."
        return

    full_reply = ""
    try:
        for chunk in stream:
            if chunk.text:
                full_reply += chunk.text
                yield chunk.text
    except genai_errors.APIError:
        yield "The AI Copilot is temperorily busy. Please try again in a moment."
        return

    _response_cache[key] = (time.time(), full_reply)
    history.append({"role": "user", "text": message})
    history.append({"role": "assistant", "text": full_reply})
    del history[: max(0, len(history) - MAX_TURNS)]


def get_ai_status() -> AIStatusResponse:

    if _client is None:
        return AIStatusResponse(
            available=False,
            message="PulseOps AI Copilot is not configured. Set GEMINI_API_KEY to enable it.",
        )

    return AIStatusResponse(available=True, message="PulseOps AI Copilot is live.")


def get_ai_insights() -> AIInsightsResponse:
    return AIInsightsResponse(generated=False, insights=PLACEHOLDER_INSIGHTS)
