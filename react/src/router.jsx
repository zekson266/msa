import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GuestLayout from './layouts/GuestLayout';
import Login from './layouts/auth/Login';
import Signup from './layouts/auth/Signup';
import Users from './layouts/user/Users';

const router = createBrowserRouter([
    {
        path: '/',
        //loader: rootLoader,
        element: <MainLayout />,
        children:[
            {
                path: 'users',
                element: <Users />,
                // loader
            },
            {
                path: '/user/new',
                //element: <Signup />,
                // loader
            },
            {
                path: '/user/:id',
                //element: <Signup />,
                // loader
            },
        ],
    },
    {
        path: '/',
        //loader: rootLoader,
        element: <GuestLayout />,
        children:[
            {
                path: 'login',
                element: <Login />,
                // loader
            },
            {
                path: 'signup',
                element: <Signup />,
                // loader
            },
        ],
    }
]);

export default router;