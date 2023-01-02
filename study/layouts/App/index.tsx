import React from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router';

const LogIn = loadable(() => import('@pages/LogIn'));
const SingUp = loadable(() => import('@pages/SingUp'));
const Workspace = loadable(() => import('@layouts/Workspce'));


const App = () => {
  return (
    <Switch>
      <Redirect exact path='/' to='/login' />
      <Route path='/login' component={LogIn} />
      <Route path='/singup' component={SingUp} />
      <Route path='/workspace/:workspace' component={Workspace} />
    </Switch>
  );
};

export default App;
