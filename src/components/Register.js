import React, {useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useUser} from "./UserContext";
import image from "../assets/login.jpg";

const Register = () => {
    const {login} = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const validateFormData = () => {
        const errors = {};

        if (email.length === 0) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
        }

        if (username.length === 0) {
            errors.username = "Username is required";
        }

        if (password.length === 0) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }

        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        const errors = validateFormData();

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            alert('Registration Validation Failed!');
        } else {
            const payload = {
                body: {
                    email: email,
                    user_name: username,
                    password: password
                }
            };

            //Submission to AWS goes here
            axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/register', payload)
                .then(function (response) {
                    alert(response.data.body.message);

                    login(response.data.body.data);

                    navigate("/login");
                })
                .catch(function (error) {
                    console.log(error);
                    setEmail("");
                    setUsername("");
                    setPassword("");
                    setErrorMessage(error);
                });
        }
    }

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
                }}>Register</p>
                <p style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '50px'
                }}>Create a new account to access our website</p>
                <Form onSubmit={handleSubmit} style={{width: '70%'}}>
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
                        {errors?.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{
                            fontSize: '20px',
                            fontWeight: 600
                        }}>
                            Username
                        </Form.Label>
                        <Form.Control type="text" value={username} required size="lg" onChange={(e) => {
                            setUsername(e.target.value)
                        }}/>
                        {errors?.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
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
                        {errors?.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                    </Form.Group>

                    <Button type="submit" className="btn-dark mt-2" style={{
                        marginRight: '10px',
                        width: '100%',
                        height: '47px',
                        fontSize: '18px'
                    }}>Register</Button>
                    <div className="mt-3" style={{textAlign: 'center'}}>Already have an account?{' '}
                        <a href="/login">Login Here</a></div>
                    {errorMessage !== null && (
                        <div className="form-group">
                            <span className="text-danger">{errorMessage}</span>
                        </div>
                    )}
                </Form>
            </Col>
            <Col className="md-7">
                <img src={image} alt="dj boy login" style={{height: '95%', width: '100%'}}/>
            </Col>
        </Row>
    );
}

export default Register;

