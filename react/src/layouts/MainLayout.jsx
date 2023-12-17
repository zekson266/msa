import { Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import MsaAppBar from "./MsaAppBar";
import Container from '@mui/material/Container';
import Box from "@mui/material/Box";

export default function MainLayout() {

  const { setUser } = useAuthContext();

  useEffect(()=>{
    const getUser = async () => {
      try{
          const response  = await axiosClient.get('user');
          const {data} = response;
          //setUser(data);
        } catch (err) {
          const response = err.response;
        }
    }
    getUser();
  },[])

  return (
    <>
      <MsaAppBar />
      <Box sx={{ height: {xs: '9ch', sm: '10ch', md: '11ch'}}}></Box>
      <Container
        maxWidth="xs"
        sx={{ marginBottom: '3ch' }}
      >
        <Outlet />
      </Container>
    </>
  );
}
