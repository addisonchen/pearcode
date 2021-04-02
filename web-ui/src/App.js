import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import Nav from './components/Nav';
import Home from './components/Home';
import SignUp from './components/SignUp';
import ShowUser from './components/ShowUser';

function App() {
  return (
    <>
      {/*<Nav />*/}
      <Container fluid className="mainContainer">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route> 

          <Route exact path="/signup">
            <SignUp />
          </Route>

          <Route exact path="/users/:id">
            <ShowUser />
          </Route>
        </Switch>
      </Container>
    </>
  );
}

export default App;
