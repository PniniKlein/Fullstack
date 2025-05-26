import type React from "react"

const MicrophoneIcon: React.FC = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="microphone-svg"
    >
      <defs>
        <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d59039" />
          <stop offset="100%" stopColor="#f7c26b" />
        </linearGradient>
        <linearGradient id="micGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7c26b" />
          <stop offset="100%" stopColor="#d59039" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main microphone body */}
      <path
        d="M40 15C40 10 36 5 30 5C24 5 20 10 20 15V40C20 45 24 50 30 50C36 50 40 45 40 40V15Z"
        fill="url(#micGradient)"
        filter="url(#glow)"
      />

      {/* Microphone head (mesh grille) */}
      <ellipse cx="30" cy="15" rx="10" ry="10" fill="#1a1a1a" opacity="0.7" />

      {/* Grille pattern */}
      <path
        d="M24 10H36M23 13H37M22 16H38M23 19H37M24 22H36"
        stroke="url(#micGradient)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      {/* Microphone body details */}
      <path
        d="M20 30V40C20 45 24 50 30 50C36 50 40 45 40 40V30"
        stroke="url(#micGradient2)"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Microphone handle */}
      <rect x="28" y="50" width="4" height="20" rx="2" fill="url(#micGradient)" />

      {/* Base stand */}
      <ellipse cx="30" cy="70" rx="12" ry="3" fill="url(#micGradient)" opacity="0.5" />

      {/* Brand logo */}
      <text x="30" y="35" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" opacity="0.9">
        SING
      </text>

      {/* Sound waves */}
      <path
        d="M45 15C48.3137 15 51 17.6863 51 21C51 24.3137 48.3137 27 45 27"
        stroke="url(#micGradient)"
        strokeWidth="1"
        strokeLinecap="round"
        className="wave-animation wave-1"
      />
      <path
        d="M48 12C53.5228 12 58 16.4772 58 22C58 27.5228 53.5228 32 48 32"
        stroke="url(#micGradient)"
        strokeWidth="1"
        strokeLinecap="round"
        className="wave-animation wave-2"
      />
      <path
        d="M51 9C58.732 9 65 15.268 65 23C65 30.732 58.732 37 51 37"
        stroke="url(#micGradient)"
        strokeWidth="1"
        strokeLinecap="round"
        className="wave-animation wave-3"
      />

      {/* Musical notes */}
      <path
        d="M15 20 L15 35 C15 38, 10 38, 10 35 C10 32, 15 32, 15 35"
        fill="url(#micGradient)"
        opacity="0.8"
        className="floating-note note-1"
      />
      <path
        d="M10 30 L10 45 C10 48, 5 48, 5 45 C5 42, 10 42, 10 45"
        fill="url(#micGradient)"
        opacity="0.6"
        className="floating-note note-2"
      />

      {/* Microphone switch */}
      <rect x="22" y="42" width="16" height="3" rx="1.5" fill="#222" />
      <rect x="24" y="42" width="12" height="3" rx="1.5" fill="url(#micGradient)" opacity="0.5" />

      {/* Reflection highlights */}
      <path d="M22 20C22 20, 24 20, 24 25C24 30, 22 30, 22 30" fill="white" opacity="0.1" />
      <path d="M38 20C38 20, 36 20, 36 25C36 30, 38 30, 38 30" fill="white" opacity="0.1" />
    </svg>
  )
}

export default MicrophoneIcon
