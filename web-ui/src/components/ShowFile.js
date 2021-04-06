import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col, Form } from 'react-bootstrap';

import { show_user, all_invites, create_file, show_file, delete_invite, create_invite, delete_comment, create_comment } from '../api';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { connect } from 'react-redux';

import store from './../store';

function SocialInfo({ session, file, reload }) {

    const [updateFile, setUpdateFile] = useState({
        'name': file.name,
        'language': file.language,
        'description': file.description
    });

    const [inviteEmail, setInviteEmail] = useState("");

    const [newComment, setNewComment] = useState("");

    const fileOwner = session.user_id === file.user_id;
    
    useEffect(() => {
        setUpdateFile({
            'name': file.name,
            'language': file.language,
            'description': file.description
        });
    }, [file])

    const [fileNameError, setFileNameError] = useState(false);

    function modifyName(ev) {
        let f1 = Object.assign({}, updateFile);
        f1['name'] = ev.target.value;
        setUpdateFile(f1);
    }

    function modifyDescription(ev) {
        let f1 = Object.assign({}, updateFile);
        f1['description'] = ev.target.value;
        setUpdateFile(f1);
    }

    function deleteInvite(ev) {
        delete_invite(ev.target.value).then((resp) => {
            reload("");
        })
    }

    function deleteComment(ev) {
        delete_comment(ev.target.value).then((resp) => {
            reload("");
        })
    }


    function submitInvite(ev) {
        ev.preventDefault();
        create_invite({
            "email": inviteEmail,
            "file_id": parseInt(file.id),
        }).then(() => {
            setInviteEmail("");
            reload("");
        })
    }

    function submitComment(ev) {
        ev.preventDefault();
        create_comment({
            "body": newComment,
            "file_id": file.id,
            "user_id": session.user_id
        }).then(() => {
            setNewComment("");
            reload("");
        })
    }

    function save() {
        if (updateFile.name.length < 1) {
            setFileNameError('A name is required');
        } else {

        }
    }

    return (
        <div className="socialInfoContainer padding">
            { fileOwner ?
                <Form onSubmit={(ev) => (ev.preventDefault())} autoComplete="new-password" style={{width: '100%'}}>
                    <Form.Group>
                        <Form.Control autoComplete="unsupportedrandom" className="header-form" type="email" value={updateFile.name} onChange={modifyName} placeholder="Enter name" />
                        { fileNameError ? <Form.Text className="text-danger">{fileNameError}</Form.Text> : <></> }
                    </Form.Group>
                </Form>
                :
                <h1 className="fileNameText">{file.name}</h1>
            }

            <div style={{height: '10px'}}></div>

            <div className="box slimPadding" style={{margin: '10px 0px'}}>
                <h5 className="text-muted">Description</h5>
                <div style={{height: '10px'}}></div>
                { fileOwner ?
                    <Form onSubmit={(ev) => (ev.preventDefault())} autoComplete="new-password" style={{width: '100%'}}>
                        <Form.Group>
                            <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" style={{height: '150px', resize: 'none'}}as="textarea" value={updateFile.description} onChange={modifyDescription} placeholder="Enter Description" />
                        </Form.Group>
                    </Form>
                    :
                    <div className="text-muted insetBorder" style={{height: '150px', overflowY: 'scroll', wordWrap: 'break-word'}}>{file.description ? file.description : 'None'}</div>
                }
            </div>

            <div style={{height: '10px'}}></div>

            <div className="box slimPadding flex-column" style={{margin: '10px 0px', overflow: 'visible'}}>
                <h5 className="text-muted">Invites</h5>
                <div className="insetBorder" style={{height: `${fileOwner ? '100px' : '150px'}`, overflow: 'scroll'}}>
                    {
                        file.invites.map((i) => {
                            return (
                                <div className="flex-row center space-between inviteDisplay" key={i.id}>
                                    <p className="text-muted" style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '200px'}}>- {i.email}</p>
                                    { (fileOwner && (i.email !== session.email)) ?
                                        <Button className="inviteDisplayDelete" variant="outline-danger" onClick={deleteInvite} value={i.id}>Delete</Button>
                                        :
                                        <></>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                { fileOwner ?
                    <Form onSubmit={submitInvite} autoComplete="new-password" style={{width: '100%', overflow: 'visible'}}>
                        <div className="flex-row" style={{overflow: 'visible'}}>
                            <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" type="text" value={inviteEmail} onChange={(ev) => {setInviteEmail(ev.target.value)}} placeholder="Invite email" />
                            <div style={{width: '15px'}}></div>
                            <Button variant="outline-info" type="submit">Invite</Button>
                        </div>
                    </Form>
                    :
                    <></>
                }
            </div>

            <div style={{height: '10px'}}></div>

            <div className="box slimPadding" style={{flex: 1, width: '100%', minHeight: '300px', margin: '10px 0px'}}>
                <div className="flex-column" style={{height: '100%'}}>
                    <h5 className="text-muted">Comments</h5>
                    <div className="commentsViewContainer">
                        {
                            file.comments.map((c) => {
                                return (
                                    <div className="flex-row center space-between inviteDisplay" key={c.id}>
                                        <p className="text-muted" style={{wordWrap: 'break-word', textOverflow: 'ellipsis', maxWidth: '200px'}}><span className="">{c.user.name}: </span>{c.body}</p>
                                        { (fileOwner) ?
                                            <Button className="inviteDisplayDelete" variant="outline-danger" onClick={deleteComment} value={c.id}>Delete</Button>
                                            :
                                            <></>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    { fileOwner ?
                        <Form onSubmit={submitComment} autoComplete="new-password" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-row" style={{overflow: 'visible'}}>
                                <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" type="text" value={newComment} onChange={(ev) => {setNewComment(ev.target.value)}} placeholder="Comment" />
                                <div style={{width: '15px'}}></div>
                                <Button variant="outline-info" type="submit">Invite</Button>
                            </div>
                        </Form>
                        :
                        <></>
                    }
                </div>
            </div>
        </div>
    )
}

function ShowFile({session}) {
    const { id } = useParams();

    const [body, setBody] = useState("");

    const [found, setFound] = useState(true);
    const [file, setFile] = useState({
        "name": "",
        "description": "",
        "language": 50,
        "user_name": "",
        "user_id": null,
        "user_email": "",
        "invites": [],
        "comments": [],
        "id": id,
        "alert": null
    });

    useEffect(() => {
        show_file(id)
            .then((resp) => {
                setFile({
                    "name": resp.name,
                    "description": resp.description,
                    "language": resp.language,
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
        show_file(id)
            .then((resp) => {
                setFile({
                    "name": resp.name,
                    "description": resp.description,
                    "language": resp.language,
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




    function bodyChange(val) {
        setBody(val);
    }

    if (found) {
        return (
            <div className="maxSize">
                <div className="flex-row">
                    <div className="fileInfoContainer">
                        <SocialInfo session={session} file={file} reload={reload} />
                    </div>
                    <div className="fileAceContainer">
                        <AceEditor 
                                mode="python" 
                                theme="pastel_on_dark" 
                                height="100vh"
                                width="100%"
                                value={body} 
                                onChange={bodyChange} 
                                highlightActiveLine={true}
                                showGutter={true}
                                readOnly={false}
                                setOptions={{
                                    enableLiveAutocompletion: true, 
                                    showLineNumbers: true,
                                }}
                            />
                    </div>
                    <div className="fileInfoContainer padding">
                        <HomeIcon />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="maxSize padding">
                <p>file with id {id} not found</p>
            </div>
        )
    }
}

export default connect(({session}) => ({session}))(ShowFile)