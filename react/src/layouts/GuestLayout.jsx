import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContextProvider";
import Container from '@mui/material/Container';
import MsaAppBar from "./MsaAppBar";

export default function MainLayout() {

   const {token} = useAuthContext();
    
    if(token){
      return <Navigate to="/" />
    }

  return (
    <>
      <div >
        <MsaAppBar />
      </div>

      <Container maxWidth="sm" >
        <Outlet />
      </Container>
    </>
  );
}
