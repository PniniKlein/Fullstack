"use client"

import { useState } from "react"
import { Box, Typography, Button, TextField, FormControlLabel, Switch, Divider } from "@mui/material"
import MicIcon from "@mui/icons-material/Mic"
import ColorLensIcon from "@mui/icons-material/ColorLens"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SecurityIcon from "@mui/icons-material/Security"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import "../css/setting.css"

const Settings = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [activeTab, setActiveTab] = useState("appearance")
  const [primaryColor, setPrimaryColor] = useState("#d59039")

  // מערך של צבעים לבחירה
  const colorOptions = [
    { name: "כתום-זהב", value: "#d59039" },
    { name: "כחול", value: "#3f51b5" },
    { name: "ירוק", value: "#4caf50" },
    { name: "אדום", value: "#f44336" },
    { name: "סגול", value: "#9c27b0" },
    { name: "טורקיז", value: "#009688" },
  ]

  // פונקציה לשינוי צבע ראשי
  const changeThemeColor = (color: string) => {
    setPrimaryColor(color)
    document.documentElement.style.setProperty("--color-primary-main", color)

    // חישוב גוונים בהירים וכהים יותר
    const lighterColor = getLighterColor(color, 20)
    const darkerColor = getDarkerColor(color, 20)

    document.documentElement.style.setProperty("--color-primary-light", lighterColor)
    document.documentElement.style.setProperty("--color-primary-dark", darkerColor)
    document.documentElement.style.setProperty(
      "--gradient-primary",
      `linear-gradient(90deg, ${color}, ${lighterColor})`,
    )
  }

  // פונקציה להבהרת צבע
  const getLighterColor = (hex: string, percent: number) => {
    const num = Number.parseInt(hex.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = ((num >> 8) & 0x00ff) + amt
    const B = (num & 0x0000ff) + amt
    return `#${((1 << 24) | ((R < 255 ? R : 255) << 16) | ((G < 255 ? G : 255) << 8) | (B < 255 ? B : 255)).toString(16).slice(1)}`
  }

  // פונקציה להכהיית צבע
  const getDarkerColor = (hex: string, percent: number) => {
    const num = Number.parseInt(hex.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = ((num >> 8) & 0x00ff) - amt
    const B = (num & 0x0000ff) - amt
    return `#${((1 << 24) | ((R > 0 ? R : 0) << 16) | ((G > 0 ? G : 0) << 8) | (B > 0 ? B : 0)).toString(16).slice(1)}`
  }

  return (
    <Box className="settings-page">
      <Box className="settings-container">
        <Box className="settings-header">
          <Box className="settings-title-container">
            <div className="mic-icon-container">
              <div className="mic-line"></div>
              <MicIcon className="mic-icon" />
              <div className="mic-line"></div>
            </div>
            <Typography variant="h2" className="settings-title">
              הגדרות
            </Typography>
          </Box>
          <Typography variant="h6" className="settings-subtitle">
            התאם את חווית המשתמש שלך בפלטפורמה
          </Typography>
        </Box>

        <Box className="settings-layout">
          <Box className="settings-sidebar">
            <Box className="settings-nav">
              <Box
                className={`settings-nav-item ${activeTab === "appearance" ? "active" : ""}`}
                onClick={() => setActiveTab("appearance")}
              >
                <ColorLensIcon className="settings-nav-icon" />
                <Typography>מראה ותצוגה</Typography>
              </Box>

              <Box
                className={`settings-nav-item ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <AccountCircleIcon className="settings-nav-icon" />
                <Typography>פרטי חשבון</Typography>
              </Box>

              <Box
                className={`settings-nav-item ${activeTab === "privacy" ? "active" : ""}`}
                onClick={() => setActiveTab("privacy")}
              >
                <VisibilityIcon className="settings-nav-icon" />
                <Typography>פרטיות</Typography>
              </Box>

              <Box
                className={`settings-nav-item ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <NotificationsIcon className="settings-nav-icon" />
                <Typography>התראות</Typography>
              </Box>

              <Box
                className={`settings-nav-item ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <SecurityIcon className="settings-nav-icon" />
                <Typography>אבטחה</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="settings-content">
            {activeTab === "appearance" && (
              <Box>
                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <ColorLensIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      צבעים וערכת נושא
                    </Typography>
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">צבע ראשי</Typography>
                    <Box className="settings-color-options">
                      {colorOptions.map((color) => (
                        <Box
                          key={color.value}
                          className={`settings-color-option ${color.value === primaryColor ? "active" : ""}`}
                          sx={{ backgroundColor: color.value }}
                          onClick={() => changeThemeColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">מצב כהה</Typography>
                      <Typography className="settings-toggle-description">
                        שימוש ברקע כהה לחוויית משתמש נוחה יותר
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={true}
                          disabled
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">אנימציות</Typography>
                      <Typography className="settings-toggle-description">הפעל אנימציות ואפקטים ויזואליים</Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", margin: "24px 0" }} />

                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <MicIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      הגדרות נגן
                    </Typography>
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">איכות שמע גבוהה</Typography>
                      <Typography className="settings-toggle-description">
                        הפעל איכות שמע גבוהה (צורך יותר נתונים)
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">ויזואליזציה של שמע</Typography>
                      <Typography className="settings-toggle-description">
                        הצג אפקטים ויזואליים בזמן ניגון מוזיקה
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Box className="settings-actions">
                  <Button variant="outlined" className="btn btn-outline">
                    איפוס להגדרות ברירת מחדל
                  </Button>
                  <Button variant="contained" className="btn btn-primary">
                    שמור שינויים
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === "account" && (
              <Box>
                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <AccountCircleIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      פרטי חשבון
                    </Typography>
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">שם משתמש</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue={user?.userName || ""}
                      className="settings-form-control"
                      sx={{
                        backgroundColor: "var(--color-background-elevated)",
                        borderRadius: "var(--border-radius-small)",
                        "& .MuiInputBase-input": {
                          color: "var(--color-text-primary)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">אימייל</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue={user?.email || ""}
                      className="settings-form-control"
                      sx={{
                        backgroundColor: "var(--color-background-elevated)",
                        borderRadius: "var(--border-radius-small)",
                        "& .MuiInputBase-input": {
                          color: "var(--color-text-primary)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Box className="settings-actions">
                  <Button variant="outlined" className="btn btn-outline">
                    ביטול
                  </Button>
                  <Button variant="contained" className="btn btn-primary">
                    שמור שינויים
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === "privacy" && (
              <Box>
                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <VisibilityIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      הגדרות פרטיות
                    </Typography>
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">פרופיל ציבורי</Typography>
                      <Typography className="settings-toggle-description">
                        אפשר למשתמשים אחרים לצפות בפרופיל שלך
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">הצג היסטוריית האזנה</Typography>
                      <Typography className="settings-toggle-description">
                        אפשר למשתמשים אחרים לראות למה האזנת לאחרונה
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Box className="settings-actions">
                  <Button variant="outlined" className="btn btn-outline">
                    ביטול
                  </Button>
                  <Button variant="contained" className="btn btn-primary">
                    שמור שינויים
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === "notifications" && (
              <Box>
                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <NotificationsIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      הגדרות התראות
                    </Typography>
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">התראות על שירים חדשים</Typography>
                      <Typography className="settings-toggle-description">
                        קבל התראות כאשר אמנים שאתה עוקב אחריהם מעלים שירים חדשים
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>

                  <Box className="settings-toggle-group">
                    <Box>
                      <Typography className="settings-toggle-label">התראות על תגובות</Typography>
                      <Typography className="settings-toggle-description">
                        קבל התראות כאשר מישהו מגיב על השירים שלך
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          defaultChecked
                          sx={{
                            "& .MuiSwitch-switchBase": {
                              color: "#777",
                            },
                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                              backgroundColor: "#888",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: primaryColor,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              background: `linear-gradient(90deg, ${primaryColor}, ${getLighterColor(primaryColor, 20)})`,
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Box className="settings-actions">
                  <Button variant="outlined" className="btn btn-outline">
                    ביטול
                  </Button>
                  <Button variant="contained" className="btn btn-primary">
                    שמור שינויים
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === "security" && (
              <Box>
                <Box className="settings-section">
                  <Box className="settings-section-title-container">
                    <div className="mic-icon-container">
                      <div className="mic-line"></div>
                      <SecurityIcon className="mic-icon" />
                      <div className="mic-line"></div>
                    </div>
                    <Typography variant="h5" className="settings-section-title">
                      אבטחה
                    </Typography>
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">סיסמה נוכחית</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      className="settings-form-control"
                      sx={{
                        backgroundColor: "var(--color-background-elevated)",
                        borderRadius: "var(--border-radius-small)",
                        "& .MuiInputBase-input": {
                          color: "var(--color-text-primary)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">סיסמה חדשה</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      className="settings-form-control"
                      sx={{
                        backgroundColor: "var(--color-background-elevated)",
                        borderRadius: "var(--border-radius-small)",
                        "& .MuiInputBase-input": {
                          color: "var(--color-text-primary)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box className="settings-form-group">
                    <Typography className="settings-form-label">אימות סיסמה חדשה</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      className="settings-form-control"
                      sx={{
                        backgroundColor: "var(--color-background-elevated)",
                        borderRadius: "var(--border-radius-small)",
                        "& .MuiInputBase-input": {
                          color: "var(--color-text-primary)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary-main)",
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Box className="settings-actions">
                  <Button variant="outlined" className="btn btn-outline">
                    ביטול
                  </Button>
                  <Button variant="contained" className="btn btn-primary">
                    עדכן סיסמה
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Settings
