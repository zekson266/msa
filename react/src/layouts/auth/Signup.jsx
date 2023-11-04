import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { Form, Link, useActionData, useNavigate, useLocation} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

export default function Signup() {

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
      navigate(locationState);
    }
  },[actionData])

  const errorHelperString = (input) => {
    return actionData && actionData[input] ? actionData[input] : '';
  }

  return (
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid sm={8}>
        <Box>

        { actionData && actionData.error && <Alert margin="normal" severity="error"> {actionData.error} </Alert> }
          
          <Form action="/signup" method="post">
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
              margin="normal"
              required
              type="text"
              name="name"
              error={Boolean(errorHelperString('name'))}
              helperText={errorHelperString('name')}
            />

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

            <TextField 
              label="Підтвердження пароля"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              type="password"
              name="password_confirmation"
              error={Boolean(errorHelperString('password_confirmation'))}
              helperText={errorHelperString('password_confirmation')}
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
          </Form>
        </Box>
      </Grid>
    </Grid>
  );
}

export const SignupAction = async ({ request }) => {
  const form = await request.formData();
  const payLoad = Object.fromEntries(form.entries());

  try{

    const response = await axiosClient.post('/signup', payLoad)
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
  