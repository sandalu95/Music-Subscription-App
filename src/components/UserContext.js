import {createContext, useContext, useState} from 'react';
import {removeLoggedInUser, setLoggedInUser} from "../utils/repository";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        setLoggedInUser(userData);
    };

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
