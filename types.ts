
export interface ExtractedMessage {
  learnerName: string;
  quote: string;
}

export interface DetailedExtractionLog {
  conceptualConfusion: ExtractedMessage[];
  technicalIssues: ExtractedMessage[];
  actionableFeedback: ExtractedMessage[];
  positiveFeedback: ExtractedMessage[];
}

export interface ExecutiveSummary {
  overallSessionSentiment: string;
  keyTakeaway: string;
}

export interface ImprovementArea {
  theme: string;
  description: string;
}

export interface ActionableInsight {
  action: string;
  recommendation: string;
  reportedBy: string[];
}

export interface GroupedPoint {
    issue: string;
    reportedBy: string[];
}

export interface AnalysisReportData {
  executiveSummary: ExecutiveSummary;
  keyAreasForImprovement: ImprovementArea[];
  actionableInsights: ActionableInsight[];
  keyProblems: GroupedPoint[];
  positiveHighlights: GroupedPoint[];
  detailedExtractionLog: DetailedExtractionLog;
}