from app.features.ai.schemas import AIInsight, AIInsightsResponse, AIStatusResponse

# PulseOps AI Copilot is not built yet. Everything returned from this module
# is a static, clearly-labeled preview so the product experience can be
# designed before the real models are trained/integrated.

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


def get_ai_status() -> AIStatusResponse:
    return AIStatusResponse(
        available=False,
        message="PulseOps AI Copilot is in development. The capabilities below are previews of what's coming.",
    )


def get_ai_insights() -> AIInsightsResponse:
    return AIInsightsResponse(generated=False, insights=PLACEHOLDER_INSIGHTS)
