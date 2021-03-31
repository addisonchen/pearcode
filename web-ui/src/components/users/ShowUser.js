import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { show_user, all_invites } from '../../api';

function ShowUser({session}) {
    const { id } = useParams();
    const history = useHistory();

    const [found, setFound] = useState(true);
    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "meetings": []
    });
    const [invites, setInvites] = useState([])

    useEffect(() => {
        show_user(id)
            .then((resp) => {
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "meetings": resp.meetings
                })
            })
            .catch((e) => {
                if (e instanceof SyntaxError) {
                    setFound(false);
                }
            })
            .finally(
                all_invites()
                    .then((resp) => {
                        setInvites(resp.filter((i) => i.email === user.email))
                    })
            );
    }, [id, user.email]);


    return (
        <div className="margin padding">
            { found ? 
                <>
                    <Row>
                        <Col>
                            <h1>{user.name}</h1>
                            <h6>{user.email}</h6>
                            {   session ?
                                session.user_id === parseInt(id) ?
                                        <Button variant="primary" onClick={() => {history.push(`/users/edit/${id}`)}}>
                                            Edit Account
                                        </Button>
                                    :
                                    <></>
                                :
                                <></>
                            }
                        </Col>
                    </Row>
                    <Row style={{marginTop: "30px"}}>
                        <Col md={6}>
                            <h3>Meetings</h3>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        user.meetings.map((m, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>
                                                        <Link to={`/meetings/${m.id}`}>
                                                            {m.name}
                                                        </Link>
                                                    </td>
                                                    <td>{m.date}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                        <h3>Invited To</h3>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Response</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        invites.map((i, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>
                                                        <Link to={`/meetings/${i.meeting.id}`}>
                                                            {i.meeting.name}
                                                        </Link>
                                                    </td>
                                                    <td>{i.meeting.date}</td>
                                                    <td>{i.status}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            :
                <p>User not found</p>
            }
        </div>
    )

}

export default connect(({session}) => ({session}))(ShowUser);