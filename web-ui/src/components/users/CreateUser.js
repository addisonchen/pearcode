import { useState } from 'react';

import { Form, Button } from 'react-bootstrap';

import { create_user, api_login, fetch_users } from '../../api';

import { useHistory } from 'react-router-dom';

export default function CreateUser({inline}) {
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
                    fetch_users();
                    if (inline) {
                        history.go(0);
                    } else {
                        history.push("/");
                    }
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
        <div className={inline ? "inlineCreateUser" : "margin padding"}>
            { inline ? 
                <h6>Create Account</h6>
            :
                <h1>Create Account</h1>
            }
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={updateName} value={user.name} placeholder="Enter name" />
                    { errors.name ? 
                        <Form.Text className="text-danger">{errors.name}</Form.Text>
                    :
                        <Form.Text className="text-muted">Choose any name!</Form.Text>
                    }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" onChange={updateEmail} value={user.email} placeholder="Enter email" />
                    { errors.email ? 
                        <Form.Text className="text-danger">{errors.email}</Form.Text>
                    :
                        <Form.Text className="text-muted">Your email might get stolen if we get hacked, just fyi</Form.Text>
                    }
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={updatePassword} value={user.password} placeholder="Choose a password" />
                    { errors.password ? 
                        <Form.Text className="text-danger">{errors.password}</Form.Text>
                    :
                        <Form.Text className="text-muted">Use a password you don't use anywhere else (in case of hackers)</Form.Text>
                    }
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create!
                </Button>
            </Form>
        </div>
    )
}