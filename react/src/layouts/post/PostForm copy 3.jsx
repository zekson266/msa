import * as React from 'react';
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams, Form, useActionData, useLoaderData, Await  , Link, defer } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Paper from "@mui/material/Paper";

export default function PostForm() {

    const actionData = useActionData();
    const { post } = useLoaderData();
    const navigate = useNavigate();
    const { data } = post;
    
    const errorHelperString = (input) => {
        return actionData &&
            actionData.errors &&
            actionData.errors[input] ? actionData.errors[input] : false;
    }

    useEffect(()=>{
        setPostElements(post);
    },[])

    const {id} = useParams();
  
    const [postElements, setPostElements] = useState({
        users_id: null,
        title: '',
        body: '',
        photo: null,
        category: null,
        active: true,
        rating: 0,
    });
// console.log(postElements);


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
        <React.Suspense fallback={<LinearProgress />}>
        <Await
          resolve={post}
          errorElement={<p>Error loading posts!</p>}
        >
        {(post) => (
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
                    value={post?.data?.title}
                    error={Boolean(errorHelperString('title'))}
                    helperText={errorHelperString('title')}
                    onChange={(ev) => {
                        // Make sure to create a deep copy of post to avoid mutating state
                        const newPost = { ...post };
                        if (!newPost.data) {
                          newPost.data = {}; // Ensure the nested data object exists
                        }
                        newPost.data.title = ev.target.value;
                        setPostElements(newPost); // Update the post object
                      }}
                />

                <TextField
                    label="Текст статті"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    // required
                    type="text"
                    name="body"
                    value={post?.data?.body}
                    error={Boolean(errorHelperString('body'))}
                    helperText={errorHelperString('body')}
                    onChange={(ev) => {
                        // Make sure to create a deep copy of post to avoid mutating state
                        const newPost = { ...post };
                        newPost.data.body = ev.target.value;
                        setPostElements(newPost); // Update the post object
                      }}
                      
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
            </Form>)}
            </Await>
      </React.Suspense>
    </>
    );
}

export const PostFormAction = async ({ request, params }) => {
    const form = await request.formData();
    const payLoad = Object.fromEntries(form.entries());
    let response;

    try{

        if(params.id){
            response = await axiosClient.put(`/post/${params.id}`,payLoad);
        } else {
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

    return defer({
        post: axiosClient.get(`/post/${params.id}`)
    });
}