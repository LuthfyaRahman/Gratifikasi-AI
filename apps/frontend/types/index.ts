export enum UserRole {
  EMPLOYEE = 'employee',
  COMPLIANCE_OFFICER = 'compliance_officer',
  SUPERVISOR = 'supervisor',
  AUDITOR = 'auditor',
  ML_OPS = 'ml_ops',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface SimilarCase {
  id: number;
  similarity_score: number;
  final_label: string;
  preview: string;
}

export interface AiResult {
  label: string;
  confidence: number;
  source: string;
  model_version: string;
  model_run_id: string;
  timestamp?: string;
  similar_cases: SimilarCase[];
  probabilities: {
    [key: string]: number;
  };
}

export interface GratifikasiRecord {
  id: number;
  text: string;
  value_estimation: number;
  status: string;
  ai_label: string;
  ai_confidence: number;
  ai_source: string;
  final_label: string | null;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
  ai_result?: AiResult;
  relationship?: string;
  context?: string;
  country?: string;
  regulatory_framework?: string;
}

export interface AuditLog {
  id: number;
  record: number;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AnalyticsData {
  total_submissions: number;
  milik_negara_pct: number;
  bukan_milik_negara_pct: number;
  similarity_based_pct: number;
  classifier_based_pct: number;
  override_rate: number;
  avg_approval_time_hours: number;
  submissions_by_month: { month: string; count: number }[];
  label_distribution: { label: string; count: number }[];
}

export interface ModelInfo {
  model_version: string;
  training_date: string;
  f1_score: number;
  accuracy: number;
  dataset_size: number;
  last_retraining: string;
  status: string;
}
