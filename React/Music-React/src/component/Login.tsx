import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../store/userSlice";
import { AuthLogin } from "../model/AuthLogin";
import { Button, Card, CardContent, Typography } from "@mui/material";
import FormInput from "./FormInput";
import { Dispatch } from "../store/store";
import "../css/Login.css"; // ✅ ייבוא הקובץ החדש

const Login = () => {
  const emptyUser: AuthLogin = { email: "", password: "" };

  const dispatch = useDispatch<Dispatch>();
  const [formData, setFormData] = useState<AuthLogin>(emptyUser);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email: string) =>
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const isValidPassword = (password: string) =>
    /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6;

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });

    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        email:
          id === "email"
            ? isValidEmail(value)
              ? ""
              : "כתובת אימייל לא תקינה"
            : prev.email,
        password:
          id === "password"
            ? isValidPassword(value)
              ? ""
              : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר"
            : prev.password,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = {
      email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
      password: isValidPassword(formData.password)
        ? ""
        : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      dispatch(loginUser(formData));
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h6" align="center" className="login-title">
            התחברות
          </Typography>

          <form onSubmit={handleSubmit} className="login-form">
            <FormInput
              label="אימייל"
              type="email"
              id="email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
            />
            <FormInput
              label="סיסמה"
              type="password"
              id="password"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
            />
<Typography variant="body2" align="center" sx={{ marginTop: "5px" ,color: "#888"}}>
            עדיין לא נרשמת?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "#d5933c" }}>
              לחץ כאן 
            </Link>
          </Typography>
            <Button type="submit" variant="contained" fullWidth className="login-button">
              התחבר
            </Button>
          </form>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
