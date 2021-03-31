import React from 'react';

import { Row, Col, Table } from 'react-bootstrap';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


function Home({users, meetings}) {
    return (
        <div className="margin padding">
            <Row>
                <Col>
                    <Row>
                        <h1>Meetings Planner V2</h1>
                    </Row>
                    <Row>
                        <p>New and improved with a Phoenix server backend and React frontend</p>
                    </Row>
                </Col>
            </Row>
            <Row>
                <div style={{height: "20px"}}></div>
            </Row>
            <Row>
                <Col md={6}>
                    <h2>Meetings</h2>
                    <div style={{height: "25px"}}></div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                meetings.map((meeting) => {
                                    return (
                                        <tr key={meeting.id}>
                                            <td>
                                                <Link to={`/meetings/${meeting.id}`}>
                                                    {meeting.name}
                                                </Link>
                                            </td>
                                            <td>{meeting.date}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
                <Col md={6}>
                    <h2>Users</h2>
                    <div style={{height: "25px"}}></div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user) => {
                                    return (
                                    <tr key={user.id}>
                                        <td>
                                            <Link to={`/users/${user.id}`}>
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td>{user.email}</td>
                                    </tr>
                                )})
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>
    )
}

export default connect(({users, meetings}) => ({users, meetings}))(Home);