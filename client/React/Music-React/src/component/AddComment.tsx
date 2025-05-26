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
  const [isFocused, setIsFocused] = useState(false)
  const maxStars = 5

  const handleMouseEnter = (index: number) => setHoveredValue(index + 1)
  const handleMouseLeave = () => setHoveredValue(null)
  const handleClick = (index: number) => setNewRating(index + 1)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      add()
    }
  }

  const add = () => {
    if (!newComment.trim() && newRating === 0) return
    handleAddComment(newComment, newRating)
    setNewComment("")
    setNewRating(0)
  }

  return (
    <div className="add-comment-modern">
      {/* Background Effects */}
      <div className="add-comment-background-effects">
        <div className="add-comment-gradient-orb"></div>
      </div>

      <motion.div
        className="add-comment-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rating Section */}
        <div className="add-comment-rating-section">
          <div className="rating-label">
            <Star size={16} className="rating-icon" />
            <span>דירוג השיר</span>
          </div>
          <div className="rating-stars-container">
            {[...Array(maxStars)].map((_, index) => (
              <motion.div
                key={index}
                className={`rating-star ${index < (hoveredValue || newRating) ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Star size={20} fill={index < (hoveredValue || newRating) ? "currentColor" : "none"} />
              </motion.div>
            ))}
          </div>
          {newRating > 0 && (
            <motion.div
              className="rating-value"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {newRating}/5
            </motion.div>
          )}
        </div>

        {/* Comment Input Section */}
        <div className="add-comment-input-section">
          <div className={`comment-input-wrapper ${isFocused ? "focused" : ""}`}>
            <div className="input-glow"></div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="שתף את המחשבות שלך על השיר..."
              className="comment-textarea"
              rows={3}
            />

            <motion.button
              className="send-button"
              onClick={add}
              disabled={!newComment.trim() && newRating === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>

        {/* Character Counter */}
        {newComment.length > 0 && (
          <motion.div
            className="character-counter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {newComment.length} תווים
          </motion.div>
        )}
      </motion.div>
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

