import React from 'react';
import Actions from '../actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: undefined,
      password: undefined,
      enableSubmit: false
    };
  }

  changeEmailVal(e) {
    this.setState({email: e.target.value});
  }

  changePasswordVal(e) {
    this.setState({password: e.target.value});
  }

  toggleSubmitAbility() {
    this.setState({enableSubmit: (this.state.email && this.state.password) ? true : false});
  }

  logIn(e) {
    e.preventDefault();
    console.log(this.state.email);
    console.log(this.state.password);
    if (this.state.email && this.state.password) {
      var credentials = {
        email : this.state.email,
        password: this.state.password
      };

      Actions.logInUser(credentials);
    }
  }

  render() {
    return (
      <div className="row">
        <div id="login-form" className="col-sm-8 center-block">
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                value={this.state.email}
                onChange={this.changeEmailVal}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                value={this.state.pasword}
                onChange={this.changePasswordVal}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-default" onClick={this.logIn.bind(this)}>Submit</button>
          </form>
        </div>
      </div>
    );
  };
}

export default Login;
