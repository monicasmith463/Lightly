// import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
"use strict";



class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return !!(this.state.username.length && this.state.password.length);
  }

//handleChange sets username and password of the login object to the value
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    let username = $('#username').val();
    let password = $('#password').val();
    $.ajax({
        url: '/login',
        data: $('form').serialize(),
        type: 'POST',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <div className="form-group">
          <label>Username:
              <input id="username" type="username" name="username" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <label>Password:
              <input id="password" type="password" name="password" onChange={this.handleChange} required className="form-control" maxLength="12"></input>
          </label>
        </div>

        <div className="form-group">
          <input type="submit" value="Log In" disabled={!this.validateForm()} className="btn"></input>
        </div>

      </form>

      // <div className="form-group">
      //   <label>Username:
      //       <input type="username" name="username" required class="form-control">
      //   </label>
      // </div>

      // <div className="Login">
      //   <form onSubmit={this.handleSubmit}>
      //     <FormGroup controlId="email" bsSize="large">
      //       <ControlLabel>Email</ControlLabel>
      //       <FormControl
      //         autoFocus
      //         type="email"
      //         value={this.state.email}
      //         onChange={this.handleChange}
      //       />
      //     </FormGroup>
      //     <FormGroup controlId="password" bsSize="large">
      //       <ControlLabel>Password</ControlLabel>
      //       <FormControl
      //         value={this.state.password}
      //         onChange={this.handleChange}
      //         type="password"
      //       />
      //     </FormGroup>
      //     <Button
      //       block
      //       bsSize="large"
      //       disabled={!this.validateForm()}
      //       type="submit"
      //     >
      //       Login
      //     </Button>
      //   </form>
      // </div>
    );
  }
}

/* main-start */
ReactDOM.render(
  <div>< Login /></div>,
    document.getElementById("root")
);
