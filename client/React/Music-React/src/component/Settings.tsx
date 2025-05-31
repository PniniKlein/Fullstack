// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import type { StoreType } from "../store/store"
// import {
//   Avatar,
//   Switch,
//   TextField,
//   FormControlLabel,
//   Slider,
//   Button,
//   Tab,
//   Tabs,
//   Box,
//   Typography,
//   Paper,
//   Alert,
//   Snackbar,
// } from "@mui/material"
// import {
//   SettingsIcon,
//   User,
//   Bell,
//   Shield,
//   Music,
//   Moon,
//   Sun,
//   Save,
//   Camera,
//   Trash2,
//   Volume2,
//   VolumeX,
//   Eye,
//   EyeOff,
//   Check,
//   X,
// } from "lucide-react"
// import Swal from "sweetalert2"
// // import "../css/Settings.css"

// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`settings-tabpanel-${index}`}
//       aria-labelledby={`settings-tab-${index}`}
//       {...other}
//       className="settings-tabpanel"
//     >
//       {value === index && <Box p={3}>{children}</Box>}
//     </div>
//   )
// }

// function a11yProps(index: number) {
//   return {
//     id: `settings-tab-${index}`,
//     "aria-controls": `settings-tabpanel-${index}`,
//   }
// }

// interface UserSettings {
//   theme: "light" | "dark"
//   language: string
//   notifications: {
//     email: boolean
//     push: boolean
//     newSongs: boolean
//     comments: boolean
//     followers: boolean
//   }
//   privacy: {
//     profileVisible: boolean
//     showEmail: boolean
//     showActivity: boolean
//   }
//   audio: {
//     volume: number
//     autoplay: boolean
//     highQuality: boolean
//   }
// }

// const Settings: React.FC = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector((store: StoreType) => store.user.user)
//   const authState = useSelector((store: StoreType) => store.user.authState)

//   const [tabValue, setTabValue] = useState(0)
//   const [isLoading, setIsLoading] = useState(false)
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
//   const [profilePreview, setProfilePreview] = useState<string | null>(null)

//   const [userProfile, setUserProfile] = useState({
//     userName: user?.userName || "",
//     email: user?.email || "",
//     // bio: user?.bio || "",
//     pathProfile: user?.pathProfile || "",
//   })

//   const [settings, setSettings] = useState<UserSettings>({
//     theme: "dark",
//     language: "he",
//     notifications: {
//       email: true,
//       push: true,
//       newSongs: true,
//       comments: true,
//       followers: false,
//     },
//     privacy: {
//       profileVisible: true,
//       showEmail: false,
//       showActivity: true,
//     },
//     audio: {
//       volume: 75,
//       autoplay: false,
//       highQuality: true,
//     },
//   })

//   // Check if user is logged in
//   useEffect(() => {
//     if (!authState) {
//       navigate("/login")
//     }
//   }, [authState, navigate])

//   // Load settings from localStorage on component mount
//   useEffect(() => {
//     const savedSettings = localStorage.getItem("singsong-settings")
//     if (savedSettings) {
//       try {
//         const parsed = JSON.parse(savedSettings)
//         setSettings((prev) => ({ ...prev, ...parsed }))
//       } catch (error) {
//         console.error("Error loading settings:", error)
//       }
//     }

//     // Apply theme on load
//     applyTheme(settings.theme)

//     // Set user profile data
//     if (user) {
//       setUserProfile({
//         userName: user.userName || "",
//         email: user.email || "",
//         // bio: user.bio || "",
//         pathProfile: user.pathProfile || "",
//       })
//       setProfilePreview(user.pathProfile || null)
//     }
//   }, [user])

//   // Apply theme to document
//   const applyTheme = (theme: "light" | "dark") => {
//     document.documentElement.setAttribute("data-theme", theme)
//     const root = document.documentElement

//     if (theme === "light") {
//       root.style.setProperty("--background-color", "#ffffff")
//       root.style.setProperty("--text-color", "#1e1e1e")
//       root.style.setProperty("--card-bg", "#f8f8f8")
//       root.style.setProperty("--border-color", "#e0e0e0")
//     } else {
//       root.style.setProperty("--background-color", "#1e1e1e")
//       root.style.setProperty("--text-color", "#ffffff")
//       root.style.setProperty("--card-bg", "#2a2a2a")
//       root.style.setProperty("--border-color", "#3a3a3a")
//     }
//   }

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   // Update specific setting
//   const updateSetting = (path: string, value: any) => {
//     setSettings((prev) => {
//       const newSettings = { ...prev }
//       const keys = path.split(".")
//       let current: any = newSettings

//       for (let i = 0; i < keys.length - 1; i++) {
//         current = current[keys[i]]
//       }

//       current[keys[keys.length - 1]] = value
//       return newSettings
//     })
//   }

