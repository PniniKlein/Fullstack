import { Box, Card, Typography, Avatar, Rating, Button, TextField } from "@mui/material";
import { Comment } from "../model/Comment";
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from "react";
import ActionIconButtonEmpty from "./ActionIconButtonEmpty";
import "../css/Comments.css";
import SnackbarGreen from "./SnackbarGreen";
import { deleteComment } from "../services/CommentsService";
import { updateComment } from "../services/CommentsService";

interface CommentsProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  currentUser: number;
}

const Comments = ({ comments, currentUser, setComments }: CommentsProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEdit = (comment: Comment) => {
    setIsEditing(comment.id);
    setEditedContent(comment.content);
  };

  const handleSave = async (comment: Comment) => {
    if (!editedContent.trim()) return; // לא לשמור תוכן ריק

    const updatedComment = {
      content: editedContent,
      star: comment.star,
      songId: comment.songId,
      userId: comment.user.id,
    };

    try {
      await updateComment(comment.id, updatedComment);

      // עדכון הסטייט המקומי
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === comment.id ? { ...c, content: editedContent } : c
        )
      );

      setSnackbarMessage("התגובה עודכנה בהצלחה!");
      setSnackbarOpen(true);
      setIsEditing(null);
      setEditedContent("");
    } catch (error) {
      console.error("שגיאה בעדכון התגובה:", error);
      setSnackbarMessage("אירעה שגיאה בעת עדכון התגובה.");
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedContent("");
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setSnackbarMessage("התגובה נמחקה בהצלחה!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("שגיאה במחיקת התגובה:", error);
    }
  };

  return (
    <>
      <Box className="comments-title">
        <Typography variant="h4" className="comments-title">
          תגובות
        </Typography>
      </Box>
      {comments.map((comment, index) => (
        <Card key={index} className="comment-card">
          <Box className="comment-header">
            <Avatar
              src={comment.user.pathProfile || ""}
              className="comment-avatar"
            >
              {!comment.user.pathProfile && comment.user.userName[0]}
            </Avatar>
            <Box className="comment-user-box">
              <Typography variant="h6" className="comment-username">
                {comment.user.userName}
              </Typography>
              <Rating
                value={comment.star}
                readOnly
                className="comment-rating"
              />

              {isEditing === comment.id ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    variant="standard"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSave(comment);
                      }
                    }}
                    className={`comment-edit-field ${isEditing === comment.id ? "editing" : ""}`}
                  />

                  <Box className="comment-edit-actions">
                    <Typography variant="body2" className="comment-date">
                      {new Date(comment.create_at).toLocaleDateString("he-IL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>

                    <Box className="comment-buttons">
                      <Button
                        onClick={() => handleSave(comment)}
                        variant="contained"
                        className="update-button"
                      >
                        עדכן
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outlined"
                        className="cancel-button"
                      >
                        ביטול
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body1" className="comment-content">
                    {comment.content}
                  </Typography>

                  <Box className="comment-date">
                    <Typography variant="body2">
                      {new Date(comment.create_at).toLocaleDateString("he-IL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {comment.user.id === currentUser && (
            <Box className="comment-actions">
              <ActionIconButtonEmpty
                onClick={() => handleEdit(comment)}
                onMouseEnter={() => setHoveredIcon(`edit-${comment.id}`)}
                onMouseLeave={() => setHoveredIcon(null)}
                hoveredIcon={hoveredIcon}
                iconId={`edit-${comment.id}`}
                IconFilled={EditIcon}
                IconOutlined={EditOutlinedIcon}
              />

              <ActionIconButtonEmpty
                onClick={() => handleDeleteComment(comment.id)}
                onMouseEnter={() => setHoveredIcon(`delete-${comment.id}`)}
                onMouseLeave={() => setHoveredIcon(null)}
                hoveredIcon={hoveredIcon}
                iconId={`delete-${comment.id}`}
                IconFilled={DeleteIcon}
                IconOutlined={DeleteOutlinedIcon}
              />
            </Box>
          )}
        </Card>
      ))}
      <SnackbarGreen
        snackbarMessage={snackbarMessage}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen} />
    </>
  );
};
export default Comments;

