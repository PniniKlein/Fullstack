import type React from "react"
import "../../SectionDivider.css"

interface SectionDividerProps {
  title?: string
  className?: string
}

const SectionDivider: React.FC<SectionDividerProps> = ({ title, className = "" }) => {
  return (
    <div className={`section-divider ${className}`}>
      <div className="divider-line"></div>
      {title && (
        <>
          <div className="divider-space"></div>
          <h2 className="divider-title">{title}</h2>
          <div className="divider-space"></div>
        </>
      )}
      <div className="divider-line"></div>
    </div>
  )
}

export default SectionDivider
