import { TextField } from "@mui/material";

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  value: string;
  error: string;
  onChange: (id: string, value: string) => void;
}

const FormInput = ({
  label,
  type = "text",
  id,
  value,
  error,
  onChange,
}: FormInputProps) => {
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
      sx={{
        backgroundColor: "#333",
        borderRadius: "8px",
        "& .MuiInputBase-input": {
          color: "white",
        },
        "& .MuiInputLabel-root": {
          color: "#ddd",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#d5933c",
        },
        "& .MuiOutlinedInput-root fieldset": {
          borderColor: "#666",
        },
        "& .MuiOutlinedInput-root:hover fieldset": {
          borderColor: "#d5933c",
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: "#d5933c",
        },
      }}
    />
  );
};

export default FormInput;
