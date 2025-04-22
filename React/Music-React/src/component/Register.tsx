import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/userSlice";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import { Button, Card, CardContent, Typography } from "@mui/material";
import ProfileImageDialog from "./ProfileImage";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FormInput from "./FormInput";
import axios from "axios";
import api from "../interceptor/axiosConfig";
import Swal from "sweetalert2";
import "../css/Register.css"; // ייבוא עיצוב מותאם

const Register = () => {
  const emptyUser: UserPostModel = { userName: "", email: "", password: "", pathProfile: "" };

  const dispatch = useDispatch<Dispatch>();
  const [formData, setFormData] = useState<UserPostModel>(emptyUser);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const isValidPassword = (password: string) => /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6;

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  }

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      const res = await api.get("User/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      });

      const presignedUrl = res.data.url;
      await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });

      return presignedUrl.split("?")[0];
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = {
      email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password && formData.userName.trim()) {
      let imageUrl = formData.pathProfile;

      if (formData.pathProfile instanceof File) {
        const uploadedUrl = await uploadToS3(formData.pathProfile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          Swal.fire({ icon: "error", title: "שגיאה!", text: "אירעה שגיאה בהעלאת התמונה." });
          return;
        }
      }

      dispatch(registerUser({ ...formData, pathProfile: imageUrl }));
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h6" align="center" className="login-title">
            הרשמה
          </Typography>

          <form onSubmit={handleSubmit} className="login-form">
            <FormInput label="שם משתמש" id="userName" value={formData.userName} error="" onChange={handleChange} />
            <FormInput label="אימייל" type="email" id="email" value={formData.email} error={errors.email} onChange={handleChange} />
            <FormInput label="סיסמה" type="password" id="password" value={formData.password} error={errors.password} onChange={handleChange} />

            <Button variant="outlined" className="picture" fullWidth onClick={() => setOpenDialog(true)} sx={{ mt: 1 }} startIcon={<CameraAltIcon sx={{ marginLeft: "8px" }}/>}>
              בחר תמונת פרופיל
            </Button>

            <Button type="submit" variant="contained" fullWidth className="login-button">
              הרשמה
            </Button>
          </form>
        </CardContent>
      </Card>

      <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
    </div>
  );
};

export default Register;
