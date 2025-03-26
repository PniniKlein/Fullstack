import { TextField } from "@mui/material";

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  value: string;
  error: string;
  onChange: (id: string, value: string) => void;
}

const FormInput = ({ label, type = "text", id, value, error, onChange }: FormInputProps) => {
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      value={value}
      id={id}
      onChange={(e) => onChange(e.target.id, e.target.value)}
      error={!!error}
      helperText={error}
      required
    />
  );
};

export default FormInput;
