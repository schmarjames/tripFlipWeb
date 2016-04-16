import React from 'react';
import App from '../components/App.jsx';
import Marketing from '../components/Marketing.jsx';
import Login from '../components/Login.jsx';
import JQuery from 'jquery';
import {Router, Route, Link, IndexRoute, useRouterHistory} from 'react-router';
import { createHashHistory } from 'history'
import { render } from 'react-dom';
//let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

render((
  <Router history={appHistory}>
    <Route path="/" handler={App}>
      <Route path="marketing" handler={Marketing} />
      <Route path="login" handler={Login} />
      <Route path="*" component={Marketing}/>
    </Route>
  </Router>
), document.getElementById('app'))
