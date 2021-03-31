import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { create_meeting } from '../../api';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { InlineDateTimePicker } from 'react-tempusdominus-bootstrap';
import moment from 'moment';


function CreateMeeting({session}) {

    const history = useHistory();
    const [meeting, setMeeting] = useState({
        'name': "",
        'description': "",
        'user_id': ""
    });

    const [date, setDate] = useState("");

    const [errors, setErrors] = useState({
        'name': null,
        'date': null,
        'description': null
    })

    function updateName(ev) {
        let newMeeting = Object.assign({}, meeting);
        newMeeting["name"] = ev.target.value;
        setMeeting(newMeeting);
    }

    function updateDescription(ev) {
        let newMeeting = Object.assign({}, meeting);
        newMeeting["description"] = ev.target.value;
        setMeeting(newMeeting);
    }

    function updateDate(ev) {
        setDate(ev.date);
    }

    function onShowDate(ev) {
        setDate(moment());
    }

    function onSubmit(ev) {
        ev.preventDefault();
        let newMeeting = Object.assign({}, meeting);
        newMeeting["user_id"] = session.user_id;
        newMeeting["date"] = date.format('YYYY-MM-DD hh:mm:ss');

        // todo: SUBMIT! catch errors
        create_meeting(newMeeting).then((resp) => {
            if (resp.errors) {
                if (resp.errors.name) {
                    let newErrors = Object.assign({}, errors);
                    newErrors['name'] = resp.errors.name[0];
                    setErrors(newErrors);
                } else {
                    let newErrors = Object.assign({}, errors);
                    newErrors['name'] = "";
                    setErrors(newErrors);
                }

                if (resp.errors.date) {
                    let newErrors = Object.assign({}, errors);
                    newErrors['date'] = resp.errors.date[0];
                    setErrors(newErrors);
                } else {
                    let newErrors = Object.assign({}, errors);
                    newErrors['date'] = "";
                    setErrors(newErrors);
                }

                if (resp.errors.description) {
                    let newErrors = Object.assign({}, errors);
                    newErrors['description'] = resp.errors.description[0];
                    setErrors(newErrors);
                } else {
                    let newErrors = Object.assign({}, errors);
                    newErrors['description'] = "";
                    setErrors(newErrors);
                }
            } else {
                history.push(`/meetings/${resp.data.id}`);
            }
        });
    }



    return (
        <div className="margin padding">
            <h1>Create Meeting</h1>
            { session === null ?
                <p>You must be logged in to create a meeting</p>
            :
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Meeting Name</Form.Label>
                        <Form.Control type="text" onChange={updateName} value={meeting.name} placeholder="Choose a meeting name" />
                        { errors.name ?
                            <Form.Text className="text-danger">{errors.name}</Form.Text>
                        :
                            <Form.Text className="text-muted">Enter any name!</Form.Text>
                        }
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" onChange={updateDescription} value={meeting.description} />
                        { errors.description ?
                            <Form.Text className="text-danger">{errors.description}</Form.Text>
                        :
                            <Form.Text className="text-muted">What will happen at this meeting</Form.Text>
                        }
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Time</Form.Label>
                        <div style={{position: "relative"}}>
                            <InlineDateTimePicker sideBySide={true} onChange={updateDate} onShow={onShowDate} date={date} />
                        </div>
                        { errors.date ?
                            <Form.Text className="text-danger">{errors.date}</Form.Text>
                        :
                            <Form.Text className="text-muted">Pick a date and time</Form.Text>
                        }
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create!
                    </Button>
                </Form>
            }
        </div>
    )
}

export default connect(({session}) => ({session}))(CreateMeeting)