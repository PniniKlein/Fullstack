import { FormEvent, useRef } from "react"
import { useDispatch } from "react-redux";
import { AddDispatch } from "../store/store";
import { loginUser } from "../store/userSlice";

const Login =()=>{
    const dispatch = useDispatch<AddDispatch>();
    
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: FormEvent) =>{
        e.preventDefault()
        const userLog = {
            email: emailRef.current?.value?emailRef.current?.value:'',
            password: passwordRef.current?.value?passwordRef.current?.value:''
         }
        dispatch(loginUser(userLog));
    }

    return (<>
        {/* <Button variant="contained" size="medium" onClick={() => { setOpen(true) }}
           color="primary" sx={{ margin: 2 }}>SIGN IN</Button>
        <Modal
           open={open}
           onClose={() => { setOpen(false), setError(null) }}
           aria-labelledby="form-modal-title"
           aria-describedby="form-modal-description"
        >
           <Container style={{ position: 'absolute', top: 200, left: 510, maxWidth: '35%' }}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                 {error && (
                    <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} 
                             anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                       <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                          {error}
                       </Alert>
                    </Snackbar>
                 )}
                 <form onSubmit={(e) => handleSubmit(e)}>
                    <TextField label="email" variant="outlined" margin="normal"
                       type="text" inputRef={emailRef} fullWidth
                       InputProps={{
                          startAdornment: (
                          <InputAdornment position="start"><Email /></InputAdornment>),
                       }}></TextField>
                    <TextField label="password" variant="outlined" margin="normal"
                       type="password" inputRef={passwordRef} fullWidth
                       InputProps={{
                          startAdornment: (
                            <InputAdornment position="start"><Lock /></InputAdornment>
                          ),
                        }}></TextField>
                    <Button variant="contained" type="submit" fullWidth sx={{ marginTop: 2, marginRight: 2 }}>
                       SAVE
                    </Button>
                 </form>
              </Paper>
           </Container>
        </Modal> */}
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="email" ref={emailRef}/> <br />
            <input type="text" placeholder="password" ref={passwordRef}/> <br />
            <button type="submit">SAVE</button>
        </form>
     </>)
}
export default Login