// "use client"

// import type React from "react"

// import { useState, useRef } from "react"
// import { Box, Card, Typography, Avatar, Rating, Button, TextField, Tooltip } from "@mui/material"
// import type { Comment } from "../model/Comment"
// import EditIcon from "@mui/icons-material/Edit"
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
// import DeleteIcon from "@mui/icons-material/Delete"
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
// import ExpandLessIcon from "@mui/icons-material/ExpandLess"
// import ActionIconButtonEmpty from "./ActionIconButtonEmpty"
// import "../css/Comments.css"
// import SnackbarGreen from "./SnackbarGreen"
// import { deleteComment, updateComment } from "../services/CommentsService"

// interface CommentsProps {
//   comments: Comment[]
//   setComments: React.Dispatch<React.SetStateAction<Comment[]>>
//   currentUser: number
// }

// const Comments = ({ comments, currentUser, setComments }: CommentsProps) => {
//   const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
//   const [isEditing, setIsEditing] = useState<number | null>(null)
//   const [editedContent, setEditedContent] = useState<string>("")
//   const [snackbarOpen, setSnackbarOpen] = useState(false)
//   const [snackbarMessage, setSnackbarMessage] = useState("")
//   const [expandedComments, setExpandedComments] = useState<number[]>([])
//   const [showAllComments, setShowAllComments] = useState(false)
//   const editFieldRef = useRef<HTMLDivElement>(null)

//   const visibleComments = showAllComments ? comments : comments.slice(0, 3)

//   const handleEdit = (comment: Comment) => {
//     setIsEditing(comment.id)
//     setEditedContent(comment.content)
//     setTimeout(() => {
//       if (editFieldRef.current) {
//         const textarea = editFieldRef.current.querySelector("textarea")
//         if (textarea) textarea.focus()
//       }
//     }, 100)
//   }

//   const handleSave = async (comment: Comment) => {
//     if (!editedContent.trim()) return

//     const updatedComment = {
//       content: editedContent,
//       star: comment.star,
//       songId: comment.songId,
//       userId: comment.user.id,
//     }

//     try {
//       await updateComment(comment.id, updatedComment)

//       setComments((prevComments) =>
//         prevComments.map((c) => (c.id === comment.id ? { ...c, content: editedContent } : c)),
//       )

//       setSnackbarMessage("התגובה עודכנה בהצלחה!")
//       setSnackbarOpen(true)
//       setIsEditing(null)
//       setEditedContent("")
//     } catch (error) {
//       console.error("שגיאה בעדכון התגובה:", error)
//       setSnackbarMessage("אירעה שגיאה בעת עדכון התגובה.")
//       setSnackbarOpen(true)
//     }
//   }

//   const handleCancel = () => {
//     setIsEditing(null)
//     setEditedContent("")
//   }

//   const handleDeleteComment = async (commentId: number) => {
//     try {
//       await deleteComment(commentId)
//       setComments((prev) => prev.filter((comment) => comment.id !== commentId))
//       setSnackbarMessage("התגובה נמחקה בהצלחה!")
//       setSnackbarOpen(true)
//     } catch (error) {
//       console.error("שגיאה במחיקת התגובה:", error)
//       setSnackbarMessage("אירעה שגיאה בעת מחיקת התגובה.")
//       setSnackbarOpen(true)
//     }
//   }

//   const toggleCommentExpand = (commentId: number) => {
//     setExpandedComments((prev) =>
//       prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
//     )
//   }

//   const isCommentExpanded = (commentId: number) => {
//     return expandedComments.includes(commentId)
//   }

//   return (
//     <>
//       <Box className="comments-header">
//         <Typography variant="h4" className="comments-title">
//           תגובות
//         </Typography>
//         <Typography variant="body2" className="comments-count">
//           {comments.length} תגובות
//         </Typography>
//       </Box>

