import { useState } from 'react';

import HomeIcon from './HomeIcon';

import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import "ace-builds";
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";


// language imports
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-prolog";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-swift";

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

    const [language, setLanguage] = useState(71);

    const [toggle, setToggle] = useState([false, false]);

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    function onChange(val) {
        setVal(val)
    }

    return (
        <div className="maxSize">
            <div className="flex-row">
                <div className="padding" style={{width: '500px', height: '100vh', overflowY: 'scroll'}}>
                    <div className="flex-row center space-between">
                        <HomeIcon />
                        { session ? 
                            <LoggedIn />
                            :
                            <Default />
                        }
                    </div>
                    <div style={{height: '30px'}}></div>

                    <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '20px 0px'}}>
                        <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                            <h5 className="toggleBoxHeading">About</h5>
                            { toggle[0] ?
                                <h5 className="toggleBoxHeading dSign">-</h5>
                                :
                                <h5 className="toggleBoxHeading dSign">+</h5>
                            }
                        </div>
                        <div style={{overflow: 'scroll', padding: '20px 0px'}}>
                            <p>Welcome to Pearcode, a collaborative development environment for quick testing and live pair programming.</p>
                            <div style={{height: '20px'}}></div>
                            <p>Choose a language and get coding!</p>
                        </div>
                    </div>



                    <div className="box slimPadding flex-row boxHeadingContainer" style={{margin: '20px 0px'}}>
                        <Form.Control className="dark-form" as="select" value={language} onChange={(ev) => {setLanguage(ev.target.value)}}>
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
                        <div style={{width: '10px'}}></div>
                        <Button variant="outline-success">Execute</Button>
                    </div>

                    <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[1] ? '' : 'closed'}`} style={{margin: '20px 0px'}}>
                        <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                            <h5 className="toggleBoxHeading">Results</h5>
                            { toggle[1] ?
                                <h5 className="toggleBoxHeading dSign">-</h5>
                                :
                                <h5 className="toggleBoxHeading dSign">+</h5>
                            }
                        </div>
                        <div className="insetBorder" style={{height: '500px', overflow: 'scroll'}}>
                            {/* put stuff in this box boi */}
                        </div>
                    </div>

                </div>
                <div style={{flexGrow: '1'}}>
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