import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../store/userSlice";
import { Button, Card, CardContent, Avatar, Box, Dialog, IconButton, Typography } from "@mui/material";
import FormInput from "./FormInput";
import ProfileImageDialog from "./ProfileImage";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import axios from "axios";
import api from "../interceptor/axiosConfig";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import "../css/UpdateUser.css";

const UpdateUser = () => {
  const user = useSelector((state: StoreType) => state.user.user);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UserPostModel>({
    userName: user?.userName || "",
    email: user?.email || "",
    password: user.password,
    pathProfile: user?.pathProfile ? user?.pathProfile : user?.userName ? "" : "/avatars/default.jpg",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof formData.pathProfile === "string" ? formData.pathProfile : null
  );

  // const [errors, setErrors] = useState({ password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (formData.pathProfile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formData.pathProfile);
    } else if (typeof formData.pathProfile === "string") {
      setImagePreview(formData.pathProfile);
    }
  }, [formData.pathProfile]);

  const isValidPassword = (password: string) =>
    !password || (/[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6);

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });

    // setErrors((prev) => ({
    //   ...prev,
    //   password: id === "password" ? (isValidPassword(value) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר") : prev.password,
    // }));
  };

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
    setLoading(true); // מתחיל טעינה

    const newErrors = {
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    };

    // setErrors(newErrors);

    if (!newErrors.password && formData.userName.trim()) {
      let imageUrl = formData.pathProfile;

      if (formData.pathProfile instanceof File) {
        const uploadedUrl = await uploadToS3(formData.pathProfile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setLoading(false); // מסיים טעינה במקרה של שגיאה
          Swal.fire({ icon: "error", title: "שגיאה!", text: "אירעה שגיאה בהעלאת התמונה." });
          return;
        }
      }

      await dispatch(updateUser({ id: user.id, userPostModl: { ...formData, pathProfile: imageUrl } }));
      handleClose();
    }

    setLoading(false); // מסיים טעינה
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          position: "relative", // נדרש כדי שה-overlay יהיה בתוך ה-dialog
        },
      }}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <div className="update-user-container">
        <Card className="update-user-card">
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, left: 10, color: "white" }}>
            <CloseIcon />
          </IconButton>

          <CardContent>
            <Typography variant="h6" align="center" className="update-user-title">
              עדכון פרופיל
            </Typography>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Box
                className="avatar-large"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}
                onClick={() => setOpenDialog(true)}
              >
                <Avatar
                  src={imagePreview || ""}
                  sx={{ width: "100%", height: "100%", backgroundColor: "#333", fontSize: "2rem" }}
                >
                  {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
                </Avatar>
              </Box>
            </div>

            <form onSubmit={handleSubmit} className="update-user-form">
              <FormInput label="שם משתמש" id="userName" value={formData.userName} error="" onChange={handleChange} />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="button"
                sx={{ mt: 2 }}
                disabled={loading} // הכפתור לא לחיץ בזמן טעינה
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="spinner" />
                    <span style={{ marginRight: 8 }}>טוען...</span>
                  </span>
                ) : (
                  "עדכן פרופיל"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
      <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
      {loading && <div className="dialog-overlay" />}
    </Dialog>
  );
};

export default UpdateUser;