//   // Handle profile update
//   const handleProfileUpdate = (field: string, value: string) => {
//     setUserProfile((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   // Handle avatar upload
//   const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         const result = e.target?.result as string
//         setProfilePreview(result)
//         setUserProfile((prev) => ({
//           ...prev,
//           pathProfile: file,
//         }))
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   // Save settings
//   const saveSettings = async () => {
//     setIsLoading(true)
//     try {
//       // Save settings to localStorage
//       localStorage.setItem("singsong-settings", JSON.stringify(settings))
//       applyTheme(settings.theme)

//       // Update user profile if changed
//       if (user) {
//         const formData = new FormData()
//         formData.append("userName", userProfile.userName)
//         formData.append("email", userProfile.email)
//         formData.append("bio", userProfile.bio)

//         if (userProfile.pathProfile instanceof File) {
//           formData.append("profileImage", userProfile.pathProfile)
//         }

//         // Simulate API call for updating user profile
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         // In a real app, you would dispatch an action to update the user
//         // dispatch(updateUser(formData))
//       }

//       setSnackbar({
//         open: true,
//         message: "ההגדרות נשמרו בהצלחה!",
//         severity: "success",
//       })
//     } catch (error) {
//       console.error("Error saving settings:", error)
//       setSnackbar({
//         open: true,
//         message: "שגיאה בשמירת ההגדרות",
//         severity: "error",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle account deletion
//   const handleDeleteAccount = () => {
//     Swal.fire({
//       title: "האם אתה בטוח?",
//       text: "פעולה זו תמחק את החשבון שלך לצמיתות",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "כן, מחק את החשבון",
//       cancelButtonText: "ביטול",
//       background: settings.theme === "dark" ? "#1e1e1e" : "#ffffff",
//       color: settings.theme === "dark" ? "#ffffff" : "#1e1e1e",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Here you would dispatch an action to delete the account
//         Swal.fire({
//           title: "החשבון נמחק!",
//           text: "החשבון שלך נמחק בהצלחה",
//           icon: "success",
//           background: settings.theme === "dark" ? "#1e1e1e" : "#ffffff",
//           color: settings.theme === "dark" ? "#ffffff" : "#1e1e1e",
//         })
//         // Navigate to home after deletion
//         navigate("/")
//       }
//     })
//   }

//   // Close snackbar
//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }))
//   }

//   return (
//     <div className={`settings-container ${settings.theme}`}>
//       <div className="settings-header">
//         <div className="settings-header-icon">
//           <SettingsIcon size={24} />
//         </div>
//         <div className="settings-header-text">
//           <h1>הגדרות</h1>
//           <p>נהל את ההעדפות והפרטיות שלך</p>
//         </div>
//       </div>

//       <Paper className="settings-tabs-container">
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           className="settings-tabs"
//           TabIndicatorProps={{ className: "settings-tab-indicator" }}
//         >
//           <Tab
//             icon={<User size={18} />}
//             label="פרופיל"
//             {...a11yProps(0)}
//             className={`settings-tab ${tabValue === 0 ? "active" : ""}`}
//           />
//           <Tab
//             icon={<Moon size={18} />}
//             label="תצוגה"
//             {...a11yProps(1)}
//             className={`settings-tab ${tabValue === 1 ? "active" : ""}`}
//           />
//           <Tab
//             icon={<Bell size={18} />}
//             label="התראות"
//             {...a11yProps(2)}
//             className={`settings-tab ${tabValue === 2 ? "active" : ""}`}
//           />
//           <Tab
//             icon={<Shield size={18} />}
//             label="פרטיות"
//             {...a11yProps(3)}
//             className={`settings-tab ${tabValue === 3 ? "active" : ""}`}
//           />
//           <Tab
//             icon={<Music size={18} />}
//             label="שמע"
//             {...a11yProps(4)}
//             className={`settings-tab ${tabValue === 4 ? "active" : ""}`}
//           />
//         </Tabs>
//       </Paper>

//       <div className="settings-content">
//         {/* Profile Tab */}
//         <TabPanel value={tabValue} index={0}>
//           <div className="settings-section">
//             <h2 className="settings-section-title">פרטי פרופיל</h2>

//             <div className="settings-avatar-section">
//               <div className="settings-avatar-container">
//                 <Avatar
//                   src={profilePreview || userProfile.pathProfile || "/placeholder.svg"}
//                   alt={userProfile.userName}
//                   className="settings-avatar"
//                 >
//                   {!profilePreview && !userProfile.pathProfile && userProfile.userName
//                     ? userProfile.userName.charAt(0)
//                     : ""}
//                 </Avatar>
//                 <div className="settings-avatar-overlay">
//                   <label htmlFor="avatar-upload" className="settings-avatar-upload-label">
//                     <Camera size={20} />
//                   </label>
//                   <input
//                     id="avatar-upload"
//                     type="file"
//                     accept="image/*"
//                     className="settings-avatar-upload"
//                     onChange={handleAvatarUpload}
//                   />
//                 </div>
//               </div>
//               <div className="settings-avatar-info">
//                 <Typography variant="subtitle1" className="settings-avatar-name">
//                   {userProfile.userName}
//                 </Typography>
//                 <Typography variant="body2" className="settings-avatar-email">
//                   {userProfile.email}
//                 </Typography>
//               </div>
//             </div>

