import { useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

export default function Signup() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors,setErrors] = useState();
  const [emailError,setEmailError] = useState();
  const [passwordError,setPasswordError] = useState();
  const [nameError,setNameError] = useState();
  const [passwordConfirmationError,setPasswordConfirmationError] = useState();

  const {setUser, setToken } = useAuthContext();

  const onSubmit = (ev) => {
      ev.preventDefault();

      const payLoad = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        password_confirmation: passwordConfirmationRef.current.value,
      }

      axiosClient.post('signup',payLoad)
      .then(({data})=>{
        setUser(data.user);
        setToken(data.token);
      })
      .catch(err=>{
        const response = err.response;

        if(response && response.status === 422 && !response.data.errors)
          setErrors(response.data.message);

        if(response.data.errors && response.data.errors.email)
          setEmailError(response.data.errors.email[0])
        
        if(response.data.errors && response.data.errors.password)
          setPasswordError(response.data.errors.password[0])

        if(response.data.errors && response.data.errors.name)
          setNameError(response.data.errors.name[0])
        
        if(response.data.errors && response.data.errors.password_confirmation)
          setPasswordConfirmationError(response.data.errors.password_confirmation[0])
          
      })
  }

  return (
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid sm={8}>
        <Box>

        { actionData && actionData.error && <Alert margin="normal" severity="error"> {actionData.error} </Alert> }
          
          <form onSubmit={onSubmit}>
            <Typography
              variant="h4"
              textAlign="center"
              margin="normal"
            >
              Реєстрація
            </Typography>

            <TextField
              label="Ім'я"
              fullWidth
              variant="outlined"
              inputRef={nameRef}
              margin="normal"
              error={Boolean(nameError)}//
              helperText={nameError}//
              required
              type="text"
            />

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

            <TextField 
              label="Підтвердження пароля"
              fullWidth
              variant="outlined"
              inputRef={passwordConfirmationRef}
              margin="normal"
              error={Boolean(passwordConfirmationError)}
              helperText={passwordConfirmationError}
              required
              type="password"
            />

            <Typography
              variant="subtitle1"
              gutterBottom
              textAlign="center"
              margin="normal"
            >
              Уже є обліковий запис? <Link to="/login" style={{ textDecoration: "none" }}>Увійти</Link>
            </Typography>
        
            <Button
              variant="contained"
              type="submit"
              startIcon={<LoginIcon />}
              fullWidth
            >
              Зареєструвати
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export const SignupAction = async ({ request }) => {
  const form = await request.formData();
  const payLoad = Object.fromEntries(form.entries());

  try{

    const response = await axiosClient.post('/login', payLoad)
    const {data} = response;
    return data;

  } catch(err) {

    const response = err.response;
  
    if(!response.data.errors){
      return { error: response.data.message};
    }
    return response.data.errors;
  }
}
  