import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios-client";

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
})

export const ContextProvider = ({children}) => {

    const [user, setUser] = useState(null);

    const [token,_setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
        }
        else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axiosClient.get('user');
            const {data} = response;
            setUser(data);
          } catch (error) {
            // Handle errors, e.g., set default user or show an error message
            console.error("Error fetching user:", error);
          }
        };
    
        if (token) {
          fetchUser();
        }
      }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
        }}>

            { children }

        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext)