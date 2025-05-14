import { Download } from "@mui/icons-material";
import GradientIconButton from "./GradientIconButton"; // עדכן את הנתיב אם צריך
import { Song } from "../model/Song";
import { handleDownload } from "../services/SongsService";

const DownloadSong = ({ song, className }: { song: Song; className?: string }) => {
  return (
    <GradientIconButton
      className={className}
      onClick={() => handleDownload(song)}
      icon={<Download sx={{ fontSize: 28 }} />}
    />
  );
};
export default DownloadSong;