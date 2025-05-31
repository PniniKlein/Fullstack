// import type React from "react"
import "../../css/SkeletonLoader.css"
import { motion } from "framer-motion"

// interface SkeletonLoaderProps {
//   type?: "rectangle" | "circle" | "text" | "card" | "song" | "artist"
//   width?: string | number
//   height?: string | number
//   count?: number
//   className?: string
// }

const SkeletonLoader = ({text}:{text:string}) => {

  return (
    <>
      <div className="loading-modern">
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="loading-spinner"></div>
              <div className="loading-text">{text}</div>
            </motion.div>

            {/* Loading Skeletons */}
            <div className="loading-grid-modern">
              {Array(12)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="loading-skeleton">
                    <div className="loading-skeleton-avatar"></div>
                    <div className="loading-skeleton-name"></div>
                    <div className="loading-skeleton-stats"></div>
                  </div>
                ))}
            </div>
          </div>
    </>
  )
}

export default SkeletonLoader
