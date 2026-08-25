from pydantic import BaseModel


class AIStatusResponse(BaseModel):
    available: bool
    message: str


class AIInsight(BaseModel):
    id: str
    title: str
    description: str
    impact: str  # High | Medium | Low
    category: str


class AIInsightsResponse(BaseModel):
    generated: bool
    insights: list[AIInsight]
