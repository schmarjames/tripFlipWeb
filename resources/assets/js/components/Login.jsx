import React from 'react';
import Actions from '../actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: undefined,
      password: undefined,
      enableSubmit: ""
    };
  }

  changeEmailVal(e) {
    this.setState({email: e.target.value});
    this.toggleSubmitAbility();
  }

  changePasswordVal(e) {
    this.setState({password: e.target.value});
    this.toggleSubmitAbility();
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
      <div>
        <div className="overlay"></div>
        <div id="login-form" className="col-sm-8 center-block">
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                value={this.state.email}
                onChange={this.changeEmailVal.bind(this)}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                value={this.state.pasword}
                onChange={this.changePasswordVal.bind(this)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password" />
            </div>
            <input type="submit" className="btn btn-default" onClick={this.logIn.bind(this)} disabled={this.state.enableSubmit ? "" : "disabled"} value="Submit" />
          </form>
        </div>
      </div>
    );
  };
}

export default Login;
