import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import MsaAppBar from "./MsaAppBar";
import Container from '@mui/material/Container';
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function MainLayout() {
  const theme = createTheme();
   const {token, user, setUser, setToken } = useUserContext();
    
    if(!token){
      return <Navigate to="/login" />
    }

    const handleLogout = (ev) => {
      ev.preventDefault();
        axiosClient.post('logout')
        .then(()=>{
          setUser({});
          setToken(null);
        })
    }

    useEffect(()=>{
      axiosClient.get('user')
      .then(({data})=>{
        setUser(data);
      })
    },[])

  return (
    <>

      <MsaAppBar name={user.name}/>
      <Box sx={{ height: {xs: '8ch', sm: '9ch', md: '10ch'}}}></Box>
      <Container
        maxWidth="xs"
        sx={{ marginBottom: '3ch' }}
      >
        <Outlet />
      </Container>
    </>
  );
}
