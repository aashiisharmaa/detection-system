
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

// Define the upload path
const uploadDir = process.env.UPLOAD_PATH || 'uploads';
const resolvedPath = path.resolve(uploadDir);
if (!fs.existsSync(resolvedPath)) {
  fs.mkdirSync(resolvedPath, { recursive: true });
}

// Set up multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, resolvedPath),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  }
});
const upload = multer({ storage });

// ✅ Upload dataset handler
const uploadDataset = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const targetColumn = 'Activity';
  const numTopFeatures = '10';
  const scriptPath = path.resolve(__dirname, '../ml_pipeline.py');

  const pythonProcess = spawn('python3', [scriptPath, filePath, targetColumn, numTopFeatures]);

  let resultData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        console.log('Raw Python Output:', resultData);

        const match = resultData.match(/{[\s\S]*}/);
if (!match) {
  throw new Error('No valid JSON object found in output');
}

const parsedResults = JSON.parse(match[0]);

const resultsArray = Array.isArray(parsedResults) ? parsedResults : [parsedResults];
console.log('Sending response:', {
  message: 'File uploaded and processed successfully',
  filename: fileName,
  path: filePath,
  results: resultsArray
});

res.json({
  message: 'File uploaded and processed successfully',
  filename: fileName,
  path: filePath,
  results: resultsArray, // ✅ This MUST be an array named "results"
});

          
      } catch (err) {
        console.error('Failed to parse results:', err);
        res.status(500).json({
          message: 'Processing failed: Invalid JSON output',
          error: (err instanceof Error) ? err.message : 'Unknown error',
          rawOutput: resultData
        });
      }
    } else {
      console.error('Python script error:', errorData);
      res.status(500).json({ message: 'Processing failed', error: errorData });
    }
  });
};

// Dummy getDatasets handler
const getDatasets = async (_: Request, res: Response) => {
  res.json({ datasets: [] });
};

// ✅ Single export block at bottom
export { upload, uploadDataset, getDatasets };

