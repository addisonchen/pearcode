import React from 'react';
import { Navbar, Nav, Form, Button, Alert, Row } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { useState } from 'react';

import { api_login } from './../api';
import store from './../store';


function Login() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    function submitLogin(ev) {
        ev.preventDefault();
        api_login(email, pass).then(() => {
            history.go(0);
        });

    }

    return (
        <div className="flex-row">
            <Form onSubmit={submitLogin} inline>
                <Form.Control name="email" type="text" placeholder="email" onChange={(ev) => setEmail(ev.target.value)} value={email} />
                <Form.Control name="password" type="password" placeholder="password" onChange={(ev) => setPass(ev.target.value)} value={pass} />

                <Button variant="outline-light" type="submit">Login</Button>
            </Form>

            <div style={{width: "20px"}}></div>
            <Button variant="outline-light" onClick={() => {history.push('/users/create')}}>
                Create Account
            </Button>
        </div>
    );
}

function LoggedIn({session}) {
    const history = useHistory();

    function logout(ev) {
        ev.preventDefault();
        store.dispatch({type: 'session/clear'});
        history.go("/");
    }

    return (
        <div className="flex-row" style={{alignItems: "center"}}>
            <p className="white">Hello, {session.name}</p>
            <div style={{width: "20px"}}></div>
            <Button variant="outline-light" onClick={() => {history.push(`/users/${session.user_id}`)}}>
                Profile
            </Button>
            <div style={{width: "20px"}}></div>
            <Button variant="outline-light" onClick={() => {history.push('/meetings/create')}}>
                + Meeting
            </Button>
            <div style={{width: "20px"}}></div>
            <Button variant="outline-light" onClick={logout}>Logout</Button>
        </div>
    )
}


function LoginForms({session}) {
    if (session) {
        return <LoggedIn session={session} />;
    } else {
        return <Login />;
    }
}

const LoginSignUp = connect(({session}) => ({session}))(LoginForms);

function Navigation({error}) {
    let error_alert = null;

    if (error) {
        error_alert = (
            <Row>
                <Alert variant="danger" style={{width: "100%", textAlign: "center"}}>{error}</Alert>
            </Row>
        );
    }

    return (
        <div>
            <Navbar bg="dark" expand="md">
                <Navbar.Brand>
                    <Link to={"/"} className="nav-link white">
                        Home
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    <Nav className="justify-content-end" style={{width: "100%"}}>
                        <Nav.Item>
                            <LoginSignUp />
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
                
            </Navbar>
            { error_alert }
        </div>

    )
}

export default connect(({error}) => ({error}))(Navigation);