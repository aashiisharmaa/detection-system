import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState } from 'react';

type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface AttackAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: Date;
}

const severityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'error'
} as const;

export const AttackAlerts = ({ alerts }: { alerts: AttackAlert[] }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  return (
    <>
      {alerts
        .filter(alert => !dismissedAlerts.includes(alert.id))
        .map(alert => (
          <Collapse in key={alert.id}>
            <Alert
              severity={severityColors[alert.severity]}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.description} - {alert.timestamp.toLocaleString()}
            </Alert>
          </Collapse>
        ))}
    </>
  );
};