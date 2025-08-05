import React, { useState } from 'react';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import { DataUpload } from '../components/Dashboard/DataUpload';

type Severity = 'low' | 'medium' | 'high';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  timestamp: Date;
}

interface ClassificationReport {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

interface ModelResult {
  model: string;
  accuracy: number;
  classification_report: {
    [label: string]: ClassificationReport;
    'macro avg': ClassificationReport;
    'weighted avg': ClassificationReport;
  };
}

const severityStyles: Record<Severity, React.CSSProperties> = {
  high: { color: 'red', fontWeight: 'bold' },
  medium: { color: 'orange', fontWeight: 'bold' },
  low: { color: 'green', fontWeight: 'bold' },
};

const severityIcons: Record<Severity, string> = {
  high: '🔥',
  medium: '🟡',
  low: '✅',
};
// ✅ Initial mock alerts
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Brute Force Attempt',
    description: 'Multiple failed login attempts detected',
    severity: 'high',
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'Port Scanning',
    description: 'Unusual port scanning activity detected',
    severity: 'medium',
    timestamp: new Date(),
  },
];
const ModelResults: React.FC<{ results: ModelResult[] }> = ({ results }) => (
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

const AttackAlerts: React.FC<{ alerts: Alert[] }> = ({ alerts }) => (
  <div>
    <h3>Attack Alerts</h3>
    <ul>
      {alerts.map(alert => (
        <li key={alert.id}>
          <strong>{alert.title}</strong>: {alert.description}{' '}
          <span style={severityStyles[alert.severity]}>
            ({severityIcons[alert.severity]} Severity: {alert.severity})
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const AttackChart: React.FC<{ results: ModelResult[] }> = ({ results }) => (
  <div>
    <h3>Attack Statistics</h3>
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', border: '1px solid #ccc', padding: '10px' }}>
      {results.map((result, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              width: '40px',
              height: `${result.accuracy * 100}%`,
              marginBottom: '5px',
            }}
          ></div>
          <span>{result.model}</span>
        </div>
      ))}
    </div>
  </div>
);


const AttackDetectionChart: React.FC<{ results: ModelResult[] }> = ({ results }) => {
  const labelMap: Record<string, string> = {
    '0': 'Benign',
    '1': 'Reconnaissance',
    '2': 'Establish Foothold',
    '3': 'Lateral Movement',
    '4': 'Data Exfiltration',
  };

  const labels = Object.keys(labelMap);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Attack Detection (Recall per Label)
      </Typography>
      <div style={{ overflowX: 'auto' }}>
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>Model</th>
              {labels.map(label => (
                <th key={label}>{labelMap[label]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.model}</td>
                {labels.map(label => (
                  <td key={label}>
                    {result.classification_report[label]
                      ? `${(result.classification_report[label].recall * 100).toFixed(2)}%`
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const initialResults: ModelResult[] = [
  {
    model: 'Random Forest',
    accuracy: 0.88,
    classification_report: {
      '0': { precision: 0.87, recall: 0.90, 'f1-score': 0.88, support: 100 },
      '1': { precision: 0.85, recall: 0.83, 'f1-score': 0.84, support: 50 },
      '2': { precision: 0.86, recall: 0.84, 'f1-score': 0.85, support: 40 },
      '3': { precision: 0.89, recall: 0.88, 'f1-score': 0.88, support: 30 },
      '4': { precision: 0.90, recall: 0.87, 'f1-score': 0.88, support: 30 },
      'macro avg': { precision: 0.87, recall: 0.86, 'f1-score': 0.87, support: 250 },
      'weighted avg': { precision: 0.88, recall: 0.88, 'f1-score': 0.88, support: 250 },
    },
  },
  {
    model: 'KNN',
    accuracy: 0.84,
    classification_report: {
      '0': { precision: 0.83, recall: 0.85, 'f1-score': 0.84, support: 100 },
      '1': { precision: 0.81, recall: 0.80, 'f1-score': 0.80, support: 50 },
      '2': { precision: 0.82, recall: 0.80, 'f1-score': 0.81, support: 40 },
      '3': { precision: 0.86, recall: 0.84, 'f1-score': 0.85, support: 30 },
      '4': { precision: 0.87, recall: 0.83, 'f1-score': 0.85, support: 30 },
      'macro avg': { precision: 0.84, recall: 0.82, 'f1-score': 0.83, support: 250 },
      'weighted avg': { precision: 0.84, recall: 0.84, 'f1-score': 0.84, support: 250 },
    },
  },
  {
    model: 'Decision Tree',
    accuracy: 0.80,
    classification_report: {
      '0': { precision: 0.79, recall: 0.80, 'f1-score': 0.79, support: 100 },
      '1': { precision: 0.76, recall: 0.75, 'f1-score': 0.75, support: 50 },
      '2': { precision: 0.78, recall: 0.76, 'f1-score': 0.77, support: 40 },
      '3': { precision: 0.81, recall: 0.80, 'f1-score': 0.80, support: 30 },
      '4': { precision: 0.82, recall: 0.79, 'f1-score': 0.80, support: 30 },
      'macro avg': { precision: 0.79, recall: 0.78, 'f1-score': 0.78, support: 250 },
      'weighted avg': { precision: 0.80, recall: 0.80, 'f1-score': 0.80, support: 250 },
    },
  },
  {
    model: 'Proposed Ensembled Model',
    accuracy: 0.96,
    classification_report: {
      '0': { precision: 0.89, recall: 0.92, 'f1-score': 0.90, support: 100 },
      '1': { precision: 0.88, recall: 0.87, 'f1-score': 0.87, support: 50 },
      '2': { precision: 0.89, recall: 0.87, 'f1-score': 0.88, support: 40 },
      '3': { precision: 0.91, recall: 0.89, 'f1-score': 0.90, support: 30 },
      '4': { precision: 0.92, recall: 0.88, 'f1-score': 0.90, support: 30 },
      'macro avg': { precision: 0.90, recall: 0.87, 'f1-score': 0.89, support: 250 },
      'weighted avg': { precision: 0.90, recall: 0.90, 'f1-score': 0.90, support: 250 },
    },
  },
  {
    model: 'SVM',
    accuracy: 0.75,
    classification_report: {
      '0': { precision: 0.74, recall: 0.76, 'f1-score': 0.75, support: 100 },
      '1': { precision: 0.70, recall: 0.70, 'f1-score': 0.70, support: 50 },
      '2': { precision: 0.73, recall: 0.70, 'f1-score': 0.71, support: 40 },
      '3': { precision: 0.76, recall: 0.75, 'f1-score': 0.75, support: 30 },
      '4': { precision: 0.78, recall: 0.74, 'f1-score': 0.76, support: 30 },
      'macro avg': { precision: 0.74, recall: 0.73, 'f1-score': 0.73, support: 250 },
      'weighted avg': { precision: 0.75, recall: 0.75, 'f1-score': 0.75, support: 250 },
    },
  },
];

export const DashboardPage = () => {
  const [results, setResults] = useState<ModelResult[]>(initialResults);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showDetectionTable, setShowDetectionTable] = useState(false);


  const handleUploadComplete = (data: any) => {
    try {
      console.log('Received data from upload:', data);

      if (!data || !Array.isArray(data.results)) {
        throw new Error("Expected 'results' array in response.");
      }

      const formattedResults = data.results.map((result: any) => ({
        model: result.model,
        accuracy: result.accuracy,
        classification_report: {
          ...result.classification_report,
          'macro avg': result.classification_report['macro avg'],
          'weighted avg': result.classification_report['weighted avg'],
        },
      }));

      setResults(formattedResults);
      setShowDetectionTable(false);
    } catch (error) {
      console.error('Upload processing error:', error);
      alert(`Upload Error: ${(error as Error).message}`);
    }
  };

  const handleDetectAttack = () => {
    alert('Attack detection process started!');
    setShowDetectionTable(true);
  };

  const handleGenerateAlert = () => {
    const spoofingRecalls = results.map(r => r.classification_report['2']?.recall || 0);
    const avgSpoofingRecall = spoofingRecalls.reduce((a, b) => a + b, 0) / spoofingRecalls.length;

    let severity: Severity;
    if (avgSpoofingRecall < 0.6) severity = 'high';
    else if (avgSpoofingRecall < 0.85) severity = 'medium';
    else severity = 'low';

    const newAlert: Alert = {
      id: Date.now().toString(),
      title: 'Security Alert',
      description: `Benign recall is ${(avgSpoofingRecall * 100).toFixed(2)}%`,
      severity,
      timestamp: new Date(),
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep only 5 alerts
    alert(`Alert generated with severity: ${severity}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        IoT Attack Dashboard
      </Typography>

      <Stack spacing={4}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 2 }}>
            <AttackAlerts alerts={alerts} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataUpload onUploadComplete={handleUploadComplete} />
          </Box>
        </Box>

        <Box>
          <img src="/dashboard.jpg" alt="img" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDetectAttack}
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
          >
            Detect Attack
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateAlert}
            sx={{ backgroundColor: '#F44336', '&:hover': { backgroundColor: '#D32F2F' } }}
          >
            Generate Alert
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Attack Statistics
          </Typography>
          <AttackChart results={results} />
          {showDetectionTable && <AttackDetectionChart results={results} />}
        </Box>

        {results.length > 0 && (
          <Box>
            <ModelResults results={results} />
          </Box>
        )}
      </Stack>
    </Container>
  );
};