import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

export default function PostForm() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({
        users_id: null,
        title: '',
        body: '',
        photo: null,
        category: null,
        active: true,
        rating: 0,
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

            axiosClient.get(`/posts/${id}`)
            .then(({data})=>{
                setPost(data);
                setLoading(false);
            })
            .catch(()=>{
                setLoading(false);
            })
        },[])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        if(post.id){
            axiosClient.put(`/posts/${post.id}`,post)
            .then(()=>{
                //notification
                navigate('/posts');
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
            axiosClient.post(`/posts`,post)
            .then(()=>{
                //notification
                navigate('/posts')
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

                <Box display="flex" justifyContent="center" margin="normal">
                    <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 80, height: 80 }}
                    />
                </Box>

                <TextField
                    label="Заголовок статті"
                    fullWidth
                    variant="outlined"
                    value={post.title}
                    margin="normal"
                    error={Boolean(nameError)}///////////////////////////
                    helperText={nameError}///////////////////////
                    onChange={ev => setPost({...post, title: ev.target.value})}
                    required
                    type="text"
                />

                <TextField
                    label="Текст статті"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={Boolean(emailError)}
                    helperText={emailError}
                    required
                    type="text"
                    value={post.body} 
                    onChange={ev => setPost({...post, body: ev.target.value})}
                />

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
  