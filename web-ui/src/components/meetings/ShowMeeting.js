import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Accordion, Card, Table, ListGroup, Alert } from 'react-bootstrap';
import { fetch_meetings, show_meeting, delete_meeting, create_invite, delete_invite, update_invite, create_comment, delete_comment } from '../../api';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import CreateUser from '../users/CreateUser';


function ShowInvites({invites}) {
    return (
        <Accordion defaultActiveKey="0" style={{marginTop: '25px'}}>
            <Card>
                <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Show/Hide all Invites
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                       <Table bordered hover>
                           <thead>
                               <tr>
                                   <th>Email</th>
                                   <th>Status</th>
                               </tr>
                           </thead>
                           <tbody>
                               {
                                   invites.map((i) => {
                                       return (
                                        <tr key={i.id}>
                                            <td>{i.email}</td>
                                            <td>{i.status}</td>
                                        </tr>
                                       )
                                   })
                               }
                           </tbody>
                       </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

function InviteForm({session, props}) {
    const [email, setEmail] = useState("");
    const [inviteId, setInviteId] = useState(null);

    function updateEmail(ev) {
        setEmail(ev.target.value);
    }

    function onSubmit(ev) {
        ev.preventDefault();
        create_invite({
            "email": email,
            "meeting_id": parseInt(props.meeting_id),
            "status": "none" 
        }).then(() => {
            setEmail("");
            props.reload(`Invite created! Share this link: http://events-spa.swoogity.com/meetings/${props.meeting_id}`);
        })
    }

    function deleteSubmit(ev) {
        ev.preventDefault();
        if (inviteId) {
            delete_invite(inviteId).then((resp) => {
                props.reload("Invite deleted")
            });
        }
    }


    if ((props.user_id) && (session)) {
        if (props.user_id === session.user_id) {
            return (
                <>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label style={{margin: '0px', marginTop: '20px'}}>Create invite</Form.Label>
                        <div className="flex-row">
                            <Form.Control type="email" onChange={updateEmail} value={email} placeholder="Email"/>
                            <Button variant="primary" type="submit">Invite!</Button>
                        </div>
                        <Form.Text className="text-muted">Enter an email to create an invite for</Form.Text>
                        <Form.Text className="text-muted">Share this link with those invited:</Form.Text>
                        <Form.Text className="text-success">http://events-spa.swoogity.com/meetings/{props.meeting_id}</Form.Text>
                    </Form.Group>
                </Form>
                <Form onSubmit={deleteSubmit}>
                    <Form.Group>
                        <Form.Label style={{margin: '0px', marginTop: '10px'}}>Delete Invite</Form.Label>
                        <div className="flex-row">
                            <Form.Control as="select" onChange={(ev) => {setInviteId(ev.target.value)}}>
                                <option value={null}>Choose an email</option>
                                {   
                                    props.invites.map((i) => {
                                        return (
                                            <option key={i.id} value={i.id}>{i.email}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                            <Button variant="danger" type="submit">Delete</Button>
                        </div>
                        <Form.Text className="text-muted">Choose an email to remove invite</Form.Text>
                    </Form.Group>
                </Form>
                </>
            )
        }
    }
    // user is not the owner, dont show this form
    return (
        <></>
    )   
}

const CreateInvite = connect(({session}, props) => {return {session: session, props: props}})(InviteForm);

function RespondForm({session, props}) {
    const [status, setStatus] = useState(null);
    var personalInviteId = -1;
    if (session) {
        var i;
        for (i = 0; i < props.invites.length; i++) {
            if (props.invites[i].email === session.email) {
                personalInviteId = props.invites[i].id;
            }
        }
    }

    function onSubmit(ev) {
        ev.preventDefault();

        if ((personalInviteId === -1) || (status === null)) {
            return
        }

        update_invite(personalInviteId, {
            id: personalInviteId,
            invite: {
                email: session.email,
                meeting_id: props.meeting_id,
                status: status
            }
        }).then((resp) => {
            props.reload("Response created!")
        })

    }

    if (personalInviteId !== -1) {
        return (
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label style={{margin: '0px', marginTop: '20px'}}>Respond!</Form.Label>
                    <div className="flex-row">
                        <Form.Control as="select" onChange={(ev) => {setStatus(ev.target.value)}}>
                            <option value={null}>Choose a response</option>
                            <option value={'yes'}>yes</option>
                            <option value={'no'}>no</option>
                            <option value={'maybe'}>maybe</option>
                        </Form.Control>
                        <Button variant="success" type="submit">Respond!</Button>
                    </div>
                    <Form.Text className="text-muted">Submit your attendance for this meeting</Form.Text>
                </Form.Group>
            </Form>
        )
    }
    return (
        <></>
    )
}

const RespondInvite = connect(({session}, props) => {return {session: session, props: props}})(RespondForm);


function Comments({session, props}) {

    const [body, setBody] = useState("");

    function onSubmit(ev) {
        ev.preventDefault();
        create_comment({
            body: body,
            meeting_id: props.meeting.id,
            user_id: session.user_id
        }).then((resp) => {
            props.reload("Comment created!")
            setBody("");
        })
    }

    function deleteComment(id) {
        delete_comment(id).then((resp) => {
            props.reload("Comment deleted")
        })
    }


    return (
        <div className="customContainer" style={{marginTop: "20px"}}>
            <h3>Comments</h3>
            { session ?
                (props.meeting.invites.some((i) => i.email === session.email) || (props.meeting.user_id === session.user_id)) ?
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Label>Write Comment</Form.Label>
                            <div className="flex-row">
                                <Form.Control type="text" onChange={(ev) => (setBody(ev.target.value))} value={body} />
                                <Button variant="primary" type="submit">Post</Button>
                            </div>
                        </Form.Group>
                    </Form>
                    :
                    <p>you must be invited to comment</p>
            :
                <p>you must be invited to comment</p>
            }
            <Accordion style={{marginTop: "20px"}} defaultActiveKey="0">
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Show/Hide all Comments
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                        <ListGroup>
                            {
                                props.meeting.comments.map((c) => {
                                    return (
                                        <ListGroup.Item key={c.id}>
                                            <div className="flex-row" style={{justifyContent: "space-between", alignItems: "center"}}>
                                                <p><span className="bold">{c.user.name}:</span> {c.body}</p>
                                                { session ?
                                                    (c.user_id === session.user_id) || (session.user_id === props.meeting.user_id) ?
                                                        <Button variant="danger" onClick={() => {deleteComment(c.id)}}>Delete</Button>
                                                        :
                                                        <></>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}

const ShowComments = connect(({session}, props) => ({session: session, props: props}))(Comments)

function FoundMeetingView({session, meeting, reload}) {
    const history = useHistory();
    const [replies, setReplies] = useState({
        yes: 0,
        no: 0,
        maybe: 0,
        noResponse: 0
    })

    const [show, setShow] = useState(true);

    useEffect(() => {
        let newReplies = {
            yes: 0,
            no: 0,
            maybe: 0,
            noResponse: 0
        }

        meeting.invites.forEach((i) => {
            switch (i.status) {
                case 'yes':
                    newReplies.yes++;
                    break;
                case 'no':
                    newReplies.no++;
                    break;
                case 'maybe':
                    newReplies.maybe++;
                    break;
                default:
                    newReplies.noResponse++;

            };
        });

        setReplies(newReplies);

    }, [meeting])

    useEffect(() => {
        setShow(true);
    }, [meeting]);

    function deleteMeeting() {
        delete_meeting(meeting.id).then((resp) => {
            fetch_meetings();
            history.push("/");
        })
    }

    return (
        <>  
            { meeting.alert && show ? 
                <Alert variant="primary" onClose={() => setShow(false)} dismissible>{meeting.alert}</Alert>
            :
                <></>
            }
            <Row>
                <Col md={6}>
                    <div className="customContainer">
                        { session ?

                            session.user_id === meeting.user_id ?
                                <>
                                    <h1>{meeting.name}</h1>
                                    <div className="flex-row" style={{marginTop: "10px", marginBottom: "10px"}}>
                                        <Button variant="primary" onClick={() => {history.push(`/meetings/edit/${meeting.id}`)}}>Edit</Button>
                                        <div style={{width: '10px'}}></div>
                                        <Button variant="danger" onClick={deleteMeeting} style={{height: "40px"}}>Delete</Button>
                                    </div>
                                </>
                                :
                                <h1>{meeting.name}</h1>
                            
                        :
                            <h1>{meeting.name}</h1>
                        }
                        
                        <h5>{meeting.date}</h5>
                        <p><span className="bold">Description: </span>{meeting.description}</p>
                    </div>
                    <div style={{height: "20px"}}></div>
                    <div className="customContainer">
                        <h5><span className="bold">Host: </span>{meeting.user_name}</h5>
                        <h5><span className="bold">Email: </span>{meeting.user_email}</h5>
                    </div>
                    <ShowComments meeting={meeting} reload={reload}/>
                </Col>
                <Col md={6}>
                    <div className="customContainer">
                        <h3>Invites</h3>
                        <p>
                            <span style={{color: "green"}}>
                                {replies.yes}
                            </span> yes <span style={{color: "red"}}>
                                {replies.no}
                            </span> no <span style={{color: "blue"}}>
                                {replies.maybe}
                            </span> maybe <span style={{color: "purple"}}>
                                {replies.noResponse}
                            </span> no response
                        </p>
                        
                        <CreateInvite user_id={meeting.user_id} meeting_id={meeting.id} invites={meeting.invites} reload={reload} />
                        { session ?
                            <></>
                            :
                            <> 
                                <p className="inlineCreateUserHeader bold">Create an account to respond to an invite</p>
                                <CreateUser inline={true} />
                            </>
                        }
                        <RespondInvite invites={meeting.invites} reload={reload} />
                        <ShowInvites invites={meeting.invites} meeting_id={meeting.id} reload={reload} />
                    </div>
                </Col>
            </Row>
        </>
    )
}

const FoundMeeting = connect(({session}, props) => ({session: session, meeting: props.meeting, reload: props.reload}))(FoundMeetingView);

export default function ShowMeeting() {
    const { id } = useParams();
    const [meeting, setMeeting] = useState({
        "name": "",
        "description": "",
        "date": "",
        "user_name": "",
        "user_id": null,
        "user_email": "",
        "invites": [],
        "comments": [],
        "id": id,
        "alert": null
    })

    const [found, setFound] = useState(true);

    useEffect(() => {
        show_meeting(id)
            .then((resp) => {
                setMeeting({
                    "name": resp.name,
                    "description": resp.description,
                    "date": resp.date,
                    "user_name": resp.user_name,
                    "user_id": resp.user_id,
                    "user_email": resp.user_email,
                    "invites": resp.invites,
                    "comments": resp.comments,
                    "id": id,
                    "alert": null
                });
            })
            .catch((e) => {
                if (e instanceof SyntaxError) {
                    setFound(false);
                }
            });
    }, [id])

    function reload(alert) {
        show_meeting(id)
            .then((resp) => {
                setMeeting({
                    "name": resp.name,
                    "description": resp.description,
                    "date": resp.date,
                    "user_name": resp.user_name,
                    "user_id": resp.user_id,
                    "user_email": resp.user_email,
                    "invites": resp.invites,
                    "comments": resp.comments,
                    "id": id,
                    "alert": alert
                });
            })
            .catch((e) => {
                if (e instanceof SyntaxError) {
                    setFound(false);
                }
            });
    }


    return (
        <div className="margin padding top">
            { found ?
                    <FoundMeeting meeting={meeting} reload={reload}/>
                :
                    <p>Meeting not found</p>
            }
            
        </div>
    )
}