import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch} from "react-router-dom";

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Event';


import './App.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch> // ? means only the 1st matching route will be used
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/event" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
      </BrowserRouter>
    )
  }
}
export default App;