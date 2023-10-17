import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Unstable_Grid2';

export default function UserForm() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors,setErrors] = useState();
    const [emailError,setEmailError] = useState();
    const [passwordError,setPasswordError] = useState();
    const [nameError,setNameError] = useState();
    const [passwordConfirmationError,setPasswordConfirmationError] = useState();

    if(id){
        useEffect(()=>{
            setLoading(true);

            axiosClient.get(`/users/${id}`)
            .then(({data})=>{
                setUser(data);
                setLoading(false);
            })
            .catch(()=>{
                setLoading(false);
            })
        },[])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        if(user.id){
            axiosClient.put(`/users/${user.id}`,user)
            .then(()=>{
                //notification
                navigate('/users')
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
        } else {
            axiosClient.post(`/users`,user)
            .then(()=>{
                //notification
                navigate('/users')
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
    }

    return (
    <>
        { loading && 
            <Box sx={{ width: '100%', marginTop: '2ch' }}>
                <LinearProgress />
            </Box>
        }

        { errors && <Alert margin="normal" severity="error"> {errors} </Alert> }

        { !loading && (
            <form onSubmit={onSubmit}>

                {/* { user.id && (
                    <Typography
                        variant="h4"
                        textAlign="center"
                        margin="normal"
                    >
                        Редагувати профіль
                    </Typography>
                )}

                { !user.id && (
                    <Typography
                    variant="h4"
                    textAlign="center"
                    margin="normal"
                    >
                    Новий профіль
                    </Typography>
                )} */}

                <Box display="flex" justifyContent="center" margin="normal">
                    <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 80, height: 80 }}
                    />
                </Box>

                <TextField
                    label="Ім'я"
                    fullWidth
                    variant="outlined"
                    value={user.name}
                    margin="normal"
                    error={Boolean(nameError)}
                    helperText={nameError}
                    onChange={ev => setUser({...user, name: ev.target.value})}
                    required
                    type="text"
                />
                {/* <div className="mb-3">
                    <label className="form-label">Name: </label>
                    <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} type="text" className="form-control" />
                </div> */}

                <TextField
                    label="Електронна адреса"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(emailError)}
                    helperText={emailError}
                    required
                    type="email"
                    value={user.email} 
                    onChange={ev => setUser({...user, email: ev.target.value})}
                />
                {/* <div className="mb-3">
                    <label className="form-label">Email: </label>
                    <input value={user.email}  onChange={ev => setUser({...user, email: ev.target.value})}type="email" className="form-control" />
                </div> */}

                <TextField 
                    label="Пароль"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                    onChange={ev => setUser({...user, password: ev.target.value})}
                    type="password"
                />

                <TextField 
                    label="Підтвердження пароля"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(passwordConfirmationError)}
                    helperText={passwordConfirmationError}
                    onChange={ev => setUser({...user, password_confirmation: ev.target.value})}
                    type="password"
                />
                {/* <div className="mb-3">
                    <label className="form-label ">Password: </label>
            <input  onChange={ev => setUser({...user, password: ev.target.value})} type="password" className="form-control"/>
                </div>
                <div className="mb-3">
                    <label className="form-label ">Password confirmation: </label>
                <input  onChange={ev => setUser({...user, password_confirmation: ev.target.value})} type="password" className="form-control"/>
                </div>
                <button type="submit">Save</button> */}
                <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SystemUpdateAltIcon />}
                    fullWidth
                >
                    ОК
                </Button>
            </form>
        )}
    </>
    );
}
  