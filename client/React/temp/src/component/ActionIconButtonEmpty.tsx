import { IconButton } from "@mui/material";
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface ActionIconButtonProps {
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  hoveredIcon: string | null;
  iconId: string;
  IconFilled: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  IconOutlined: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const ActionIconButtonEmpty = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  hoveredIcon,
  iconId,
  IconFilled,
  IconOutlined
}: ActionIconButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        color: "transparent",
        background: "transparent",
        "& .MuiSvgIcon-root": {
          fill: "url(#gradient)",
        },
        "&:hover": {
          opacity: 0.8
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
      {hoveredIcon === iconId ? <IconOutlined /> : <IconFilled />}
    </IconButton>
  );
};

export default ActionIconButtonEmpty;
