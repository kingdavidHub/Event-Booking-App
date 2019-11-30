import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import MainNavigation from './components/Navigation/MainNavigation';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Event';


import './App.css';

class App extends Component {
  render() {
      return (
        <BrowserRouter>
          <>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/bookings" component={BookingsPage} />
                <Route path="/events" component={EventsPage} />
              </Switch>
            </main>
          </>
        </BrowserRouter>
    )
  }
}



export default App;