//             <div className="settings-form-group">
//               <TextField
//                 label="שם משתמש"
//                 variant="outlined"
//                 fullWidth
//                 value={userProfile.userName}
//                 onChange={(e) => handleProfileUpdate("userName", e.target.value)}
//                 className="settings-text-field"
//               />
//             </div>

//             <div className="settings-form-group">
//               <TextField
//                 label="אימייל"
//                 type="email"
//                 variant="outlined"
//                 fullWidth
//                 value={userProfile.email}
//                 onChange={(e) => handleProfileUpdate("email", e.target.value)}
//                 className="settings-text-field"
//               />
//             </div>

//             <div className="settings-form-group">
//               <TextField
//                 label="תיאור אישי"
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={3}
//                 value={userProfile.bio}
//                 onChange={(e) => handleProfileUpdate("bio", e.target.value)}
//                 className="settings-text-field"
//                 placeholder="ספר קצת על עצמך..."
//               />
//             </div>

//             <div className="settings-danger-zone">
//               <Typography variant="h6" className="settings-danger-title">
//                 אזור מסוכן
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<Trash2 size={18} />}
//                 onClick={handleDeleteAccount}
//                 className="settings-delete-btn"
//               >
//                 מחק חשבון
//               </Button>
//             </div>
//           </div>
//         </TabPanel>

//         {/* Display Tab */}
//         <TabPanel value={tabValue} index={1}>
//           <div className="settings-section">
//             <h2 className="settings-section-title">הגדרות תצוגה</h2>

//             <div className="settings-theme-toggle">
//               <div className="settings-theme-option">
//                 <div className="settings-theme-icon">
//                   <Sun size={24} />
//                 </div>
//                 <Typography variant="body1">מצב בהיר</Typography>
//               </div>

//               <Switch
//                 checked={settings.theme === "dark"}
//                 onChange={(e) => {
//                   const newTheme = e.target.checked ? "dark" : "light"
//                   updateSetting("theme", newTheme)
//                   applyTheme(newTheme)
//                 }}
//                 className="settings-theme-switch"
//               />

//               <div className="settings-theme-option">
//                 <div className="settings-theme-icon">
//                   <Moon size={24} />
//                 </div>
//                 <Typography variant="body1">מצב כהה</Typography>
//               </div>
//             </div>

//             <div className="settings-form-group">
//               <Typography variant="subtitle1" className="settings-label">
//                 שפה
//               </Typography>
//               <div className="settings-language-options">
//                 <Button
//                   variant={settings.language === "he" ? "contained" : "outlined"}
//                   onClick={() => updateSetting("language", "he")}
//                   className={`settings-language-btn ${settings.language === "he" ? "active" : ""}`}
//                 >
//                   עברית
//                 </Button>
//                 <Button
//                   variant={settings.language === "en" ? "contained" : "outlined"}
//                   onClick={() => updateSetting("language", "en")}
//                   className={`settings-language-btn ${settings.language === "en" ? "active" : ""}`}
//                 >
//                   English
//                 </Button>
//                 <Button
//                   variant={settings.language === "ar" ? "contained" : "outlined"}
//                   onClick={() => updateSetting("language", "ar")}
//                   className={`settings-language-btn ${settings.language === "ar" ? "active" : ""}`}
//                 >
//                   العربية
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </TabPanel>

//         {/* Notifications Tab */}
//         <TabPanel value={tabValue} index={2}>
//           <div className="settings-section">
//             <h2 className="settings-section-title">הגדרות התראות</h2>

//             <div className="settings-notification-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.notifications.email}
//                     onChange={(e) => updateSetting("notifications.email", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="התראות אימייל"
//                 className="settings-notification-item"
//               />
//               <Typography variant="body2" className="settings-notification-desc">
//                 קבל התראות לכתובת האימייל שלך
//               </Typography>
//             </div>

//             <div className="settings-notification-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.notifications.push}
//                     onChange={(e) => updateSetting("notifications.push", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="התראות דחיפה"
//                 className="settings-notification-item"
//               />
//               <Typography variant="body2" className="settings-notification-desc">
//                 קבל התראות בדפדפן
//               </Typography>
//             </div>

