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
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';

const captions = {
    post_update_success_msg: 'Статтю успішно оновлено' 
};

const  _ = (key) => {
    return captions[key];
}

export default function PostForm() {

    const actionData = useActionData();
    const { postData } = useLoaderData();// || {};
    const navigate = useNavigate();
    const inputFileRef = useRef(null);
    const tmpFileLink = useRef(null);
    const [imageLink, setImageLink] = useState();
    const [imageLoading, setImageLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState(null);
    const [notification, setNotification] = useState();

    const errorHelperString = (input) => {
        return actionData &&
            actionData.errors &&
            actionData.errors[input] ? actionData.errors[input] : false;
    }
  
    const handlingImageUpload = () =>{
        inputFileRef.current.click();
    }

    const showAlert = (errorMessage, type) => {
        setMessage(errorMessage);
        setOpen(true);
        setAlertType(type);
    };

    const showAlert = (errorMessage, type) => {
        setMessage(errorMessage);
        setOpen(true);
        setAlertType(type);
    };

    const handleFileChange = async event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
          return;
        }
        setImageLoading(true);
        console.log('fileObj is', fileObj);
    
        // 👇️ reset file input
        //event.target.value = null;
    
        // 👇️ is now empty
        console.log(event.target.files);
    
        // 👇️ can still access file object here
        console.log(fileObj);
        console.log(fileObj.name);

        var data = new FormData();
        data.append('foo', 'bar');
        data.append('photo', fileObj);

        let response;

        try {
            response = await axiosClient.post('/post/image_upload',data);
            const absoluteImageURL = `${window.location.origin}/${response.data}`;
            setImageLink(absoluteImageURL);
            tmpFileLink.current.value = response.data;
        } catch(err){
            response = err.response;
            console.log(response.data.message);///////////////////////////////////////////////
            showAlert(response.data.message,'error');
        } finally{
            setImageLoading(false);
        }
    };

    React.useEffect(()=>{
        setNotification(actionData?.success);
    },[actionData]);

    return (
    <>
        <input
            style={{display: 'none'}}
            ref={inputFileRef}
            type="file"
            onChange={handleFileChange}
            name="photo"
        />

        <Snackbar
            sx={{marginTop: '8ch'}}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000} // Adjust the duration as needed
            onClose={() => setOpen(false)}
            TransitionComponent={Fade}
        >
            <Alert variant="filled" severity={alertType}>{ message }</Alert>
        </Snackbar>

        <Snackbar
            sx={{marginTop: '8ch'}}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={notification}
            autoHideDuration={4000} // Adjust the duration as needed
            onClose={(event, reason) => {
                if (reason === "clickaway") {
                  return;
                }
                setNotification(false);
            }}
            TransitionComponent={Fade}
        >
            <Alert variant="filled" severity="success">{ _('post_update_success_msg') }</Alert>
        </Snackbar>

        <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            fullWidth
            onClick={()=>navigate(-1)}
            sx={{ marginBottom: '2ch', background: 'white'}}
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
                    <Paper sx={{ position: 'relative', marginBottom: '2ch' }}>                         
                        <CardMedia
                            component="img"
                            sx={{ height:"194px" }}
                            image={imageLink || postData?.photo}
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
                            <EditIcon onClick={(ev) => handlingImageUpload(ev)}/>
                        </Fab>
                    </Paper>

                    <TextField
                        label="Заголовок статті"
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '2ch' }}
                        // required
                        type="text"
                        name="title"
                        defaultValue={postData?.title}
                        error={Boolean(errorHelperString('title'))}
                        helperText={errorHelperString('title')}
                    />

                    <TextField
                        label="Текст статті"
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: '2ch' }}
                        multiline
                        maxRows={25}
                        // required
                        type="text"
                        name="body"
                        defaultValue={postData?.body}
                        error={Boolean(errorHelperString('body'))}
                        helperText={errorHelperString('body')}
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

        if(params.id){
            response = await axiosClient.put(`/post/${params.id}`,payLoad);
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

    const data  = axiosClient.get(`/post/${params.id}`).then(({data})=>data);

    return defer({
        postData: data
    });
}