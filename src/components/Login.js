import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useUser} from "./UserContext";
import {Button, Col, Form, Row} from "react-bootstrap";
import image from '../assets/login.jpg';

// Login Page
const Login = () => {
    const {login} = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    // Validate Login Form fields
    const validate = (values) => {
        let errors = {};
        if (!values.email) {
            errors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email address is invalid";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    }

    // Handle Login Form Submit
    const verifyCredentials = (event) => {
        event.preventDefault();
        setErrorMessage("");

        // validate user input
        const errors = validate({email: email, password: password});
        setEmailError(errors.email);
        setPasswordError(errors.password);

        const payload = {
            body: {
                email: email,
                password: password
            }
        }

        // API Call
        axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/login', payload)
            .then(function (response) {
                if (response.data.statusCode === 200) {
                    alert("Login Successful");
                    login(response.data.body.data);
                    navigate("/");
                } else {
                    setPassword("");
                    setErrorMessage("Username and / or password invalid, please try again.");
                    alert("Invalid Username and / or password.");
                }
            })
            .catch(function (error) {
                console.log(error);
                setPassword("");
                setErrorMessage("Username and / or password invalid, please try again.");
                alert("Invalid Username and / or password.");
            });
    };

    return (
        <Row>
            <Col className="md-5 d-flex flex-column justify-content-center align-items-center" style={{height: '80vh'}}>
                <p style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '18px'
                }}>Welcome!</p>
                <p style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '50px'
                }}>Login to your account</p>
                <Form onSubmit={verifyCredentials} style={{width: '70%'}}>
                    <Form.Group className="mb-4">
                        <Form.Label style={{
                            fontSize: '20px',
                            fontWeight: 600
                        }}>
                            Email
                        </Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            size="lg"
                        />
                        {emailError && <Form.Text className="text-danger"> {emailError}</Form.Text>}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{
                            fontSize: '20px',
                            fontWeight: 600
                        }}>
                            Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            size="lg"
                        />
                        {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                    </Form.Group>

                    {errorMessage !== null && (
                        <div className="form-group mb-3">
                            <span className="text-danger">{errorMessage}</span>
                        </div>
                    )}

                    <Button type="submit" className="btn-dark mt-2" style={{
                        marginRight: '10px',
                        width: '100%',
                        height: '47px',
                        fontSize: '18px'
                    }}>Login</Button>
                    <div className="mt-3" style={{textAlign: 'center'}}>New to our website?{' '}
                        <a href="/register">Join today</a></div>
                </Form>
            </Col>
            <Col className="md-7">
                <img src={image} alt="dj boy login" style={{height: '95%', width: '100%'}}/>
            </Col>
        </Row>
    );
}

export default Login;
