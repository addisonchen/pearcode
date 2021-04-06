import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

import { show_user, all_invites, create_file, show_file, update_file, delete_invite, create_invite, delete_comment, create_comment, delete_file } from '../api';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { connect } from 'react-redux';

import store from './../store';

function NoSession({ id }) {
    // todo sign up / login
    return (
        <p>{id} todo no session page</p>
    )
}

function EditorInfo({ session, file, language, setLanguage, save, body }) {
    const history = useHistory();

    const fileOwner = session.user_id === file.user_id;

    const copyLink = `https://pearcode.swoogity.com/files/${file.id}`;

    const [toggle, setToggle] = useState([true, false]);

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    function downloadFile(name) {
        let map = {
            50: '.c',
            54: '.cpp',
            57: '.ex',
            62: '.java',
            63: '.js',
            69: '.pl',
            71: '.py',
            72: '.rb',
            83: '.swift'
        }
        let ext = map[language]
        const element = document.createElement("a");
        const file = new Blob([body], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${name}${ext}`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    function deleteFile(id) {
        delete_file(id).then(()=>{
            // TODO
            console.log('fix deleting when others are viewing!');
            history.push(`/users/${session.user_id}`);
        })
    }

    return (
        <div className="editorInfoContainer padding">
            <div style={{minHeight: '45px', width: '100%'}}>
                <div className="flex-row center space-between" style={{width: '100%', overflow: 'visible', minHeight: '38px'}}>
                    <Button variant="outline-info" onClick={() => {history.push(`/users/${session.user_id}`)}} style={{textOverflow: 'clip', whiteSpace: 'nowrap'}}>Your Profile</Button>
                    <h1 className="headingEmoji" onClick={() => {history.push('/')}}>🍐</h1>
                </div>
            </div>
            
            { fileOwner ?
                <div className="box inset slimPadding">
                    <div className="flex-row center space-between" style={{width: '100%', padding: '0px 20px', overflow: 'visible'}}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Save</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {save()}}>💾</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Copy Link</Tooltip>}>
                            <h1 className="headingEmoji small">📎</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Download File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {downloadFile(file.name)}}>🖨️</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {deleteFile(file.id)}}>🗑️</h1>
                        </OverlayTrigger>
                    </div>
                </div>
            :
                <div className="box inset slimPadding">
                    <div className="flex-row center space-between" style={{width: '100%', padding: '0px 20px', overflow: 'visible'}}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Not file owner</Tooltip>}>
                            <h1 className="headingEmoji small disabled">💾</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Copy Link</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {navigator.clipboard.writeText(copyLink)}}>📎</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Download File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {downloadFile(file.name)}}>🖨️</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Not file owner</Tooltip>}>
                            <h1 className="headingEmoji small disabled">🗑️</h1>
                        </OverlayTrigger>
                    </div>
                </div>
            }

            <div className="box slimPadding flex-column boxHeadingContainer" style={{margin: '10px 0px'}}>
                <Form.Control className="dark-form muted" as="select" value={language} onChange={(ev) => {setLanguage(ev.target.value)}}>
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
                <div style={{height: '10px'}}></div>
                <Button variant="outline-info">Execute</Button>
            </div>

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                    <h5 className="text-muted toggleBoxHeading">Activity</h5>
                    { toggle[0] ?
                        <h5 className="toggleBoxHeading text-muted dSign">-</h5>
                        :
                        <h5 className="toggleBoxHeading text-muted dSign">+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: '200px', overflow: 'scroll'}}>
                    {/* put stuff in this box boi */}
                </div>
            </div>

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[1] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                    <h5 className="text-muted toggleBoxHeading">Results</h5>
                    { toggle[1] ?
                        <h5 className="toggleBoxHeading text-muted dSign">-</h5>
                        :
                        <h5 className="toggleBoxHeading text-muted dSign">+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: '500px', overflow: 'scroll'}}>
                    {/* put stuff in this box boi */}
                </div>
            </div>
        </div>
    )
}


function SocialInfo({ session, file, reload, updateFile, setUpdateFile, fileNameError }) {

    const history = useHistory();

    const [inviteEmail, setInviteEmail] = useState("");

    const [newComment, setNewComment] = useState("");

    const fileOwner = session.user_id === file.user_id;

    const [toggle, setToggle] = useState([false, false, false]);

    const invited = file.invites.some((i) => {return i.email === session.email})

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

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    return (
        <div className="socialInfoContainer padding">
            <div style={{minHeight: '85px', width: '100%'}}>
                { fileOwner ?
                    <Form onSubmit={(ev) => (ev.preventDefault())} autoComplete="new-password" style={{width: '100%'}}>
                        <Form.Control autoComplete="unsupportedrandom" className="header-form" type="email" value={updateFile.name} onChange={modifyName} placeholder="Enter name" />
                    </Form>
                    :
                    <h1 className="fileNameText">{file.name}</h1>
                }
                { fileNameError ?
                    <p className="text-danger"> {fileNameError}</p>

                :
                    <p className="text-muted">Owner: <span className="hoverGreen" style={{cursor: 'pointer'}} onClick={() => history.push(`/users/${file.user_id}`)}>{file.user_name}</span></p>
                }
            </div>
            
            <div className={`box slimPadding boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                    <h5 className="text-muted toggleBoxHeading">Description</h5>
                    { toggle[0] ?
                        <h5 className="toggleBoxHeading text-muted dSign">-</h5>
                        :
                        <h5 className="toggleBoxHeading text-muted dSign">+</h5>
                    }
                </div>
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

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[1] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                    <h5 className="text-muted toggleBoxHeading">Invites</h5>
                    { toggle[1] ?
                        <h5 className="toggleBoxHeading text-muted dSign">-</h5>
                        :
                        <h5 className="toggleBoxHeading text-muted dSign">+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: `${fileOwner ? '200px' : '250px'}`, overflow: 'scroll'}}>
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
                { (fileOwner || invited) ?
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

            <div className={`box slimPadding boxHeadingContainer ${toggle[2] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-column" style={{overflow: 'visible', width: '100%'}}>
                    <div style={{minHeight: '24px'}} className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(2)}}>
                        <h5 className="text-muted toggleBoxHeading">Comments</h5>
                        { toggle[2] ?
                            <h5 className="toggleBoxHeading text-muted dSign">-</h5>
                            :
                            <h5 className="toggleBoxHeading text-muted dSign">+</h5>
                        }
                    </div>
                    <div className="insetBorder" style={{height: `${(fileOwner || invited) ? '200px' : '250px'}`, overflow: 'scroll'}}>
                        {
                            file.comments.map((c) => {
                                return (
                                    <div className="flex-row space-between inviteDisplay" style={{marginBottom: '5px'}} key={c.id}>
                                        <p className="text-muted" style={{wordWrap: 'break-word', textOverflow: 'ellipsis', maxWidth: '170px'}}><span className="commentUserName">{c.user.name}: </span>{c.body}</p>
                                        { ((fileOwner) || (c.user.id === session.user_id))?
                                            <Button className="inviteDisplayDelete" style={{marginTop: '4px'}} variant="outline-danger" onClick={deleteComment} value={c.id}>Delete</Button>
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
                                <Button variant="outline-info" type="submit">Post</Button>
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

    const [fileNameError, setFileNameError] = useState(false);

    const [updateFile, setUpdateFile] = useState({
        'name': "",
        'description': ""
    });

    const [language, setLanguage] = useState(50);

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

                setUpdateFile({
                    'name': resp.name,
                    'description': resp.description,
                });

                setLanguage(resp.language)
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

    function save() {
        if (updateFile.name.length < 1) {
            setFileNameError('A file name is required');
        } else {
            setFileNameError(false);
            update_file(id, {
                'id': id,
                'file': {
                    'name': updateFile.name,
                    'description': updateFile.description,
                    'language': language
                }
            }).then((resp) => {
                if (resp.errors) {
                    setFileNameError('Something went wrong');
                    console.log(resp);
                }
            })
        }
    }

    function bodyChange(val) {
        setBody(val);
    }

    if (found) {
        return (
            <div className="maxSize">
                <div className="flex-row">
                    <div className="fileInfoContainer">
                        <SocialInfo session={session} file={file} reload={reload} updateFile={updateFile} setUpdateFile={setUpdateFile} fileNameError={fileNameError} />
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
                    <div className="fileInfoContainer">
                        { session ?
                            <EditorInfo session={session} file={file} language={language} setLanguage={setLanguage} save={save} body={body}/>
                        :
                            <NoSession id={id}/>
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="maxSize padding">
                <HomeIcon />
                <div style={{height: '30px'}}></div>
                <p>file with id {id} not found</p>
            </div>
        )
    }
}

export default connect(({session}) => ({session}))(ShowFile)