import {createContext, useContext, useState} from 'react';
import {removeLoggedInUser, setLoggedInUser} from "../utils/repository";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// The context created to handle the logged in user details
export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    // Handle the login action
    const login = (userData) => {
        setUser(userData);
        setLoggedInUser(userData);
    };

    // Handle the logout action
    const logout = () => {
        setUser(null);
        removeLoggedInUser();
    };

    return (
        <UserContext.Provider value={{user, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};
