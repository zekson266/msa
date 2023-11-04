import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import axiosClient from "../../axios-client";
import { Form, Link, useActionData, useLocation, useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';


export default function Login() {
  let location = useLocation();
  const [locationState, setLocationState] = useState();
  const actionData = useActionData();
  const {setUser, setToken} = useAuthContext();
  let navigate = useNavigate();
  const redirectUrl = location.state?.from?.pathname || "/";
    
  useEffect(()=>{
    setLocationState(redirectUrl)
    },[]);
    

  console.log(locationState);

  if(actionData && actionData.token){
   
    
   
    
  // let navigate = useNavigate();

 
  // setUser(actionData.user);
  // setToken(actionData.token);
   navigate(locationState);
  }
  
  const errorHelperString = (input) => {
    return actionData && actionData[input] ? actionData[input] : '';
  }
  

  const onSubmitAction = async (ev) => {
    ev.preventDefault();


    try{
      const response = await axiosClient.post('/login',payLoad)
      const {data} = response;

      setUser(data.user);
      setToken(data.token);
      navigate(redirectUrl);

    } catch(err) {
      const response = err.response;

      setErrorHelper(response.data.errors);

      if(!response.data.errors){
        setErrorMessage(response.data.message);
      }else{
        setErrorMessage(null);
      }
    }
  }

  return (
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid md={8}>
        <Box>

          { actionData && actionData.error && <Alert margin="normal" severity="error"> {actionData.error} </Alert> }
          
          <Form action='/login' method="post">
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

              margin="normal"
              error={Boolean(errorHelperString('email'))}
              helperText={errorHelperString('email')}
              // required
              type="email"
              name="email"
            />

            <TextField 
              label="Пароль"
              fullWidth
              variant="outlined"

              margin="normal"
              error={Boolean(errorHelperString('password'))}
              helperText={errorHelperString('password')}
              // required
              type="password"
              name="password"
            />

            <Typography
              variant="subtitle1"
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
          </Form>
        </Box>
      </Grid>
    </Grid>
  );
}

export const LoginAction = async ({ request }) => {
  const formData = await request.formData();

  const payLoad = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try{
    const response = await axiosClient.post('/login',payLoad)
    const {data} = response;

    return data;

  } catch(err) {
    const response = err.response;

    

    if(!response.data.errors){
      return { error: response.data.message };
    }else{
      return response.data.errors;
    }
  }
}
  