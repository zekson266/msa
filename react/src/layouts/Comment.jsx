import { Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination from '@mui/material/Pagination';
import { _ } from "../general"
import { useAuthContext } from "../contexts/AuthContextProvider";

export default function Comment({parentId, parentType, userName}){

    const [comments,setComments] = useState();
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [count,setCount] = useState();
    const [error,setError] = useState();
    const authorRef = useRef();
    const commentRef = useRef();

    const handleAddComment = (ev) => {

        ev.preventDefault();

        const payLoad = {
            author: authorRef.current.value,
            parent_id: parentId,
            parent_type: parentType,
            comment: commentRef.current.value,
        };

        const addComment = async () => {
            try {
                const response = await axiosClient.post('comment',payLoad);
                fetchComment();
                commentRef.current.value = '';
                authorRef.current.value = userName ?? null;
                setError(null);

            } catch(err) {
                setError(err.response);
            }
        };

        addComment();

    }

    const fetchComment = async () => {
        try {
            const comments = await axiosClient.get(`comment?parent_id=${parentId}&parent_type=${parentType}&page=${page}`);
            const { data } = comments.data;
            setPage(comments.data.meta.current_page);
            setCount(comments.data.meta.last_page);
            setComments(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(()=>{
        setLoading(true);
        authorRef.current.value = userName ?? null;
        fetchComment();
    },[page,userName]);

    return(
    <Paper sx={{padding: '2ch' }}>

        { loading && ( <LinearProgress sx={{marginBottom: '2ch'}} /> )}

        { comments &&  comments.map(comment => (
            <Box key={comment.id}>
                <Typography sx={{ fontWeight:'bold'}} color='primary'>
                    {comment.author}&nbsp;
                    <Typography sx={{ fontWeight: 'normal'}} variant="span" color='text.secondary'>
                        {comment.created_at}
                    </Typography>
                </Typography>

                <Typography paragraph color='text.secondary'>
                    {comment.comment}
                </Typography>
            </Box>
        ))}

        { (count > 1) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2ch'}}>
                <Pagination page={ page } count={ count } onChange={(ev, page) => setPage(page)} />
            </Box>
        )}

        <form method="post" onSubmit={(ev) => handleAddComment(ev)}>
            <TextField
                label={_('comment_author_label')}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: '2ch' }}
                type="text"
                required
                inputProps={{ maxLength: 55 , minLength: 5 }}
                name="author"
                size="small"
                inputRef={authorRef}
                error={Boolean(error?.data?.errors?.author)}
                helperText={error?.data?.errors?.author}
            />

            <TextField
                label={_('comment_text_label')}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: '2ch' }}
                multiline
                maxRows={3}
                required
                type="text"
                inputProps={{ maxLength: 200 , minLength: 5 }}
                name="comment"
                size="small"
                inputRef={commentRef}
                error={Boolean(error?.data?.errors?.comment)}
                helperText={error?.data?.errors?.comment}
            />

            <Button
                fullWidth
                variant="contained"
                type="submit"
            >
                {_('add_comment_btn')}
            </Button>
        </form>
    </Paper>
    );
}