//       <Box className="comments-list">
//         {visibleComments.map((comment) => (
//           <Card key={comment.id} className="comment-card">
//             <Box className="comment-header">
//               <Avatar src={comment.user.pathProfile || ""} className="comment-avatar">
//                 {!comment.user.pathProfile && comment.user.userName[0]}
//               </Avatar>

//               <Box className="comment-user-info">
//                 <Box className="comment-user-header">
//                   <Typography variant="h6" className="comment-username">
//                     {comment.user.userName}
//                   </Typography>
//                   <Typography variant="body2" className="comment-date">
//                     {new Date(comment.create_at).toLocaleDateString("he-IL", {
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </Typography>
//                 </Box>

//                 <Rating value={comment.star} readOnly className="comment-rating" />

//                 {isEditing === comment.id ? (
//                   <Box className="comment-edit-container" ref={editFieldRef}>
//                     <TextField
//                       fullWidth
//                       multiline
//                       variant="outlined"
//                       value={editedContent}
//                       onChange={(e) => setEditedContent(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault()
//                           handleSave(comment)
//                         }
//                       }}
//                       className="comment-edit-field"
//                       placeholder="ערוך את התגובה שלך..."
//                       autoFocus
//                     />

//                     <Box className="comment-edit-actions">
//                       <Button onClick={() => handleSave(comment)} variant="contained" className="save-button">
//                         עדכן
//                       </Button>
//                       <Button onClick={handleCancel} variant="outlined" className="cancel-button">
//                         ביטול
//                       </Button>
//                     </Box>
//                   </Box>
//                 ) : (
//                   <Box className="comment-content-container">
//                     <Typography
//                       variant="body1"
//                       className={`comment-content ${
//                         comment.content.length > 150 && !isCommentExpanded(comment.id) ? "truncated" : ""
//                       }`}
//                     >
//                       {comment.content}
//                     </Typography>

//                     {comment.content.length > 150 && (
//                       <Button
//                         onClick={() => toggleCommentExpand(comment.id)}
//                         className="expand-button"
//                         endIcon={isCommentExpanded(comment.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                       >
//                         {isCommentExpanded(comment.id) ? "הצג פחות" : "הצג יותר"}
//                       </Button>
//                     )}
//                   </Box>
//                 )}
//               </Box>
//             </Box>

//             {comment.user.id === currentUser && (
//               <Box className="comment-actions">
//                 <Tooltip title="ערוך תגובה" placement="top">
//                   <span>
//                     <ActionIconButtonEmpty
//                       onClick={() => handleEdit(comment)}
//                       onMouseEnter={() => setHoveredIcon(`edit-${comment.id}`)}
//                       onMouseLeave={() => setHoveredIcon(null)}
//                       hoveredIcon={hoveredIcon}
//                       iconId={`edit-${comment.id}`}
//                       IconFilled={EditIcon}
//                       IconOutlined={EditOutlinedIcon}
//                     />
//                   </span>
//                 </Tooltip>

//                 <Tooltip title="מחק תגובה" placement="top">
//                   <span>
//                     <ActionIconButtonEmpty
//                       onClick={() => handleDeleteComment(comment.id)}
//                       onMouseEnter={() => setHoveredIcon(`delete-${comment.id}`)}
//                       onMouseLeave={() => setHoveredIcon(null)}
//                       hoveredIcon={hoveredIcon}
//                       iconId={`delete-${comment.id}`}
//                       IconFilled={DeleteIcon}
//                       IconOutlined={DeleteOutlinedIcon}
//                     />
//                   </span>
//                 </Tooltip>
//               </Box>
//             )}
//           </Card>
//         ))}
//       </Box>

//       {comments.length > 3 && (
//         <Box className="show-more-container">
//           <Button
//             onClick={() => setShowAllComments(!showAllComments)}
//             className="show-more-button"
//             endIcon={showAllComments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//           >
//             {showAllComments ? "הצג פחות תגובות" : `הצג עוד ${comments.length - 3} תגובות`}
//           </Button>
//         </Box>
//       )}

//       <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
//     </>
//   )
// }

// export default Comments
