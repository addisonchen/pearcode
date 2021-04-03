import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col, Form } from 'react-bootstrap';

import { show_user, all_invites, create_file } from '../api';

import { connect } from 'react-redux';

import store from './../store';

function ShowFiles({ user, invites }) {
    const history = useHistory();

    const d = {
        71: "Python",
        83: "Swift",
        63: "JavaScript",
        62: "Java",
        50: "C",
        54: "C++",
        57: "Elixir",
        69: "Prolog",
        72: "Ruby"
    };

    return (
        <Row style={{paddingTop: "20px"}}>
            <Col sm={6} style={{overflow: 'visible'}}>
                <h1 style={{paddingBottom: "20px", paddingLeft: "10px"}}>Personal Files</h1>

                {
                    user.files.length === 0 ?
                        <div className="fileDisplay">
                            <p>No files yet...</p>
                        </div>
                    :
                    user.files.map((f) => {
                        return (
                            <div className="fileDisplay clickable" key={f.id} onClick={(ev) => {history.push(`/files/${f.id}`)}}>
                                <div className="flex-row space-between">
                                    <p className="fileDisplayText">{f.name}</p>
                                    <p>{d[f.language]}</p>
                                </div>
                            </div>
                        )
                    })    
                }
            </Col>
            <Col sm={6}>
                <h1 style={{paddingBottom: "20px", paddingLeft: "10px"}}>Shared With</h1>

                {
                    invites.length === 0 ?
                        <div className="fileDisplay default">
                            <p>No files yet...</p>
                        </div>
                    :
                    invites.map((i) => {
                        return (
                            <div className="fileDisplay clickable" key={i.id} onClick={(ev) => {history.push(`/files/${i.file.id}`)}}>
                                <div className="flex-row space-between">
                                    <p className="fileDisplayText">{i.file.name}</p> 
                                    <p>{i.file.user.name}</p>
                                </div>
                            </div>
                        )
                    })    
                }
            </Col>
        </Row>
    )
}

function ShowOther({ id }) {

    const history = useHistory();

    const [found, setFound] = useState(true);
    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "files": []
    });

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        show_user(id)
            .then((resp) => {
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "files": resp.files
                })
            })
            .catch((e) => {
                setFound(false);
            })
            .finally(
                all_invites()
                    .then((resp) => {
                        setInvites(resp.filter((i) => i.email === user.email))
                    })
            );
    }, [id, user.email]);

    return (
        <div className="windowSize padding" style={{overflow: 'scroll'}}>
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: '15px 0px'}}>  
                <Col> 
                    { found ?
                        <div className="flex-column end" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-column end box" style={{width: 'auto'}}>
                                <h1 className="username">{user.name}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        :
                        <div className="flex-column end" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-column end box" style={{width: 'auto'}}>
                                <h1 className="username">Not Found</h1>
                                <p>unkown@email.com</p>
                            </div>
                        </div>
                    }
                </Col>
            </Row>
            <ShowFiles user={user} invites={invites} />
        </div>
    )
}

function ShowYourself({ session }) {
    const history = useHistory();

    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "files": []
    });

    const [file, setFile] = useState({
        "name": "",
        "language": 50,
        "description": "",
        "body": "",
        "user_id": session.user_id
    })

    const [error, setError] = useState(false);

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        show_user(session.user_id)
            .then((resp) => {
                resp.files.sort((a, b) => {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                })
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "files": resp.files
                })
            })
            .finally(
                all_invites()
                    .then((resp) => {
                        setInvites(resp.filter((i) => i.email === user.email))
                    })
            );
    }, [session.user_id, user.email]);

    function logout(ev) {
        ev.preventDefault();
        store.dispatch({type: 'session/clear'});
        history.push("/");
    }

    function updateFileName(ev) {
        let newFile = Object.assign({}, file);
        newFile["name"] = ev.target.value;
        setFile(newFile);
    }

    function updateLanguage(ev) {
        let newFile = Object.assign({}, file);
        newFile["language"] = ev.target.value;
        setFile(newFile);
    }

    function createFile(ev) {
        ev.preventDefault();

        create_file(file).then((resp) => {
            console.log(file);
            if (resp.errors) {
                setError(true);
                console.log(resp);
            } else {
                setError(false);
                history.push(`/files/${resp.data.id}`);
            }
        });
    }

    return (
        <div className="windowSize padding" style={{overflow: 'scroll'}}>
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: "15px 0px"}}>
                <Col sm={6}>
                    <div className="flex-column box" style={{width: '100%', height: 'calc(100% - 20px)', overflow: 'visible'}}>
                        <Form style={{height: '100%'}} onSubmit={createFile}>
                            <Form.Group className="flex-column space-between" style={{height: '100%'}}>
                                <Row>
                                    <Col>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" onChange={updateFileName} value={file.name} placeholder="Choose name" />
                                    </Col>
                                </Row>
                                
                                <Row style={{overflow: 'visible'}}>
                                    <Col xs={8}>
                                        <Form.Label>Language</Form.Label>
                                        <Form.Control className="dark-form" as="select" value={file.language} onChange={updateLanguage}>
                                            <option value={50}>C (GCC 9.2.0)</option>
                                            <option value={54}>C++ (GCC 9.2.0)</option>
                                            <option value={57}>Elixir</option>
                                            <option value={62}>Java 13</option>
                                            <option value={63}>JavaScript 12.14</option>
                                            <option value={69}>Prolog (GNU 1.4.5)</option>
                                            <option value={71}>Python 3</option>
                                            <option value={72}>Ruby 2.7</option>
                                            <option value={83}>Swift 5</option>
                                        </Form.Control>
                                    </Col>

                                    <Col xs={4} style={{overflow: 'visible'}}>
                                        <Button variant="outline-success" style={{position: 'relative', width: '100%', top: '100%', transform: 'translateY(-100%)'}} type="submit">Create</Button>
                                    </Col>
                                </Row>
                                { error ? 
                                    <Row>
                                        <Col>
                                            <Form.Text className="text-danger">Oops! Something went wrong...</Form.Text>
                                        </Col>
                                    </Row>
                                :
                                    <></>
                                }
                            </Form.Group>
                        </Form>
                        
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="flex-column end box" style={{width: '100%', overflow: 'visible'}}>
                        <h1 className="personalUsername">{session.name}</h1>
                        <p>{session.email}</p>

                        <div className="flex-row end" style={{overflow: 'visible'}}>
                            <Button variant="outline-light" className="profileButton">Edit Profile</Button>
                            <Button variant="outline-danger" className="profileButton" onClick={logout}>Logout</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                
            </Row>
            <ShowFiles user={user} invites={invites} />
        </div>
    )
}

function ShowUser({session}) {
    const { id } = useParams();
    const history = useHistory();

    if (session) {
        return (session.user_id == id ? <ShowYourself session={session} /> : <ShowOther id={id} />);
    } else {
        return <ShowOther id={id} />
    }
}

export default connect(({session}) => ({session}))(ShowUser);