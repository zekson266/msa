import { useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';

export default function Login() {

  const {setUser, setToken} = useUserContext();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors,setErrors] = useState();
  const [emailError,setEmailError] = useState();
  const [passwordError,setPasswordError] = useState();

  const onSubmit = (ev) => {
    ev.preventDefault();

    setErrors('');
    setEmailError('');
    setPasswordError('');

    const payLoad = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    
    axiosClient.post('login',payLoad)
    .then(({data})=>{
      setUser(data.user);
      setToken(data.token);
    })
    .catch(err => {
      const response = err.response;

      if(response && response.status === 422 && !response.data.errors)
        setErrors(response.data.message);

      if(response.data.errors && response.data.errors.email)
        setEmailError(response.data.errors.email[0])
      
      if(response.data.errors && response.data.errors.password)
        setPasswordError(response.data.errors.password[0])

    })
  }

  return (
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid md={6}>
        <Box>

          { errors && <Alert margin="normal" severity="error"> {errors} </Alert> }
          
          <form onSubmit={onSubmit}>
            <Typography
              variant="h4"
              textAlign="center"
              margin="normal"
            >
              Вхід
            </Typography>

            <TextField
              label="Електронна адреса"
              fullWidth
              variant="outlined"
              inputRef={emailRef}
              margin="normal"
              error={Boolean(emailError)}
              helperText={emailError}
              required
              type="email"
            />

            <TextField 
              label="Пароль"
              fullWidth
              variant="outlined"
              inputRef={passwordRef}
              margin="normal"
              error={Boolean(passwordError)}
              helperText={passwordError}
              required
              type="password"
            />

            <Typography
              variant="h6"
              gutterBottom
              textAlign="center"
              margin="normal"
            >
              Не має облікового запису? <Link to="/signup" style={{ textDecoration: "none" }}>Зареєструватися</Link>
            </Typography>
        
            <Button
              variant="contained"
              type="submit"
              startIcon={<LoginIcon />}
              fullWidth
            >
              Увійти
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
  