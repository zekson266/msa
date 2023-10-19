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

export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState();
    let navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(()=>{
        getUsers();
    },[page])

    const handlingDelete = (id) => {
        if(!window.confirm('are you sure to delete?')){
            return ;
        }

        axiosClient.delete(`/users/${id}`)
        .then(()=>{
            getUsers();
        })
    }

    const getUsers = () => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}&itemsPerPage=${itemsPerPage}`)
        .then(({data})=>{
            console.log(data);
            setLoading(false);
            setUsers(data.data);
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
            <AddIcon onClick={() => navigate('/users/new')}/>
        </Fab>
        
        { loading && 
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        }

        { !loading && 
            <List sx={{width: '100%', bgcolor: 'background.paper' }}>
            { users.map((u, index) => (
                <Box key={u.id}>
                    <ListItem   >
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={u.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {u.email}
                                    </Typography><br/>
                                    {' '+u.created_at}
                                </React.Fragment>
                            }                        
                        />
                        <Box display="flex">
                            <IconButton aria-label="edit"color="primary" onClick={ev => navigate(`/users/${u.id}`)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" color="error" onClick={ev => handlingDelete(u.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </ListItem>
                    { index !== users.length - 1 && <Divider variant="inset" component="li" /> }
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
  