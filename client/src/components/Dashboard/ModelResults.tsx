import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';

interface ClassificationReport {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

export interface ModelResult {
  model: string;
  accuracy: number;
  classification_report: {
    [label: string]: ClassificationReport;
    'macro avg': ClassificationReport;
    'weighted avg': ClassificationReport;
  };
}

interface ModelResultsProps {
  results: ModelResult[];
}

export const ModelResults: React.FC<ModelResultsProps> = ({ results }) => {
  return (
    <div>
      <h2>Model Results</h2>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>Model</th>
            <th>Accuracy</th>
            <th>Precision (Macro Avg)</th>
            <th>Recall (Macro Avg)</th>
            <th>F1-Score (Macro Avg)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.model}</td>
              <td>{(result.accuracy * 100).toFixed(2)}%</td>
              <td>{(result.classification_report['macro avg'].precision * 100).toFixed(2)}%</td>
              <td>{(result.classification_report['macro avg'].recall * 100).toFixed(2)}%</td>
              <td>{(result.classification_report['macro avg']['f1-score'] * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
