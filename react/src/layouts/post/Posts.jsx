import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';

export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState();
    let navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(()=>{
        getPosts();
    },[page])

    const handlingDelete = (id) => {
        if(!window.confirm('are you sure to delete?')){
            return ;
        }

        axiosClient.delete(`/posts/${id}`)
        .then(()=>{
            getPosts();
        })
    }

    const getPosts = () => {
        setLoading(true);
        axiosClient.get(`/posts?page=${page}&itemsPerPage=${itemsPerPage}`)
        .then(({data})=>{
            setPosts(data.data);
            setLoading(false);
            setTotalPages(data.meta.last_page);
        })
        .catch(()=>{
            setLoading(false);
        })
    }

    return (
    <>
        <Fab  color="primary" aria-label="add" 
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
            <AddIcon onClick={() => navigate('/posts/new')}/>
        </Fab>
        
        { loading && 
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        }

        { !loading && 
            <List sx={{width: '100%', bgcolor: 'background.paper' }}>
            { posts.map((p, index) => (
                <Box key={p.id}>
                    <ListItem   >
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={p.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {p.author}
                                    </Typography><br/>
                                    {' '+p.created_at}
                                </React.Fragment>
                            }                        
                        />
                        <Box display="flex">
                            <IconButton aria-label="edit"color="primary" onClick={ev => navigate(`/posts/${p.id}`)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" color="error" onClick={ev => handlingDelete(p.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </ListItem>
                    { index !== posts.length - 1 && <Divider variant="inset" component="li" /> }
                </Box>
            ))}
                <Box display="flex" justifyContent="center">
                    <Pagination page={page} count={ totalPages } onChange={(ev, page) => setPage(page)} />
                </Box>
            </List>
        }
    </>
    );
}
  