import { NavLink, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContextProvider";
import { useState, Link } from "react";
import LoginForm from "./auth/LoginForm";

export default function MainLayout() {

   const {token, setToken} = useUserContext();
    //const [userLabel, setUserLabel] = useState();
    
    if(!token){
        //setUserLabel('No user');
        console.log('No user');
    }

    const handleLogout = () => {
        // Call the setToken function from your context to log the user out
        setToken(null);
      };

    return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <h2>Цуравий селеп</h2>
        <span>Token: { token }</span>
        <button onClick={handleLogout}>Logout</button>
        <NavLink to="login">Login</NavLink>
        <NavLink to="signup">Signup</NavLink>
      </nav>
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
}
