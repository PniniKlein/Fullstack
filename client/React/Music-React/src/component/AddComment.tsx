"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Star } from "lucide-react"
import "../css/AddComment.css"

interface AddCommentProps {
  handleAddComment: (comment: string, rating: number) => void
}

const AddComment = ({ handleAddComment }: AddCommentProps) => {
  const [newComment, setNewComment] = useState<string>("")
  const [newRating, setNewRating] = useState<number>(0)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const maxStars = 5

  const handleMouseEnter = (index: number) => setHoveredValue(index + 1)
  const handleMouseLeave = () => setHoveredValue(null)
  const handleClick = (index: number) => setNewRating(index + 1)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      add()
    }
  }

  const add = async () => {
    if (!newComment.trim() && newRating === 0) return

    setIsLoading(true)
    try {
      await handleAddComment(newComment, newRating)
      setNewComment("")
      setNewRating(0)
    } catch (error) {
      console.error("שגיאה בהוספת התגובה:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="add-comment-mui-style">
      <div className="add-comment-comment-input-container">
        <div className="add-comment-rating-section-inline">
          {[...Array(maxStars)].map((_, index) => (
            <motion.div
              key={index}
              className={`add-comment-star-rating ${index < (hoveredValue || newRating) ? "hovered" : ""}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star size={20} fill={index < (hoveredValue || newRating) ? "currentColor" : "none"} />
            </motion.div>
          ))}
          <div className="add-comment-divider-line"></div>
        </div>

        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="כתוב תגובה..."
          className="add-comment-comment-input-field"
          disabled={isLoading}
        />

        <motion.button
          className="add-comment-send-button-inline"
          onClick={add}
          disabled={(!newComment.trim() && newRating === 0) || isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? <div className="add-comment-loading-spinner-inline"></div> : <Send size={18} />}
        </motion.button>
      </div>
    </div>
  )
}

export default AddComment



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

