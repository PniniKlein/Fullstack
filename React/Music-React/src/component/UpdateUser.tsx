// import { FormEvent, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { useNavigate } from "react-router-dom";
// import { updateUser } from "../store/userSlice";
// import { Button, Card, CardContent, Avatar, Box } from "@mui/material";
// import FormInput from "./FormInput";
// import ProfileImage from "./ProfileImage";
// import {UserPostModel} from "../model/PostModel/UserPostModel";

// const UpdateUser = () => {
//   const user = useSelector((state: StoreType) => state.user.user); // נתוני המשתמש הקיים מהסטייט
//   const dispatch = useDispatch<Dispatch>();
//   const [formData, setFormData] = useState<UserPostModel>({
//     userName: user?.userName || "",
//     email: user?.email || "",
//     password: "", // לא נעדכן סיסמה אלא אם המשתמש מזין חדשה
//     pathProfile: user?.pathProfile || "/avatars/default.jpg",
//   });

//   const [errors, setErrors] = useState({ password: "" });
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

// //   const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
//   const isValidPassword = (password: string) => !password || (/[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6);

//   const handleChange = (id: string, value: string) => {
//     setFormData({ ...formData, [id]: value });

//     setErrors((prev) => ({
//       ...prev,
//     //   email: id === "email" ? (isValidEmail(value) ? "" : "כתובת אימייל לא תקינה") : prev.email,
//       password: id === "password" ? (isValidPassword(value) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר") : prev.password,
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     const newErrors = {
//       password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
//     };

//     setErrors(newErrors);

//     if (!newErrors.password && formData.userName.trim()) {
//       dispatch(updateUser({ id: user.id, userPostModl: formData }));
//       navigate("/");
//     }
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//       <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
//         <CardContent>
//           {/* תמונת פרופיל ללא אפקטים */}
//           <div style={{ display: "flex", justifyContent: "center", marginBottom: 50 }}>
//             <Box
//               sx={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: "50%",
//                 overflow: "hidden",
//                 border: "2px solid #ddd", // גבול פשוט מסביב לתמונה
//               }}
//               onClick={() => setOpenDialog(true)}
//             >
//               {/* <Avatar src={formData.pathProfile} sx={{ width: "100%", height: "100%" }} /> */}
//             </Box>
//           </div>

//           <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
//             <FormInput
//               label="שם משתמש"
//               id="userName"
//               value={formData.userName}
//               error=""
//               onChange={handleChange}
//             />
//             {/* <FormInput
//               label="סיסמה (רק אם רוצים לשנות)"
//               type="password"
//               id="password"
//               value={formData.password}
//               error={errors.password}
//               onChange={handleChange}
//             /> */}

//             <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "black", color: "white", mt: 2 }}>
//               עדכן פרופיל
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* דיאלוג לבחירת תמונת פרופיל */}
//       <ProfileImage open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
//     </div>
//   );
// };

// export default UpdateUser;

import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../store/userSlice";
import { Button, Card, CardContent, Avatar, Box, Dialog, IconButton } from "@mui/material";
import FormInput from "./FormInput";
import ProfileImageDialog from "./ProfileImage";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import axios from "axios";
import api from "../interceptor/axiosConfig";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";

const UpdateUser = () => {
  const user = useSelector((state: StoreType) => state.user.user);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserPostModel>({
    userName: user?.userName || "",
    email: user?.email || "",
    password: user.password,
    pathProfile: user?.pathProfile || "/avatars/default.jpg",
  });

  const [errors, setErrors] = useState({ password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const isValidPassword = (password: string) =>
    !password || (/[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6);

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });

    setErrors((prev) => ({
      ...prev,
      password: id === "password" ? (isValidPassword(value) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר") : prev.password,
    }));
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

    const newErrors = {
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    };

    setErrors(newErrors);

    if (!newErrors.password && formData.userName.trim()) {
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

      dispatch(updateUser({ id: user.id, userPostModl: { ...formData, pathProfile: imageUrl } }));
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => navigate(-1), 300); // הוספת דיליי קל לסגירה חלקה
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" sx={{ backdropFilter: "blur(5px)" }}>
      <Card sx={{ padding: 3, boxShadow: 3, position: "relative", borderRadius: 3 }}>
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, right: 10, color: "black" }}>
          <CloseIcon />
        </IconButton>

        <CardContent>
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>עדכון פרופיל</h2>

          {/* תמונת פרופיל בתוך Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #ddd",
                cursor: "pointer",
                marginBottom: "20px",
              }}
              onClick={() => setOpenDialog(true)}
            >
              <Avatar
                src={typeof formData.pathProfile === "string" ? formData.pathProfile : ""}
                sx={{ width: "100%", height: "100%" }}
              >
                {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
              </Avatar>
            </Box>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <FormInput label="שם משתמש" id="userName" value={formData.userName} error="" onChange={handleChange} />

            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "black", color: "white", mt: 2 }}>
              עדכן פרופיל
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* דיאלוג לבחירת תמונת פרופיל */}
      <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
    </Dialog>
  );
};

export default UpdateUser;