//             <div className="settings-notification-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.notifications.newSongs}
//                     onChange={(e) => updateSetting("notifications.newSongs", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="שירים חדשים"
//                 className="settings-notification-item"
//               />
//               <Typography variant="body2" className="settings-notification-desc">
//                 קבל התראות כאשר אמנים שאתה עוקב אחריהם מעלים שירים חדשים
//               </Typography>
//             </div>

//             <div className="settings-notification-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.notifications.comments}
//                     onChange={(e) => updateSetting("notifications.comments", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="תגובות"
//                 className="settings-notification-item"
//               />
//               <Typography variant="body2" className="settings-notification-desc">
//                 קבל התראות כאשר מישהו מגיב על השירים שלך
//               </Typography>
//             </div>

//             <div className="settings-notification-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.notifications.followers}
//                     onChange={(e) => updateSetting("notifications.followers", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="עוקבים חדשים"
//                 className="settings-notification-item"
//               />
//               <Typography variant="body2" className="settings-notification-desc">
//                 קבל התראות כאשר מישהו מתחיל לעקוב אחריך
//               </Typography>
//             </div>
//           </div>
//         </TabPanel>

//         {/* Privacy Tab */}
//         <TabPanel value={tabValue} index={3}>
//           <div className="settings-section">
//             <h2 className="settings-section-title">הגדרות פרטיות</h2>

//             <div className="settings-privacy-toggle">
//               <div className="settings-privacy-option">
//                 <div className="settings-privacy-icon">
//                   <EyeOff size={24} />
//                 </div>
//                 <Typography variant="body1">פרופיל פרטי</Typography>
//               </div>

//               <Switch
//                 checked={settings.privacy.profileVisible}
//                 onChange={(e) => updateSetting("privacy.profileVisible", e.target.checked)}
//                 className="settings-privacy-switch"
//               />

//               <div className="settings-privacy-option">
//                 <div className="settings-privacy-icon">
//                   <Eye size={24} />
//                 </div>
//                 <Typography variant="body1">פרופיל ציבורי</Typography>
//               </div>
//             </div>

//             <div className="settings-privacy-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.privacy.showEmail}
//                     onChange={(e) => updateSetting("privacy.showEmail", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="הצג אימייל בפרופיל"
//                 className="settings-privacy-item"
//               />
//               <Typography variant="body2" className="settings-privacy-desc">
//                 אפשר למשתמשים אחרים לראות את כתובת האימייל שלך
//               </Typography>
//             </div>

//             <div className="settings-privacy-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.privacy.showActivity}
//                     onChange={(e) => updateSetting("privacy.showActivity", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="הצג פעילות אחרונה"
//                 className="settings-privacy-item"
//               />
//               <Typography variant="body2" className="settings-privacy-desc">
//                 אפשר למשתמשים אחרים לראות את הפעילות האחרונה שלך
//               </Typography>
//             </div>
//           </div>
//         </TabPanel>

//         {/* Audio Tab */}
//         <TabPanel value={tabValue} index={4}>
//           <div className="settings-section">
//             <h2 className="settings-section-title">הגדרות שמע</h2>

//             <div className="settings-audio-volume">
//               <Typography variant="subtitle1" className="settings-label">
//                 עוצמת קול ({settings.audio.volume}%)
//               </Typography>
//               <div className="settings-volume-slider">
//                 <VolumeX size={20} />
//                 <Slider
//                   value={settings.audio.volume}
//                   onChange={(_e, value) => updateSetting("audio.volume", value as number)}
//                   aria-labelledby="volume-slider"
//                   className="settings-slider"
//                 />
//                 <Volume2 size={20} />
//               </div>
//             </div>

//             <div className="settings-audio-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.audio.autoplay}
//                     onChange={(e) => updateSetting("audio.autoplay", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="השמעה אוטומטית"
//                 className="settings-audio-item"
//               />
//               <Typography variant="body2" className="settings-audio-desc">
//                 השמע שירים באופן אוטומטי בעת טעינת העמוד
//               </Typography>
//             </div>

//             <div className="settings-audio-group">
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={settings.audio.highQuality}
//                     onChange={(e) => updateSetting("audio.highQuality", e.target.checked)}
//                     className="settings-switch"
//                   />
//                 }
//                 label="איכות שמע גבוהה"
//                 className="settings-audio-item"
//               />
//               <Typography variant="body2" className="settings-audio-desc">
//                 השמע שירים באיכות גבוהה (צורך יותר נתונים)
//               </Typography>
//             </div>
//           </div>
//         </TabPanel>
//       </div>

//       <div className="settings-actions">
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<Save />}
//           onClick={saveSettings}
//           disabled={isLoading}
//           className="settings-save-btn"
//         >
//           {isLoading ? "שומר..." : "שמור הגדרות"}
//         </Button>
//       </div>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//           icon={snackbar.severity === "success" ? <Check size={24} /> : <X size={24} />}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   )
// }

// export default Settings
