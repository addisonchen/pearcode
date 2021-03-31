import { useState, useEffect } from 'react';

import { Form, Button } from 'react-bootstrap';

import { update_user, fetch_users, delete_user, show_user } from '../../api';

import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

 function EditUser({session}) {
    const history = useHistory();
    const { id } = useParams();

    const [user, setUser] = useState({
        'name': "",
        'email': "",
        'password': ""
    });

    const [errors, setErrors] = useState({
        'name': null,
        'email': null,
        'password': null
    });

    useEffect(() => {
        show_user(id)
            .then((resp) => {
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "password": ""
                })
            })
    }, [id]);

    function deleteAccount() {
        delete_user(id).then((resp) => {
            fetch_users();
            history.push("/")
        })
    }

    function onSubmit(ev) {
        ev.preventDefault();
        if (user.password.length < 8) {
            let newErrors = Object.assign({}, errors);
            newErrors['password'] = 'password must be 8 characters or longer';
            setErrors(newErrors);
            return
        }

        update_user(id, {
            id: id,
            user: user
        }).then((resp) => {
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
                fetch_users();
                history.push(`/users/${id}`)
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
        <div className="margin padding">
            <h1>Edit Account</h1>
            { session ?
                session.user_id === parseInt(id) ? 
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
                        <div className="flex-row">
                            <Button variant="primary" type="submit">
                                Edit
                            </Button>
                            <div style={{width: '25px'}}></div>
                            <Button variant="danger" onClick={deleteAccount}>
                                Delete
                            </Button>
                        </div>
                    </Form>
                :
                    <p>This is not your account</p>
                :
                <p>You are not logged in</p>
            }
        </div>
    )
}

export default connect(({session}) => ({session}))(EditUser);