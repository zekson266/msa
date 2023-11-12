import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import axiosClient from "../../axios-client";
import { Link, Form, useLocation, useNavigate, useActionData } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from "@mui/material/Paper";


export default function Login() {

  let location = useLocation();
  let navigate = useNavigate();
  const {setUser, setToken} = useAuthContext();
  const actionData = useActionData();
  const[locationState,setLocationState] = useState();

  useEffect(()=>{
    setLocationState(location.state?.from?.pathname || "/");
  },[])
  
  useEffect(()=>{
    if(actionData?.token){
      setUser(actionData.user); 
      setToken(actionData.token);
      //navigate(locationState);
      navigate(-1);
    }
  },[actionData])

  const errorHelperString = (input) => {
    return actionData && actionData[input] ? actionData[input] : '';
  }
  
  return (
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid sm={8}>
        <Paper sx={{padding: '2ch'}}>

          { actionData && actionData.error && <Alert margin="normal" severity="error"> {actionData.error} </Alert> }
          
          <Form action="/login" method="post">
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
              required
              type="email"
              name="email"
              error={Boolean(errorHelperString('email'))}
              helperText={errorHelperString('email')}
            />

            <TextField 
              label="Пароль"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              type="password"
              name="password"
              error={Boolean(errorHelperString('password'))}
              helperText={errorHelperString('password')}
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
        </Paper>
      </Grid>
    </Grid>
  );
}

export const LoginAction = async ({ request }) => {
  const form = await request.formData();
  const payLoad = Object.fromEntries(form.entries());

  try{

    const response = await axiosClient.post('/login', payLoad);
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
  