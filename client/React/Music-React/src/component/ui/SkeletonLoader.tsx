import type React from "react"
import "../../css/SkeletonLoader.css"

interface SkeletonLoaderProps {
  type?: "rectangle" | "circle" | "text" | "card" | "song" | "artist"
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "rectangle",
  width,
  height,
  count = 1,
  className = "",
}) => {
  const getSkeletonClass = () => {
    switch (type) {
      case "circle":
        return "skeleton-circle"
      case "text":
        return "skeleton-text"
      case "card":
        return "skeleton-card"
      case "song":
        return "skeleton-song"
      case "artist":
        return "skeleton-artist"
      default:
        return "skeleton-rectangle"
    }
  }

  const renderSkeleton = () => {
    if (type === "song") {
      return (
        <div className="skeleton-song-card">
          <div className="skeleton-song-image"></div>
          <div className="skeleton-song-content">
            <div className="skeleton-song-title"></div>
            <div className="skeleton-song-artist"></div>
            <div className="skeleton-song-genre"></div>
          </div>
          <div className="skeleton-song-actions">
            <div className="skeleton-song-action"></div>
            <div className="skeleton-song-action"></div>
          </div>
        </div>
      )
    }

    if (type === "artist") {
      return (
        <div className="skeleton-artist-card">
          <div className="skeleton-artist-avatar"></div>
          <div className="skeleton-artist-name"></div>
        </div>
      )
    }

    return (
      <div
        className={`skeleton ${getSkeletonClass()} ${className}`}
        style={{
          width: width || "100%",
          height: height || (type === "text" ? "1rem" : "100px"),
        }}
      ></div>
    )
  }

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="skeleton-wrapper">
            {renderSkeleton()}
          </div>
        ))}
    </>
  )
}

export default SkeletonLoader
