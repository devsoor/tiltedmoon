import React from 'react';
import { Router } from '@reach/router';
import {
  Admin,
  Reset,
  SignIn,
  SignUp,
  VideosShow,
} from './components/Pages'
import PrivateRoute from './components/Routes/PrivateRoute'
import PublicRoute from './components/Routes/PublicRoute'

const App = () => {
  return (
    <>
        <Router>
            <PublicRoute path='/adminregister' component={SignUp}/>
            <PrivateRoute path="/adminpage" component={Admin} />
            <PrivateRoute path="/videosshow" component={VideosShow} />
            <PublicRoute path="/" component={SignIn} />
            <PublicRoute path="/reset" component={Reset} />
        </Router>
    </>
  )
}

export default App;
