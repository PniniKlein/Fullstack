import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Send } from "@mui/icons-material";
import React, { useState } from "react";
import "../css/AddComment.css"; // ייבוא קובץ CSS

const AddComment = ({ handleAddComment }: { handleAddComment: (comment: string, rating: number) => void; }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const maxStars = 5;

  const handleMouseEnter = (index: number) => setHoveredValue(index + 1);
  const handleMouseLeave = () => setHoveredValue(null);
  const handleClick = (index: number) => setNewRating(index + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") add();
  };

  const add = () => {
    handleAddComment(newComment, newRating);
    setNewComment("");
    setNewRating(0);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <TextField
        multiline
        placeholder="כתוב תגובה..."
        rows={1}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        // className="comment-input" // הוספת מחלקת CSS
        sx={{
          width: "700px",
          borderRadius: "10px",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#212121",
            borderRadius: "10px",
            color: "#f1f1f1",
            fontSize: "18px",
            paddingRight: "8px",
            minHeight: "46px",
            // "&.Mui-focused fieldset": { borderColor: "#333" },
            '& fieldset': {
              borderColor: '#F7C26B', // צבע גבול (כמו חום)
            },
            '&:hover fieldset': {
              borderColor: '#F7C26B', // צבע גבול על hover (כמו זהב)
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F7C26B', // צבע גבול כשיש focus
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff', // צבע הטקסט (לבן)
            padding: '10px', // ריווח פנימי
          },
          "& input": {
            color: "#f1f1f1",
            padding: "10px 0",
          },
          "& fieldset": {
            borderColor: "#444",
          },
          "&:hover fieldset": {
            borderColor: "#666",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                <Box sx={{ display: "flex", gap: "4px" }}>
                  {[...Array(maxStars)].map((_, index) => (
                    <Box
                      key={index}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(index)}
                      className={`star ${index < (hoveredValue || newRating) ? 'hovered' : ''}`} // הוספת מחלקת CSS
                    >
                      ★
                    </Box>
                  ))}
                </Box>
                <Box sx={{ height: "24px", width: "1px", backgroundColor: "#555", marginLeft: "8px", marginRight: "8px" }} />
              </Box>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => add()}
                className="send-icon" // הוספת מחלקת CSS
              >
                <Send />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default AddComment;

// "use client"

// import { Box, TextField, IconButton, InputAdornment, Tooltip } from "@mui/material"
// import { Send, EmojiEmotions } from "@mui/icons-material"
// import type React from "react"
// import { useState, useRef } from "react"
// import "../css/AddComment.css"

// interface AddCommentProps {
//   handleAddComment: (comment: string, rating: number) => void
// }

// const AddComment = ({ handleAddComment }: AddCommentProps) => {
//   const [newComment, setNewComment] = useState<string>("")
//   const [newRating, setNewRating] = useState<number>(0)
//   const [hoveredValue, setHoveredValue] = useState<number | null>(null)
//   const [isExpanded, setIsExpanded] = useState<boolean>(false)
//   const textFieldRef = useRef<HTMLDivElement>(null)
//   const maxStars = 5

//   const handleMouseEnter = (index: number) => setHoveredValue(index + 1)
//   const handleMouseLeave = () => setHoveredValue(null)
//   const handleClick = (index: number) => setNewRating(index + 1)

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       add()
//     }
//   }

//   const add = () => {
//     if (!newComment.trim() && !newRating) return
//     handleAddComment(newComment, newRating)
//     setNewComment("")
//     setNewRating(0)
//     setIsExpanded(false)
//   }

//   const handleFocus = () => {
//     setIsExpanded(true)
//   }

//   const handleBlur = (e: React.FocusEvent) => {
//     // Only collapse if clicking outside the component
//     if (textFieldRef.current && !textFieldRef.current.contains(e.relatedTarget as Node)) {
//       if (!newComment.trim() && !newRating) {
//         setIsExpanded(false)
//       }
//     }
//   }

//   return (
//     <Box className="add-comment-wrapper" ref={textFieldRef} onBlur={handleBlur}>
//       <TextField
//         multiline
//         placeholder="כתוב תגובה..."
//         rows={isExpanded ? 3 : 1}
//         value={newComment}
//         onChange={(e) => setNewComment(e.target.value)}
//         onKeyDown={handleKeyDown}
//         onFocus={handleFocus}
//         variant="outlined"
//         className={`comment-input ${isExpanded ? "expanded" : ""}`}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Box className="rating-stars-container">
//                 {[...Array(maxStars)].map((_, index) => (
//                   <Box
//                     key={index}
//                     onMouseEnter={() => handleMouseEnter(index)}
//                     onMouseLeave={handleMouseLeave}
//                     onClick={() => handleClick(index)}
//                     className={`rating-star ${index < (hoveredValue || newRating) ? "active" : ""}`}
//                   >
//                     ★
//                   </Box>
//                 ))}
//               </Box>
//               <Box className="divider" />
//             </InputAdornment>
//           ),
//           endAdornment: (
//             <InputAdornment position="end" className="input-actions">
//               <Tooltip title="הוסף אימוג'י" placement="top">
//                 <IconButton className="emoji-button">
//                   <EmojiEmotions />
//                 </IconButton>
//               </Tooltip>
//               <IconButton onClick={add} className="send-button" disabled={!newComment.trim() && !newRating}>
//                 <Send />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />

//       {isExpanded && (
//         <Box className="comment-tips">
//           <span>טיפ: לחץ על הכוכבים כדי לדרג, לחץ Enter לשליחה</span>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default AddComment
