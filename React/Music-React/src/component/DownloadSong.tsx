import { Download } from "@mui/icons-material";
import GradientIconButton from "./GradientIconButton"; // עדכן את הנתיב אם צריך
import { Song } from "../model/Song";
import { handleDownload } from "../services/SongsService";

const DownloadSong = ({ song }: { song: Song }) => {


  return (
    <GradientIconButton
      onClick={() => handleDownload(song)}
      icon={<Download sx={{ fontSize: 28 }}/>}
    />
  );
};

export default DownloadSong;

//   return (
//     <ActionIconButton
//       onClick={handleDownload}
//       onMouseEnter={() => setHoveredIcon("download")}
//       onMouseLeave={() => setHoveredIcon(null)}
//       hoveredIcon={hoveredIcon}
//       iconId="download"
//       IconFilled={DownloadIcon}
//       IconOutlined={DownloadOutlinedIcon}
//     />
//   );
