import { IconButton } from "@mui/material";
import { ReactElement } from "react";

interface GradientIconButtonProps {
  onClick?: () => void;
  icon: ReactElement;
  hoverIcon?: ReactElement;
}

const GradientIconButton = ({ onClick, icon }: GradientIconButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: "transparent",
        background: "transparent",
        "& .MuiSvgIcon-root": {
          fill: "url(#gradient)",
        },
        "&:hover": {
          opacity: 0.8,
        },
      }}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D59039" />
            <stop offset="100%" stopColor="#F7C26B" />
          </linearGradient>
        </defs>
      </svg>
      {icon}
    </IconButton>
  );
};

export default GradientIconButton;