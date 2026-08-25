export interface AIStatus {
  available: boolean;
  message: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: string;
}

export interface AIInsightsResponse {
  generated: boolean;
  insights: AIInsight[];
}
