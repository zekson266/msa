import * as React from 'react';
import axiosClient from "../../axios-client";
import Pagination from '@mui/material/Pagination';
import { Await, useLoaderData, defer, useNavigate, Link } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuthContext } from '../../contexts/AuthContextProvider';

const captions = {
  edit_menu_item: 'Редагувати',
  delete_menu_item: 'Видалити',
  delete_confirmation: 'Ви дійсно хочете видалити пост?',
  reade_full: ' ... Ще',
  reade_short: ''
};

const menu = [captions['edit_menu_item'], captions['delete_menu_item']];

const links = {
  post_new: '/post/new',
  post_photo: '/image.jpg',
  post_index_route: '/post?page',
  post_delete_route: '/post/',
  post_show: '/post/show/',
  post_edit: '/post/edit/'
};

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export default function PostIndex() {

    const  { postsPromise } = useLoaderData();
    const [expanded, setExpanded] = React.useState({});
    let navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState({});
    const { user } = useAuthContext();
    const [fullText, setFullText] = React.useState({});

    const FullTextClick = postId => {
      setFullText(prev => ({...prev, [postId]: !prev[postId]}));
    };
    
    const handleExpandClick = (postId) => {
      setExpanded(prev => ({
        ...prev,
        [postId]: !prev[postId]  
      }));
    };

    const handleOpenUserMenu = (event, postId) => {
      setAnchorElUser(prev => ({...prev, [postId]: event.currentTarget}));
    };

    const handleCloseUserMenu = (menuItem, postId) => {
      setAnchorElUser(prev => {
        const copy = {...prev}; 
        delete copy[postId];
        return copy;
      });

      if(menuItem === captions['edit_menu_item']){
        navigate(`${links['post_edit']}${postId}`);
      }
      if(menuItem === captions['delete_menu_item']){
        handleDeletePost(postId);
      }
    }

    const handleDeletePost = async (postId) => {
      if(!window.confirm(captions['delete_confirmation'])){
        return ;
      }

      await axiosClient.delete(`${links['post_delete_route']}${postId}`)
      .then(()=>{
        navigate();          
      })
    }

    return (<>
      <Fab  color="primary" aria-label="add" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon onClick={() => navigate(links['post_new'])}/>
      </Fab>

      <React.Suspense fallback={<LinearProgress />}>
        <Await
          resolve={postsPromise}
          errorElement={<p>Error loading posts!</p>}
        >
          {(postsPromise) => (
            <>
              {postsPromise.data.data.map((post)=>(
              <Box key={post.id}>
              
              <Card sx={{ maxWidth: '100%', marginBottom: '2ch'}}>

                {/* Header */}
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    { post.id }
                    </Avatar>
                  }
                  action={ post.author === user.name && (
                    <IconButton onClick={(event) => handleOpenUserMenu(event, post.id)} aria-label="settings">
                      <MoreVertIcon />
                    </IconButton> )
                  }
                  title={
                    <Typography variant="subtitle1" component="div"  sx={{ lineHeight: 1.2 }}>
                      {post.title}
                    </Typography> }
                  subheader={ post.created_at }
                />

                {/* Image */}
                <Link to={`${links['post_show']}${post.id}`}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={post.photo || links['post_photo']}
                    alt="Post photo"
                  />
                </Link>

                {/* Action buttons */}
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                      <ShareIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expanded[post.id]}
                    onClick={() => handleExpandClick(post.id)}
                    aria-expanded={expanded[post.id]}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                
                {/* Content */}
                <CardContent>
                  <Typography variant="body2" color1="text.secondary">
                  {fullText[post.id] ? post.body : `${post.body.slice(0, 150)}`}
                  {post.body.length > 150 && ( 
                    <Link onClick={() => FullTextClick(post.id)} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                      { fullText[post.id] ? captions['reade_short'] : captions['reade_full']}
                    </Link>
                  )}
                  </Typography>
                </CardContent>
                <Box></Box>

                {/* Collapsable content */}
                <Collapse in={expanded[post.id]} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography variant='h5'>
                      Collapsable content
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>

              {/* Post menu */}
              { post.author === user.name && (
                <Menu
                  sx={{ mt: '45px' }}
                  id={`menu-appbar-${post.id}`}
                  anchorEl={anchorElUser[post.id]}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser[post.id])}
                  onClose={() => setAnchorElUser({})}
                >
                  {menu.map((menuItem, index) => (
                    <MenuItem key={menuItem} onClick={(ev) => handleCloseUserMenu(menuItem, post.id)}>
                      <Typography 
                        color={ index === menu.length - 1 ? "error" : ''}
                        textAlign="center"
                      >
                        {menuItem}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              )}

            </Box>))}
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              <Pagination page={ postsPromise.data.meta.current_page } count={ postsPromise.data.meta.last_page } onChange={(ev, page) => navigate(`/post/page/${page}`)} />
            </Box>
            </>
          )}
        
          </Await>
        </React.Suspense>
      </>
    );
}

export async function PostIndexLoader({ request, params }) {

    const postsPromise = axiosClient.get(`${links['post_index_route']}=${params?.page}`);
  
    return defer({
      postsPromise: postsPromise
    });
}
  