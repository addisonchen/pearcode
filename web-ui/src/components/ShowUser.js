import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col } from 'react-bootstrap';

import { show_user, all_invites } from '../api';

import { connect } from 'react-redux';

import store from './../store';

function ShowFiles({ user, invites }) {

    return (
        <Row style={{paddingTop: "20px"}}>
            <Col sm={6} style={{overflow: 'visible'}}>
                <h1 style={{paddingBottom: "20px", paddingLeft: "10px"}}>Personal Files</h1>

                {
                    user.files.length === 0 ?
                        <div className="fileDisplay default">
                            <p>No files yet...</p>
                        </div>
                    :
                    user.files.map((f) => {
                        return (
                            <div className="fileDisplay" key={f.id}>
                                <p><span className="green">{f.name}</span> | {f.language}</p>
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
                            <div className="fileDisplay" key={i.id}>
                                <p>{i.file.name} | {i.file.language}</p>
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

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        show_user(session.user_id)
            .then((resp) => {
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

    return (
        <div className="windowSize padding">
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: "15px 0px"}}>
                <Col sm={6}>
                    <div className="flex-column box" style={{width: '100%', height: 'calc(100% - 20px)', overflow: 'visible'}}>
                        <Button variant="outline-success">Create</Button>
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