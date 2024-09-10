import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";

export default function AuthPage() {
    const loginImage = "https://sig1.co/img-twitter-1";
    const url = "https://8a4fdc69-ee00-4e2b-af31-261a4de95be2-00-2qiha3ekrjxkb.pike.replit.dev"

    const [modalShow, setModalShow] = useState(null);
    const handleShowLogin = () => setModalShow("Login");
    const handleShowSignup = () => setModalShow("Signup");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    const [usernameExists, setUsernameExists] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (username) {
            axios.get(`${url}/username/${username}`)
                .then(res => setUsernameExists(res.data.exists))
                .catch(err => console.error(err));
        }
    }, [username]);

    useEffect(() => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const passwordValidity = regex.test(password)
        if (!passwordValidity) {
            setInvalidPassword(true)
        } else {
            setInvalidPassword(false)
        }
    }, [password, setInvalidPassword])

    useEffect(() => {
        if (authToken) {
            navigate("/profile");
        }
    }, [authToken, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/signup`, { username, password });
            console.log(res.data);
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, { username, password });
            if (res.data && res.data.auth === true && res.data.token) {
                setAuthToken(res.data.token);
                console.log(res.data);
            }
        } catch (error) {
            console.log(error)
            setLoginFailed(true)
        }
    }

    const handleClose = () => setModalShow(null);

    return (
        <Row>
            <Col sm={6}>
                <Image src={loginImage} fluid />
            </Col>
            <Col sm={6} className="p-4">
                <i className="bi bi-twitter" style={{ fontSize: 50, color: "dodgerblue" }}></i>
                <p className="mt-5" style={{ fontSize: 64 }}>Happening Now</p>
                <p className="my-5" style={{ fontSize: 31 }}>Join Twitter Today.</p>

                <Col sm={5} className="d-grid gap-2">
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-apple"></i> Sign up with Apple
                    </Button>
                    <p style={{ textAlign: "center" }}>or</p>
                    <Button className="rounded-pill" onClick={handleShowSignup}>
                        Create an account
                    </Button>
                    <p style={{ fontSize: "12px" }}>
                        By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use.
                    </p>

                    <p className="mt-5" style={{ fontWeight: "bold" }}>
                        Already have an account?
                    </p>
                    <Button
                        variant="outline-primary"
                        className="rounded-pill"
                        onClick={handleShowLogin}
                    >
                        Sign in
                    </Button>
                </Col>

                <Modal
                    show={modalShow !== null}
                    onHide={handleClose}
                    centered
                >
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {
                                modalShow === "Signup"
                                    ? "Create your account"
                                    : "Log in to your account"
                            }
                        </h2>
                        <Form className="d-grid gap-2 px-5" onSubmit={modalShow === "Signup" ? handleSignup : handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    onChange={((e) => setUsername(e.target.value))}
                                    type="email"
                                    placeholder="Enter username"
                                    aria-describedby="usernameHelp"
                                />
                                {
                                    modalShow === "Signup" && usernameExists && (
                                        <Form.Text id="usernameHelp" className="text-danger">
                                            Username already exists
                                        </Form.Text>
                                    )
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    onChange={((e) => setPassword(e.target.value))}
                                    type="password"
                                    placeholder="Password"
                                    aria-describedby="passwordValididty"
                                />
                                {
                                    modalShow === "Signup" && invalidPassword && (
                                        <Form.Text id="passwordValidity" className="text-danger">
                                            Password must be at least 8 characters long and must contain at least one upper and lower case character, one digit and one special character.
                                        </Form.Text>
                                    )
                                }
                                {
                                    modalShow === "Login" && loginFailed && (
                                        <Form.Text id="passwordValidity" className="text-danger">
                                            Username or password is incorrect.
                                        </Form.Text>
                                    )
                                }
                            </Form.Group>
                            <p style={{ fontSize: "12px" }}>
                                By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use. SigmaTweets may use your contact information, including your email address and phone number for purposes outlined in out Privacy Policy, like keeping your account secure and personalising services, including ads. Learn more. Others will be able to fine you by email or phone number, when provided, unless you choose otherwise here.
                            </p>
                            <Button className="rounded-pil" type="submit">
                                {
                                    modalShow === "Signup" ? "Sign Up" : "Login"
                                }
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    );
}