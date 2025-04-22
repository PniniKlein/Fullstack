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
              src={comment.user.pathProfile || "/avatars/default-avatar.jpg"}
              className="comment-avatar"
            />
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