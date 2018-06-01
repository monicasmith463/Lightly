"use strict";



class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usernamereg: "",
      passwordreg: ""
    };
  }

//validate form detects the length of the username and password to enable/disable submit button
  validateForm() {
    return (this.state.usernamereg.length > 0) && (this.state.passwordreg.length > 0);
  }

//handleChange sets username and password of the login object to the value
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // validateSubmission = () => {
  //   //look up username to see if in database already using AJAX
  //   let promise =
  //   return return (this.state.usernamereg.length > 0) && (this.state.passwordreg.length > 0);
  // }

  handleSubmit = event => {
    // let username = $('#usernamereg').val();
    // let password = $('#passwordreg').val();
    let username = this.state.usernamereg;
    let password = this.state.passwordreg;
    // console.log('username, password', username, password);
    if validateSubmission(username, password) {
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
          <label>Username:
              <input id="usernamereg" type="username" name="username" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <label>Password:
              <input id="passwordreg" type="password" name="password" onChange={this.handleChange} required className="form-control"></input>
          </label>
        </div>

        <div className="form-group">
          <input type="submit" value="Register" disabled={!this.validateForm()} className="btn"></input>
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
  <div>< Register /></div>,
    document.getElementById("root")
);
