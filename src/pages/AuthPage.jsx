import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { useEffect, useState, useContext } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { provider } from "../firebase";

export default function AuthPage() {
    const loginImage = "https://sig1.co/img-twitter-1";

    const [modalShow, setModalShow] = useState(null);
    const handleShowLogin = () => setModalShow("Login");
    const handleShowSignup = () => setModalShow("Signup");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    useEffect(() => {
        if (currentUser) navigate("/profile");
    }, [currentUser, navigate]);

    // const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    // const [usernameExists, setUsernameExists] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    useEffect(() => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const passwordValidity = regex.test(password)
        if (!passwordValidity) {
            setInvalidPassword(true)
        } else {
            setInvalidPassword(false)
        }
    }, [password, setInvalidPassword])

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth, username, password
            );
            console.log(res.user)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
        } catch (error) {
            console.error(error)
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
                    <Button className="rounded-pill" variant="outline-dark" onClick={signInWithGoogle}>
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
                                {/* {
                                    modalShow === "Signup" && usernameExists && (
                                        <Form.Text id="usernameHelp" className="text-danger">
                                            Username already exists
                                        </Form.Text>
                                    )
                                } */}
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