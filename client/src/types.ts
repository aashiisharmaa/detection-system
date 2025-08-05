export interface ClassificationMetrics {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

export interface ModelResult {
  model: string;
  accuracy: number;
  classification_report: {
    [key: string]: ClassificationMetrics | number;
    '0': ClassificationMetrics;
    '1': ClassificationMetrics;
    '2': ClassificationMetrics;
    'accuracy': number;
    'macro avg': ClassificationMetrics;
    'weighted avg': ClassificationMetrics;
  };
} 