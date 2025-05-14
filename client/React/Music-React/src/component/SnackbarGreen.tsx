import { Alert, Snackbar } from "@mui/material";

const SnackbarGreen = ({snackbarMessage,snackbarOpen,setSnackbarOpen}:{snackbarMessage:string,snackbarOpen:boolean,setSnackbarOpen:Function}) => {
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
          backgroundColor: "#2E7D32",
          color: "white",
          "& .MuiAlert-icon": { color: "white" },
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>)
}
export default SnackbarGreen;