import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography 
} from '@mui/material';

interface ModelResult {
  model: string;
  accuracy: number;
  classification_report: {
    [key: string]: any;
  };
}

export const ModelMetricsTable = ({ results }: { results: ModelResult[] }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Detailed Model Metrics
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell align="right">Accuracy</TableCell>
            <TableCell align="right">Class 0 F1</TableCell>
            <TableCell align="right">Class 1 F1</TableCell>
            <TableCell align="right">Class 2 F1</TableCell>
            <TableCell align="right">Macro Avg F1</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.model}>
              <TableCell component="th" scope="row">
                {result.model}
              </TableCell>
              <TableCell align="right">
                {(result.accuracy * 100).toFixed(2)}%
              </TableCell>
              <TableCell align="right">
                {(result.classification_report['0']['f1-score'] * 100).toFixed(2)}%
              </TableCell>
              <TableCell align="right">
                {(result.classification_report['1']['f1-score'] * 100).toFixed(2)}%
              </TableCell>
              <TableCell align="right">
                {(result.classification_report['2']['f1-score'] * 100).toFixed(2)}%
              </TableCell>
              <TableCell align="right">
                {(result.classification_report['macro avg']['f1-score'] * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 