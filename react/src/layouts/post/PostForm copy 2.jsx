import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams, Form, useActionData, useLoaderData, useLocation, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Paper from "@mui/material/Paper";

export default function PostForm() {

    const actionData = useActionData();
    const loaderData = useLoaderData();
    const navigate = useNavigate();
    
    const errorHelperString = (input) => {
        return actionData &&
            actionData.errors &&
            actionData.errors[input] ? actionData.errors[input] : false;
    }

    useEffect(()=>{
        
    },[actionData])

    const {id} = useParams();

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

  

    const handlingSubmit = (ev) => {
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
            
            <Form method="post">
            <Link onClick={()=>navigate(-1)}>Zalupa</Link>
            <Paper sx={{padding: '2ch' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                <Box 
                    component="img"
                    sx={{ maxWidth: '100%', maxHeight: '150px' }}
                    alt="The house from the offer."
                    src="/avatar.png"
                /></Box>

                 <TextField
                    label="Заголовок статті"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    // required
                    type="text"
                    name="title"
                    value={loaderData?.data?.title}
                    error={Boolean(errorHelperString('title'))}
                    helperText={errorHelperString('title')}
                    onChange={ev => setPost({...post, title: ev.target.value})}
                />

                <TextField
                    label="Текст статті"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    // required
                    type="text"
                    name="body"
                    value={loaderData?.data?.body}
                    error={Boolean(errorHelperString('body'))}
                    helperText={errorHelperString('body')}
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

            </Paper>
            </Form>
        )}
    </>
    );
}

export const PostFormAction = async ({ request, params }) => {
    const form = await request.formData();
    const payLoad = Object.fromEntries(form.entries());
    let response;

    try{

        if(params.id){
            debugger;
            response = await axiosClient.put(`/post/${params.id}`,payLoad);
        } else {
            debugger;
            response = await axiosClient.post(`/post`,payLoad);
        }

        const {data} = response;
        return data;

    } catch(err) {

        response = err.response;
      
        if(!response.data.errors){
          return { error: response.data.message };
        }
        return response.data;
    }
}

export async function PostFormLoader({ request, params }) {

    try{
        return await axiosClient.get(`/post/${params.id}`)
    } catch (err){
        return err.response;
    }
    
    return null;
}