import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GuestLayout from './layouts/GuestLayout';
import Login from './layouts/auth/Login';
import Signup from './layouts/auth/Signup';

const router = createBrowserRouter([
    {
        path: '/',
        //loader: rootLoader,
        element: <MainLayout />,
        children:[
            {
                //path: 'login',
                //element: <Login />,
                // loader
            },
            {
                //path: 'signup',
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