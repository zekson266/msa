import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginForm from './layouts/auth/LoginForm';
import Signup from './layouts/auth/Signup';

const router = createBrowserRouter([
    {
        path: '/',
        //loader: rootLoader,
        element: <MainLayout />,
        children:[
            {
                path: 'login',
                element: <LoginForm />,
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