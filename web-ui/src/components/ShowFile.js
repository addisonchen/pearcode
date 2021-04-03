import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory, Link } from 'react-router-dom';

import { Table, Button, Row, Col, Form } from 'react-bootstrap';

import { show_user, all_invites, create_file, show_file } from '../api';

import { connect } from 'react-redux';

import store from './../store';


function ShowFile({session}) {
    const { id } = useParams();

    return (
        <div className="windowSize padding">
            <p>{id}</p>
        </div>
    )
}

export default connect(({session}) => ({session}))(ShowFile)