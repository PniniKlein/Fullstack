import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { registerUser, sendEmail } from "../store/userSlice";
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
  debugger
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

      const result = await dispatch(registerUser({ ...formData, pathProfile: imageUrl }));
      if (result.meta.requestStatus === 'fulfilled') {
        // setSnackMessage('הרשמה בוצעה בהצלחה');
        // setSnackSeverity('success');
        // setSnackOpen(true);
        setTimeout(() => {navigate('/');}, 1500);
        const subject = "ברוך הבא ל-singsong – הבית שלך למוזיקה חברתית!";
        const body = `
        <div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
            <h1 style="color: #333; font-size: 32px; text-align: center; font-weight: bold;">
              ברוך הבא ל-<span style="text-decoration: underline;">singsong</span>!
            </h1>
            <p style="font-weight: bold;font-size: 25px; color: #333;">שלום ${formData.userName},</p>
            <p style="font-size: 18px; color: #333;">
              איזה כיף שהצטרפת אלינו! singsong היא הרבה יותר מאפליקציה – זו קהילה של יוצרים, מאזינים ואנשים שחיים ונושמים מוזיקה. מהרגע הזה, אתה חלק ממשהו גדול יותר.
            </p>
            <p style="font-size: 18px; color: #333;">
              אצלנו תוכל:
            </p>
            <ul style="font-size: 18px; color: #333; padding-right: 20px;">
              <li>🎶 <strong>לשתף את היצירה שלך:</strong> העלה שירים מקוריים, קטעי קול או גרסאות כיסוי – וקבל במה.</li>
              <li>📢 <strong>להגיע לקהל אמיתי:</strong> כל שיר שתעלה יכול לזכות בלייקים, תגובות, ושיתופים.</li>
              <li>👂 <strong>לשמוע מוזיקה חדשה:</strong> גלה יוצרים מוכשרים, האזן, ושתף עם חברים.</li>
              <li>👥 <strong>להתחבר לקהילה:</strong> עקוב אחרי משתמשים, הגב להם, קבל התראות על שירים חדשים – ובנה לעצמך קהל.</li>
            </ul>
            <p style="font-size: 18px; color: #333;">
              בכל רגע שתפתח את singsong, תוכל לגלות השראה חדשה – כי כאן, המוזיקה אף פעם לא עוצרת.
            </p>
            <p style="font-size: 18px; color: #333;">
              אנחנו כאן כדי ללוות אותך – אם תצטרך עזרה, הכוונה או סתם מקום לשתף, תמיד נשמח לשמוע ממך.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 16px;">
                התחבר ל-singsong
              </a>
            </div>
            <p style="font-size: 20px; color: #D59039; text-align: center;">
              באהבה,<br/>צוות singsong
            </p>
          </div>
        </div>
        `;
        
        
        const result2 = await dispatch(sendEmail({ to: [formData.email], subject: subject, body: body }));
        if(result2.meta.requestStatus === 'fulfilled'){
            console.log("mail sent!");
            // window.location.reload();
            // dispatch(fetchUser() as any);
          }
        else{
            console.log("mail not sent!");}
        }
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
