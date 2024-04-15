import './App.css';
import {Route, BrowserRouter as Router, Routes, Navigate, Outlet} from "react-router-dom";
import Login from "./components/Login";
import {UserProvider} from "./components/UserContext";
import Register from "./components/Register";
import Home from "./components/Home";
import {getLoggedInUser} from "./utils/repository";

// Private Route component to handle guarded routes
// User won't be able to visit home page if not logged in
const PrivateRoutes = () => {
    const auth = getLoggedInUser();
    return (
        auth ? <Outlet/> : <Navigate to="/login"/>
    )
}

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/register" element={<Register/>}></Route>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<Home/>}/>
                    </Route>
                </Routes>

            </Router>
        </UserProvider>
    );
}

export default App;
