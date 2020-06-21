import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import './App.css';
import MapComponent from './components/MapComponent';
import AddRoad from './components/AddRoad';
import DetailsPage from './components/DetailsPage';


const AnimatedSwitch = withRouter(({ location }) => {
  return (
    <Switch>
      <Route path="/add">
        <AddRoad />
      </Route>
      <Route path="/details/:id">
        <DetailsPage />
      </Route>
      <Route path="/">
        <MapComponent />
      </Route>
    </Switch>)

});

function App() {
  return (
    <Router>
      <AnimatedSwitch />
    </Router>
  );
}

export default App;
