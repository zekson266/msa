import * as React from 'react';
import { useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, Form, useActionData, useLoaderData, Await  , Link, defer } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';

export default function PostForm() {

    const actionData = useActionData();
    const { postData } = useLoaderData() || {};
    const navigate = useNavigate();

    const errorHelperString = (input) => {
        return actionData &&
            actionData.errors &&
            actionData.errors[input] ? actionData.errors[input] : false;
    }
  
    const [postElements, setPostElements] = useState({body:''});

    return (
    <>
        <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            fullWidth
            onClick={()=>navigate(-1)}
            sx={{ marginBottom: '2ch' }}
        >
            Назад
        </Button>

        <React.Suspense fallback={<LinearProgress />}>
        <Await
            resolve={postData}
            errorElement={<p>Error loading posts!</p>}
        >
            {(postData) => (
            <Form method="post">
                <Paper sx={{padding: '2ch' }}>
                            <Paper sx={{ position: 'relative' }}>                         
                                <CardMedia
                                    component="img"
                                    sx={{minHeight:"194px"}}
                                    image="/avatar.png"
                                    alt="The post image"
                                />
                                <Fab  color="primary" aria-label="add"
                                    sx={{   position: 'absolute', bottom: '2ch', right: '2ch' }}
                                >
                                    <EditIcon onClick={() => navigate('/post/new')}/>
                                </Fab>
                            </Paper>

                            <TextField
                                label="Заголовок статті"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                // required
                                type="text"
                                name="title"
                                value={postData?.title}
                                error={Boolean(errorHelperString('title'))}
                                helperText={errorHelperString('title')}
                                onChange={(ev) => {
                                 
                                        const newPost = { ...postData };
                                        newPost.title = ev.target.value;
                                        setPostElements(newPost);
                                    
                                }}
                            />

                            <TextField
                                label="Текст статті"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                multiline
                                maxRows={25}
                                // required
                                type="text"
                                name="body"
                                value={postData.body}
                                error={Boolean(errorHelperString('body'))}
                                helperText={errorHelperString('body')}
                                onChange={(ev) => {
                                    // Make sure to create a deep copy of post to avoid mutating state
                                    const newPost = { ...postData };
                                  
                                    newPost.body = ev.target.value;
                                    setPostElements(newPost.body); // Update the post object
                                }}
                            />

                            <Button
                                variant="contained"
                                type="submit"
                                startIcon={<SystemUpdateAltIcon />}
                                fullWidth
                            >
                                OK
                            </Button>

                        </Paper>
                    </Form>
                )}
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

    const data  = axiosClient.get(`/post/${params.id}`).then(({data})=>data);

    return defer({
        postData: data
    });
}