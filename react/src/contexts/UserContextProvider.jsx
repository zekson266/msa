import { createContext, useContext, useState } from "react";

const UserContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
})

export const ContextProvider = ({children}) => {

    const [user,setUser] = useState({});
    const [token,_setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN',token);
        }
        else{
            localStorage.removeItem('ACCESS_TOKE');
        }
    }

    return (
        <UserContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
        }}>

            { children }

        </UserContext.Provider>
    );
}

export const useUserContext = () => useContext(UserContext)