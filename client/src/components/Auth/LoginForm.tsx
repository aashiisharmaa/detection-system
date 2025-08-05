import { useForm } from 'react-hook-form';
import { Button, TextField, Box } from '@mui/material';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = ({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        fullWidth
        label="Email Address"
        autoComplete="email"
        autoFocus
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        autoComplete="current-password"
        {...register('password', { required: 'Password is required' })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};