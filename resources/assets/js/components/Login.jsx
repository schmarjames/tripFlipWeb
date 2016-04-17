import React from 'react';
import Actions from '../actions';

class Login extends React.Component {
  constructor() {
    super();
  }

  logIn(e) {
    e.preventDefault();

    Actions.logInUser({
      email: "rob@gmail.com",
      password: "Impala96"
    });
  }

  render() {
    return (
      <div className="row">
        <div id="login-form" className="col-md-8">
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-default" onClick={this.logIn}>Submit</button>
          </form>
        </div>
      </div>
    );
  };
}

export default Login;
