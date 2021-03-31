import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import './App.scss';

import Nav from './components/Nav';
import Home from './components/Home';
import CreateUser from './components/users/CreateUser';
import CreateMeeting from './components/meetings/CreateMeeting';
import ShowMeeting from './components/meetings/ShowMeeting';
import EditMeeting from './components/meetings/EditMeeting';
import EditUser from './components/users/EditUser';
import ShowUser from './components/users/ShowUser';

function App() {
  return (
    <>
      <Nav />
      <Container className="mainContainer">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route> 

          <Route exact path="/users/create">
            <CreateUser inline={false} />
          </Route>

          <Route exact path="/users/:id">
            <ShowUser />
          </Route>

          <Route exact path="/users/edit/:id">
            <EditUser />
          </Route>

          <Route exact path="/meetings/create">
            <CreateMeeting />
          </Route>

          <Route exact path="/meetings/:id">
            <ShowMeeting />
          </Route>

          <Route exact path="/meetings/edit/:id">
            <EditMeeting />
          </Route>
        </Switch>
      </Container>
      <div className="footer"></div>
    </>
  );
}

export default App;
