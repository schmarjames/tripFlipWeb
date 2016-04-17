import React from 'react';

// public app components
import App from '../components/App.jsx';
import Marketing from '../components/Marketing.jsx';
import Discovery from '../components/Discovery.jsx';
import Login from '../components/Login.jsx';

// admin app components
import Admin from '../adminComponents/Admin.jsx';
import Dashboard from '../adminComponents/Dashboard.jsx';
import AdminLogin from '../adminComponents/Login.jsx';

import JQuery from 'jquery';
import {Router, Route, Link, IndexRoute, useRouterHistory} from 'react-router';
import { createHashHistory } from 'history'
import { render } from 'react-dom';
//let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

render((
  <Router history={appHistory}>
    <Route path="/" component={App}>
      <Route path="marketing" component={Marketing} />
      <Route path="discovery" component={Discovery} />
      <Route path="login" component={Login} />
    </Route>
    <Route path="/admin/" component={Admin}>
      <Route path="dashboard" component={Dashboard} />
      <Route path="login" component={AdminLogin} />
    </Route>
  </Router>
), document.getElementById('app'))
