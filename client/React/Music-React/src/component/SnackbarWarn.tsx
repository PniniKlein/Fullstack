import { Alert, Snackbar } from "@mui/material";

const SnackbarWarn = ({snackbarMessage,snackbarOpen,setSnackbarOpen,col}:{snackbarMessage:string,snackbarOpen:boolean,setSnackbarOpen:Function,col:string}) => {
    return (<>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity="success"
        sx={{
          backgroundColor: col=="green"?"#2E7D32":"#D32F2F",
          color: "white",
          "& .MuiAlert-icon": { color: "white" },
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>)
}
export default SnackbarWarn;