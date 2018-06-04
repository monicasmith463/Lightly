"use strict";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
      zipcode: ""
    };
  }

//validate form detects the length of the username and password to enable/disable submit button
  disableForm() {
    for(var key in this.state) {
      if(!this.state[key]) {
        return true;
      }
    }
    return false;
  }

//handleChange sets username and password of the login object to the value
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateSubmission = () => {
    //look up username to see if in database already using AJAX
    return (!this.state.username.length || !this.state.password.length);
  }

  handleSubmit = event => {
    // let username = $('#username').val();
    // let password = $('#password').val();
    let username = this.state.username;
    let password = this.state.password;
    console.log('username, password', username, password);
    if(validateSubmission()) {
      $.ajax({
          url: '/registerUser',
          data: $('form').serialize(),
          type: 'POST',
          success: function(response) {
              console.log(response);
          },
          error: function(error) {
              console.log("data:", $('form').serialize());
              console.log(error);
          }
      });
    } else {
      event.preventDefault();
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <div className="form-group">
          <label>Username
              <input id="username" type="username" name="username" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <label>Password
              <input id="password" type="password" name="password" onChange={this.handleChange} required className="form-control" maxLength="12"></input>
          </label>
        </div>

        <div className="form-group">
          <label>Email
              <input id="email" type="email" name="email" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <label>Zipcode
              <input id="zipcode" type="zipcode" name="zipcode" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <input type="submit" value="Register" disabled={this.disableForm()} className="btn"></input>
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
      //       disabled={!this.disableForm()}
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
  <div>< Register /></div>,
    document.getElementById("root")
);
