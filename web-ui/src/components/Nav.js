import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { useState } from 'react';

import { api_login } from './../api';
import store from './../store';

function Navigation({session}) {
    return (
        <div className="nav">
            <h1>Pearcode</h1>
        </div>
    )
}

export default connect(({session}) => ({session}))(Navigation);