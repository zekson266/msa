import * as React from 'react';
import { useRef, useState } from 'react';
import axiosClient from "../../axios-client";
import { useNavigate, Form, useActionData, useLoaderData, Await, defer } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import SnackbarAlert, { _ , links, useAlert } from '../../general';

export default function PostForm() {

    const actionData = useActionData();
    const { postPromise } = useLoaderData() || {};
    const navigate = useNavigate();
    const inputFileRef = useRef(null);
    const tmpFileLink = useRef(null);
    const [imageLink, setImageLink] = useState();
    const [imageLoading, setImageLoading] = useState(false);
    const {message, type, open, showAlert, hideAlert } = useAlert();

    const handlingEditPhotoClick = () =>{
        inputFileRef.current.click();
    }

    const handleFileChange = async event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
          return;
        }
        setImageLoading(true);

        event.target.value = null;

        var data = new FormData();

        data.append('photo', fileObj);

        let response;

        try {
            response = await axiosClient.post('/post/image_upload',data);
            const absoluteImageURL = `${window.location.origin}/${response.data}`;
            console.log(response);
            setImageLink(absoluteImageURL);
            tmpFileLink.current.value = response.data;
        } catch(err){
            response = err.response;
            showAlert(response.data.message,'error');
        } finally{
            setImageLoading(false);
        }
    };

    React.useEffect(()=>{
        if(actionData?.success){
            showAlert(_('post_update_success_msg'), 'success');
        }
    },[actionData]);

    return (
    <>
        <input
            style={{display: 'none'}}
            ref={ inputFileRef }
            type="file"
            onChange={ handleFileChange }
            name="photo"
            accept="image/*"
        />

        <SnackbarAlert message={message} open={open} type={type} onClose={hideAlert} />

        <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            fullWidth
            onClick={()=>navigate(-1)}
            sx={{ marginBottom: '2ch', background: 'white'}}
        >
            {_('back_btn')}
        </Button>

        <React.Suspense fallback={<LinearProgress />}>
        <Await
            resolve={postPromise}
            errorElement={<p>Error loading posts!</p>}
        >
            {(postPromise) => (
                <Form method="post">
                <Paper sx={{padding: '2ch' }}>
                    <Paper elevation={0} sx={{ position: 'relative', marginBottom: '2ch' }}>                         
                        <CardMedia
                            component="img"
                            sx={{ height:"194px" }}
                            image={ imageLink || postPromise?.photo || '/image.jpg' }
                            alt="The post image"
                        />
                        {imageLoading && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                }}
                            >
                               <CircularProgress />
                            </div>
                        )}
                        <Fab  color="primary" aria-label="add"
                            sx={{   position: 'absolute', bottom: '2ch', right: '2ch' }}
                        >
                            <EditIcon onClick={(ev) => handlingEditPhotoClick(ev)}/>
                        </Fab>
                    </Paper>

                    <TextField
                        label="Заголовок статті"
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '2ch' }}
                        type="text"
                        required
                        inputProps={{ maxLength: 55 , minLength: 5 }}
                        name="title"
                        defaultValue={postPromise?.title}
                        error={Boolean(actionData?.errors?.title)}
                        helperText={actionData?.errors?.title}
                    />

                    <TextField
                        label="Текст статті"
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '2ch' }}
                        multiline
                        maxRows={25}
                        required
                        type="text"
                        inputProps={{ maxLength: 2000 , minLength: 55 }}
                        name="body"
                        defaultValue={postPromise?.body}
                        error={Boolean(actionData?.errors?.body)}
                        helperText={actionData?.errors?.body}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        startIcon={<SystemUpdateAltIcon />}
                        fullWidth
                    >
                        OK
                    </Button>

                    <input
                        style={{display: 'none'}}
                        ref={tmpFileLink}
                        type="text"
                        name="photo"
                    />

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

        if(params.postId){
            response = await axiosClient.put(`/post/${params.postId}`,payLoad);
        } else {
            response = await axiosClient.post(`/post`,payLoad);
        }

        response.data.success = true;

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

export async function PostFormLoader({ params }) {

    const data = axiosClient.get(links['post_show_route'] + params.postId).then(({data})=>data);

    return defer({
        postPromise: data
    });
}