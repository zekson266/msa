import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login, { LoginAction } from './layouts/auth/Login';
import Signup, { SignupAction } from './layouts/auth/Signup';
import Users from './layouts/user/Users';
import UserForm from './layouts/user/UserForm';
import PostIndex, {PostIndexLoader} from './layouts/post/PostIndex';
import PostShow, {PostShowLoader} from './layouts/post/PostShow';
import PostForm, { PostFormAction, PostFormLoader } from './layouts/post/PostForm';
import React from 'react';
import { useAuthContext } from './contexts/AuthContextProvider';
import Home from './layouts/Home';
import PostLayout from './layouts/post/PostLayout';

const RequireAuth = ({ children }) => {
    
    const { token } = useAuthContext();
    const location = useLocation();

    if(token){
        return children;
    } else {
        return <Navigate to='/login' state={{ from: location}} />;
    }

}

const router = createBrowserRouter([
    {
        path: '/',
        //loader: rootLoader,
        element: <MainLayout />,
        children:[
            {
                path: '/',
                element: <Home />,
                // loader
            },
            {
                path: '/users',
                element: (<RequireAuth><Users /></RequireAuth>),
                // loader
            },
            {
                path: '/users/new',
                element: <UserForm />,
                // loader
            },
            {
                path: '/users/:id',
                element: <UserForm />,
                // loader
            },
            {
                path: '/post',
                element: <PostLayout />,
                children: [
                    {
                        path: '',
                        element: <PostIndex />,
                        loader: PostIndexLoader,
                    },
                    {
                        path: 'page/:page',
                        element: <PostIndex />,
                        loader: PostIndexLoader,
                    },
                    {
                        path: 'edit/:postId',
                        element: <PostForm />,
                        action: PostFormAction,
                        loader: PostFormLoader,
                    },
                    {
                        path: 'show/:postId',
                        element: <PostShow />,
                        loader: PostShowLoader,
                    },
                    {
                        path: 'new',
                        element: <PostForm />,
                        action: PostFormAction,
                    }
                ]
            },
            {
                path: '/login',
                element: <Login />,
                action: LoginAction,
                // loader
            },
            {
                path: '/signup',
                element: <Signup />,
                action: SignupAction,
                // loader
            },
        ],
    },
    // {
    //     path: '/',
    //     //loader: rootLoader,
    //     element: <GuestLayout />,
    //     children:[
    //         {
    //             path: 'login',
    //             element: <Login />,
    
    //             // loader
    //         },
    //         {
    //             path: 'signup',
    //             element: <Signup />,
    //             // loader
    //         },
    //     ],
    // }
]);

export default router;