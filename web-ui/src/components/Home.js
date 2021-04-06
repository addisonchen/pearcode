import { useState } from 'react';

import HomeIcon from './HomeIcon';

import { Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { connect } from 'react-redux';


function Default() {
    const history = useHistory();

    function goToSignUp(ev) {
        ev.preventDefault();
        history.push('/signup');
    }

    return (
        <Button variant="outline-light" onClick={() => {history.push('/signup')}}>Sign Up | Login</Button>
    )
}

function LoggedInTemplate({session}) {

    const history = useHistory();
    return (
        <Button variant="outline-light" onClick={() => {history.push(`/users/${session.user_id}`)}} style={{textOverflow: 'clip', whiteSpace: 'nowrap'}}>{session.name} | Profile</Button>
    )
}

const LoggedIn = connect(({session}) => ({session}))(LoggedInTemplate);

function Home({session}) {
    const [val, setVal] = useState("");

    function onChange(val) {
        setVal(val)
    }

    return (
        <div className="maxSize">
            <div className="flex-row">
                <div className="padding" style={{width: '45vw'}}>
                    <div className="flex-row center space-between">
                        <HomeIcon />
                        { session ? 
                            <LoggedIn />
                            :
                            <Default />
                        }
                    </div>
                    <div style={{height: '30px'}}></div>
                    <div>
                        <p>Execute</p>
                    </div>
                </div>
                <div style={{width: '55vw'}}>
                    <AceEditor 
                        mode="python" 
                        theme="pastel_on_dark" 
                        height="100vh"
                        width="100%"
                        value={val} 
                        onChange={onChange} 
                        highlightActiveLine={true}
                        showGutter={true}
                        readOnly={false}
                        setOptions={{
                            enableLiveAutocompletion: true, 
                            showLineNumbers: true,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default connect(({session}) => ({session}))(Home);