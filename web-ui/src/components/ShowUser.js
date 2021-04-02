import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col } from 'react-bootstrap';

import { show_user, all_invites } from '../api';

import { connect } from 'react-redux';

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
            <Row style={{padding: "20px"}}>   
                { found ?
                    <div className="flex-column end" style={{width: '100%'}}>
                        <h1 className="username">{user.name}</h1>
                        <p>{user.email}</p>
                    </div>
                    :
                    <div className="flex-column end" style={{width: '100%'}}>
                        <h1 className="username">Not Found</h1>
                        <p>unkown@email.com</p>
                    </div>
                }
            </Row>
            <Row style={{paddingTop: "20px"}}>
                <Col xs={6}>
                    <h1 style={{paddingBottom: "20px"}}>Files</h1>
                    <div className="flex-column">
                        <div style={{overflow: 'scroll', flex: '1'}}>
                            <Table hover bordered variant="dark" style={{height: "auto"}}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Language</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        user.files.length === 0 ?
                                            <tr>
                                                <td>No files</td>
                                            </tr>
                                        :
                                        user.files.map((f) => {
                                            if (f) {
                                                return (
                                                    <tr>
                                                        <td>{f.name}</td>
                                                        <td>{f.language}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return (
                                                    <tr>
                                                        <td>&#x200b;</td>
                                                        <td>&#x200b;</td>
                                                    </tr>
                                                )
                                            }
                                        })    
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
                <Col xs={6}>

                </Col>
            </Row>
        </div>
    )
}

function ShowYourself({ session }) {
    console.log(session);

    return (
        <div className="windowSize padding">
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: "20px"}}>
                <div className="flex-column end" style={{width: '100%'}}>
                    <h1>Hello, <span className="username">{session.name}</span></h1>
                    <p>{session.email}</p>

                    <div className="flex-row end">
                        <Button variant="outline-light" className="profileButton">Edit Profile</Button>
                        <Button variant="outline-danger" className="profileButton">Logout</Button>
                    </div>
                </div>
            </Row>
            <Row style={{padding: "20px"}}>

            </Row>
        </div>
    )
}

function ShowUser({session}) {
    const { id } = useParams();
    const history = useHistory();

    return (session.user_id == id ? <ShowYourself session={session} /> : <ShowOther id={id} />);
}

export default connect(({session}) => ({session}))(ShowUser);