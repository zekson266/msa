import * as React from 'react';
import axiosClient from "../../axios-client";
import { Await, useLoaderData, defer, useNavigate, useParams, Outlet } from "react-router-dom";
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
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { captions, _ , links} from '../../general';
import Comment from '../../layouts/Comment';

const menu = [captions['edit_menu_item'], captions['delete_menu_item']];

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

export default function PostShow() {

    const { postId } = useParams();
    const  { postPromise } = useLoaderData();
    let navigate = useNavigate();
    const [anchorElPost, setAnchorElPost] = React.useState(null);
    const { user } = useAuthContext();

    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => { setExpanded(!expanded); };

    const handleOpenPostMenu = (event) => {
      setAnchorElPost( event.currentTarget );
    };

    const handleClosePostMenu = (menuItem, postId) => {
      setAnchorElPost(null);

      if(menuItem === captions['edit_menu_item']){
        navigate(links['post_edit_route'] + postId );
      }
      if(menuItem === captions['delete_menu_item']){
        if(window.confirm(captions['delete_confirmation'])){
          navigate(-1);
          axiosClient.delete(links['post_delete_route'] + postId);
        }
      }
    }

    return (<>
      <React.Suspense fallback={<LinearProgress />}>
        <Await
          resolve={postPromise}
          errorElement={<p>Error loading posts!</p>}
        >
          {(postPromise) => (
            <>
              {/* Button back */}
              <Button
                variant="outlined"
                startIcon={<ArrowBackIosNewIcon />}
                fullWidth
                onClick={()=>navigate(-1)}
                sx={{ marginBottom: '2ch', background: 'white'}}
              >
                {_('back_btn')}
              </Button>

              <Card sx={{ maxWidth: '100%', marginBottom: '2ch'}}>

                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    { postPromise.id }
                    </Avatar>
                  }
                  action={ postPromise?.author === user?.name && (
                    <IconButton onClick={ handleOpenPostMenu } aria-label="settings">
                      <MoreVertIcon />
                    </IconButton> )
                  }
                  title={
                    <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1.2 }}>
                      {postPromise.title}
                    </Typography>}
                  subheader={ postPromise.created_at }
                />

                <CardMedia
                  component="img"
                  height="194"
                  image={postPromise.photo || links['post_photo']}
                  alt="Post photo"
                />

                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                      <ShareIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>

                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    { postPromise.body }
                  </Typography>
                </CardContent>
                <Box></Box>

                {/* Collapsable content */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography variant='h5'>
                      Collapsable content
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>

              {/* Post menu */}
              { postPromise.author === user.name && (
                <Menu
                  sx={{ mt: '45px' }}
                  id={menubar}
                  anchorEl={anchorElPost}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElPost)}
                  onClose={() => setAnchorElPost(null)}
                >
                  {menu.map((menuItem, index) => (
                    <MenuItem key={menuItem} onClick={() => handleClosePostMenu( menuItem, postPromise.id )}>
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
            </>)}
          </Await>
        </React.Suspense>
        <Comment parentId={postId} parentType="Post" userName={user.name}/>
      </>
    );
}

export async function PostShowLoader({ params }) {

  const postPromise = axiosClient.get(`${links['post_show_route']}${params?.postId}`)
    .then(({data})=>data);

  return defer( {postPromise: postPromise} );

}
  