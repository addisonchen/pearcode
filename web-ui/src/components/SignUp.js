import { useState } from 'react';

import HomeIcon from './HomeIcon';

import { useHistory, Link } from 'react-router-dom';

import { Form, Button, Alert } from 'react-bootstrap';

import { create_user, api_login, fetch_users } from '../api';

import { connect } from 'react-redux';
import Home from './Home';

function LoginForm({error}) {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    function submitLogin(ev) {
        ev.preventDefault();
        api_login(email, pass).then(() => {
            history.push("/");
        });
    }
    
    let error_alert = null;

    if (error) {
        error_alert = (
            <Alert variant="danger" style={{width: "100%", marginBottom: "20px"}}>{error}</Alert>
        );
    }

    return (
        <div>
            <div style={{height: '30px'}}></div>
            <Form onSubmit={submitLogin} autoComplete="new-password" style={{width: '400px'}}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" placeholder="Enter email" onChange={(ev) => setEmail(ev.target.value)} value={email} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="password" placeholder="Enter password" onChange={(ev) => setPass(ev.target.value)} value={pass} />
                </Form.Group>
            </Form>
            <div style={{height: '20px'}}></div>
            {error_alert}
            <div className="flex-row end">
                <Button variant="outline-success" type="submit">
                    Login
                </Button>
            </div>
        </div>
    );
}

const Login = connect(({error}) => ({error}))(LoginForm)

function CreateAccount() {
    const history = useHistory();

    const [user, setUser] = useState({
        'name': "",
        'email': "",
        'password': ""
    });

    const [errors, setErrors] = useState({
        'name': null,
        'email': null,
        'password': null
    })

    function onSubmit(ev) {
        ev.preventDefault();
        if (user.password.length < 8) {
            let newErrors = Object.assign({}, errors);
            newErrors['password'] = 'password must be 8 characters or longer';
            setErrors(newErrors);
            return
        }

        create_user(user).then((resp) => {
            if (resp.errors) {
                let newErrors = Object.assign({}, errors);
                if (resp.errors.name) {
                    newErrors['name'] = resp.errors.name[0];
                } else {
                    newErrors['name'] = "";
                }
                
                if (resp.errors.email) {
                    newErrors['email'] = resp.errors.email[0];
                } else {
                    newErrors['email'] = "";
                }

                if (resp.errors.password) {
                    newErrors['password'] = resp.errors.password[0];
                } else {
                    newErrors['password'] = "";
                }
                setErrors(newErrors);
            } else {
                api_login(user.email, user.password).then(() => {
                    history.push("/");
                })
            }
        });
    }

    function updateName(ev) {
        let newUser = Object.assign({}, user);
        newUser["name"] = ev.target.value;
        setUser(newUser);
    }

    function updateEmail(ev) {
        let newUser = Object.assign({}, user);
        newUser["email"] = ev.target.value;
        setUser(newUser);
    }

    function updatePassword(ev) {
        let newUser = Object.assign({}, user);
        newUser["password"] = ev.target.value;
        setUser(newUser);
    }

    return (
        <div>
            <div style={{height: '30px'}}></div>
            <Form onSubmit={onSubmit} autoComplete="new-password" style={{width: '400px'}}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" onChange={updateName} value={user.name} placeholder="Enter name" />
                    { errors.name ? 
                        <Form.Text className="text-danger">{errors.name}</Form.Text>
                    :
                        <Form.Text className="text-muted">Choose any name!</Form.Text>
                    }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="email" onChange={updateEmail} value={user.email} placeholder="Enter email" />
                    { errors.email ? 
                        <Form.Text className="text-danger">{errors.email}</Form.Text>
                    :
                        <Form.Text className="text-muted">Your email might get stolen if we get hacked, just fyi</Form.Text>
                    }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="password" onChange={updatePassword} value={user.password} placeholder="Choose a password" />
                    { errors.password ? 
                        <Form.Text className="text-danger">{errors.password}</Form.Text>
                    :
                        <Form.Text className="text-muted">Use a password you don't use anywhere else (in case of hackers)</Form.Text>
                    }
                </Form.Group>
                
                <div className="flex-row end">
                    <Button variant="outline-success" type="submit">
                        Sign Up
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default function SignUp() {

    const [toggle, setToggle] = useState(true);

    function handleToggle(ev) {
        ev.preventDefault();
        setToggle(!toggle);
    }

    return (
        <div className="windowSize padding">
            <HomeIcon />
            <div className="loginContainer">
                <div>
                    <div className="toggleContainer" onClick={handleToggle}>
                        <div className="flex-row" style={{width: '100%', height: '100%'}}>
                            <div className={`toggleHighlight ${toggle ? 'left' : 'right'}`}></div>
                            <div className="toggleText">
                                <h5 style={{userSelect: 'none', cursor: 'inherit'}}>Sign Up</h5>
                            </div>
                            <div className="toggleText">
                                <h5 style={{userSelect: 'none', cursor: 'inherit'}}>Login</h5>
                            </div>
                        </div>
                    </div>

                    { toggle ? 
                        <CreateAccount />
                        :
                        <Login />
                    }
                </div>
            </div>
        </div>
    )
}
