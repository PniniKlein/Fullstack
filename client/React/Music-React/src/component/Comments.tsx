"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Comment } from "../model/Comment"
import { Edit, Trash2, ChevronDown, ChevronUp, MessageCircle, Star, Calendar, Heart, Send } from "lucide-react"
import "../css/Comments.css"
import { deleteComment, updateComment } from "../services/CommentsService"

interface CommentsProps {
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  currentUser: number
}

const Comments = ({ comments, currentUser, setComments }: CommentsProps) => {
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState<string>("")
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [showAllComments, setShowAllComments] = useState(false)
  const [hoveredComment, setHoveredComment] = useState<number | null>(null)
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [hoveredStars, setHoveredStars] = useState<{ [key: number]: number | null }>({})
  const [editedRating, setEditedRating] = useState<number>(0)
  const editInputRef = useRef<HTMLInputElement>(null)

  const visibleComments = showAllComments ? comments : comments.slice(0, 3)

  const handleEdit = (comment: Comment) => {
    setIsEditing(comment.id)
    setEditedContent(comment.content)
    setEditedRating(comment.star)
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus()
      }
    }, 100)
  }

  const handleSave = async (comment: Comment) => {
    if (!editedContent.trim()) return

    setLoadingStates((prev) => ({ ...prev, [comment.id]: true }))
    const updatedComment = {
      content: editedContent,
      star: editedRating || comment.star,
      songId: comment.songId,
      userId: comment.user.id,
    }

    try {
      await updateComment(comment.id, updatedComment)
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === comment.id ? { ...c, content: editedContent, star: editedRating || comment.star } : c,
        ),
      )
      setIsEditing(null)
      setEditedContent("")
      setEditedRating(0)
    } catch (error) {
      console.error("שגיאה בעדכון התגובה:", error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, [comment.id]: false }))
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    setEditedContent("")
    setEditedRating(0)
  }

  const handleDeleteComment = async (commentId: number) => {
    setLoadingStates((prev) => ({ ...prev, [commentId]: true }))
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (error) {
      console.error("שגיאה במחיקת התגובה:", error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  const toggleCommentExpand = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  const isCommentExpanded = (commentId: number) => {
    return expandedComments.includes(commentId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
  }

  const handleStarHover = (commentId: number, starIndex: number) => {
    setHoveredStars((prev) => ({ ...prev, [commentId]: starIndex + 1 }))
  }

  const handleStarLeave = (commentId: number) => {
    setHoveredStars((prev) => ({ ...prev, [commentId]: null }))
  }

  const handleStarClick = (starIndex: number) => {
    setEditedRating(starIndex + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, comment: Comment) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave(comment)
    }
  }

  return (
    <div className="comments-elegant">
      {/* Header */}
      <div className="comments-header-elegant">
        <div className="header-content-elegant">
          <div className="header-title-elegant">
            <MessageCircle className="header-icon-elegant" size={24} />
            <h2>תגובות על השיר</h2>
          </div>
          <div className="comments-count-elegant">
            <span>{comments.length} תגובות</span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="comments-list-elegant">
        <AnimatePresence>
          {visibleComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className={`comment-item-elegant ${isEditing === comment.id ? "editing" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="comment-header-elegant">
                <div className="comment-user-info-elegant">
                  <div className="user-avatar-elegant">
                    {comment.user.pathProfile ? (
                      <img
                        src={comment.user.pathProfile || "/placeholder.svg"}
                        alt={comment.user.userName}
                        className="avatar-image-elegant"
                      />
                    ) : (
                      <span>{comment.user.userName[0]}</span>
                    )}
                  </div>
                  <div className="user-details-elegant">
                    <h4 className="user-name-elegant">{comment.user.userName}</h4>
                    <p className="comment-date-elegant">
                      <Calendar size={12} />
                      <span>{formatDate(comment.create_at.toString())}</span>
                    </p>
                  </div>
                </div>

                {isEditing !== comment.id && (
                  <div className="comment-meta-elegant">

                    {comment.user.id === currentUser && (
                      <div className="comment-actions-elegant">
                        <button
                          className="action-button-elegant edit-btn"
                          onClick={() => handleEdit(comment)}
                          disabled={loadingStates[comment.id]}
                        >
                          <Edit size={14} />
                          <span>ערוך</span>
                        </button>
                        <button
                          className="action-button-elegant delete-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={loadingStates[comment.id]}
                        >
                          {loadingStates[comment.id] ? (
                            <>
                              <div className="loading-spinner-small"></div>
                              <span>מוחק...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              <span>מחק</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    <div className="comment-rating-elegant">
                      <div className="rating-stars-elegant">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={14}
                            className={`rating-star-elegant ${starIndex < comment.star ? "filled" : ""}`}
                            fill={starIndex < comment.star ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="rating-number-elegant">{comment.star}/5</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {isEditing === comment.id ? (
                <div className="comment-edit-elegant">
                  <div className="edit-input-wrapper-elegant">
                    <div className="edit-stars-elegant">
                      {[...Array(5)].map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className={`edit-star-elegant ${
                            starIndex < (hoveredStars[comment.id] || editedRating) ? "active" : ""
                          }`}
                          onMouseEnter={() => handleStarHover(comment.id, starIndex)}
                          onMouseLeave={() => handleStarLeave(comment.id)}
                          onClick={() => handleStarClick(starIndex)}
                        >
                          ★
                        </span>
                      ))}
                      <span className="star-divider-elegant"></span>
                    </div>
                    <input
                      ref={editInputRef}
                      type="text"
                      className="edit-input-elegant"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, comment)}
                      placeholder="ערוך את התגובה שלך..."
                    />
                    <div className="edit-actions-elegant">
                      <button
                        className="edit-send-btn-elegant"
                        onClick={() => handleSave(comment)}
                        disabled={loadingStates[comment.id]}
                      >
                        {loadingStates[comment.id] ? <div className="loading-spinner-small"></div> : <Send size={16} />}
                      </button>
                      <button className="edit-cancel-btn-elegant" onClick={handleCancel}>
                        <span>ביטול</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="comment-content-elegant">
                  <p
                    className={`comment-text-elegant ${
                      comment.content.length > 150 && !isCommentExpanded(comment.id) ? "truncated" : ""
                    }`}
                  >
                    {comment.content}
                  </p>

                  {comment.content.length > 150 && (
                    <button className="expand-btn-elegant" onClick={() => toggleCommentExpand(comment.id)}>
                      {isCommentExpanded(comment.id) ? (
                        <>
                          <ChevronUp size={14} />
                          <span>הצג פחות</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>הצג יותר</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              <div className="comment-glow-elegant"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {comments.length > 3 && (
        <div className="show-more-container-elegant">
          <button className="show-more-btn-elegant" onClick={() => setShowAllComments(!showAllComments)}>
            {showAllComments ? (
              <>
                <ChevronUp size={16} />
                <span>הצג פחות תגובות</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>הצג עוד {comments.length - 3} תגובות</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Summary */}
      {comments.length > 0 && (
        <div className="comments-summary-elegant">
          <Heart size={16} className="comments-summary-icon-elegant" />
          <p className="comments-summary-text-elegant">
          <span className="comments-summary-highlight-elegant">{comments.length}</span> תגובות נכתבו על השיר הזה.{" "}
          </p>
        </div>
      )}
    </div>
  )
}

export default Comments
