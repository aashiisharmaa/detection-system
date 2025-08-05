import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

// Classification metrics interface
interface ClassificationMetrics {
  precision: number;
  recall: number;
  'f1-score': number;
  support: number;
}

interface ClassificationReport {
  [label: string]: ClassificationMetrics;
}

interface ModelResult {
  model: string;
  accuracy: number;
  classification_report?: ClassificationReport;
  precision?: number;
  recall?: number;
  'f1-score'?: number;
  support?: number;
}

interface DataUploadProps {
  onUploadComplete: (data: ModelResult[]) => void;
}

export const DataUpload = ({ onUploadComplete }: DataUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!['text/csv', 'application/json'].includes(selectedFile.type)) {
      setUploadError('Please upload a CSV or JSON file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file); // ✅ correct field name

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
      console.log('Auth token:', token);

      const response = await axios.post(
        'http://localhost:2000/api/datasets/uploads', // ✅ correct endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },

        }
      );
      

      //let results: ModelResult[] = [];
      const responseData = response.data;

      // 💡 Validate structure before mapping
      if (!Array.isArray(responseData.results)) {
        throw new Error("Expected 'results' array in response.");
      }
      
      // ✅ Add type annotation here
      const validatedResults: ModelResult[] = responseData.results.map((result: any) => {
        const classificationReport = result.classification_report ?? {
          '0': { precision: 0, recall: 0, 'f1-score': 0, support: 0 },
          '1': { precision: 0, recall: 0, 'f1-score': 0, support: 0 },
          '2': { precision: 0, recall: 0, 'f1-score': 0, support: 0 },
          'macro avg': { precision: 0, recall: 0, 'f1-score': 0, support: 0 },
          'weighted avg': { precision: 0, recall: 0, 'f1-score': 0, support: 0 },
        };
      
        return {
          model: result.model || 'Unknown Model',
          accuracy: result.accuracy ?? 0,
          classification_report: classificationReport,
        };
      });
      
      onUploadComplete(validatedResults);
      

      setUploadSuccess(true);
    } catch (error) {
      let message = 'Upload failed';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setUploadError(message);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload IoT Dataset
      </Typography>

      <input
        accept=".csv,.json"
        style={{ display: 'none' }}
        id="dataset-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="dataset-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
        >
          Select File
        </Button>
      </label>

      {file && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        onClick={handleUpload}
        disabled={!file || isUploading}
        startIcon={isUploading ? <CircularProgress size={20} /> : null}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>

      {uploadSuccess && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          ✓ Upload successful! Processing data...
        </Typography>
      )}

      {uploadError && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.main">
            <strong>Error:</strong> {uploadError}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
