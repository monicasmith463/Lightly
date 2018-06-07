"use strict";
// styling modified from: /bootsnipp.com/snippets/featured/register-page
class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
      zipcode: "",
      confirm: ""
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

  // handleSubmit = event => {
  //   // let username = $('#username').val();
  //   // let password = $('#password').val();
  //   let username = this.state.username;
  //   let password = this.state.password;
  //   console.log('username, password', username, password);
  //   if(validateSubmission()) {
  //     $.ajax({
  //         url: '/registerUser',
  //         data: $('form').serialize(),
  //         type: 'POST',
  //         success: function(response) {
  //             console.log(response);
  //         },
  //         error: function(error) {
  //             console.log("data:", $('form').serialize());
  //             console.log(error);
  //         }
  //     });
  //   } else {
  //     event.preventDefault();
  //   }
  // }

  render() {
    return (
      <div className="container">
    			<div className="row main">
    				<div className="panel-heading">
    	               <div className="panel-title text-center">
    	               		<h1 className="title">Register</h1>
    	               		<hr />
    	               	</div>
    	            </div>
    				<div className="main-login main-center">

    					<form action="/register" className="form-horizontal" method="POST">


    						<div className="form-group">
    							<label htmlFor="username" className="cols-sm-2 control-label">Username</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-user" aria-hidden="true"></i></span>
    									<input type="text" className="form-control" name="username" id="username" onChange={this.handleChange} placeholder="Enter your Username"/>
    								</div>
    							</div>
    						</div>

    						<div className="form-group">
    							<label htmlFor="email" className="cols-sm-2 control-label">Your Email</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-envelope" aria-hidden="true"></i></span>
    									<input type="text" className="form-control" name="email" id="email"  onChange={this.handleChange} placeholder="Enter your Email"/>
    								</div>
    							</div>
    						</div>

                <div className="form-group">
                  <label htmlFor="name" className="cols-sm-2 control-label">Your Zipcode</label>
                  <div className="cols-sm-10">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="glyphicon glyphicon-map-marker" aria-hidden="true"></i></span>
                      <input type="text" className="form-control" name="zipcode" id="zipcode" onChange={this.handleChange} placeholder="Enter your Zipcode"/>
                    </div>
                  </div>
                </div>

    						<div className="form-group">
    							<label htmlFor="password" className="cols-sm-2 control-label">Password</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-lock" aria-hidden="true"></i></span>
    									<input type="password" className="form-control" name="password" id="password" onChange={this.handleChange} placeholder="Enter your Password"/>
    								</div>
    							</div>
    						</div>

                <div className="form-group">
                  <label htmlFor="confirm" className="cols-sm-2 control-label">Confirm Password</label>
                  <div className="cols-sm-10">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="glyphicon glyphicon-lock" aria-hidden="true"></i></span>
                      <input type="password" className="form-control" name="confirm" id="confirm"  onChange={this.handleChange} placeholder="Confirm your Password"/>
                    </div>
                  </div>
                </div>

    						<div className="form-group ">
                  <input type="submit" value="Register" disabled={this.disableForm()} className="btn btn-primary btn-lg btn-block login-button"></input>

    						</div>
    						<div className="login-register">
    				            <a href="/login">Login</a>
    				         </div>
    					</form>
    				</div>
    			</div>
    		</div>


    							// <button type="button" disabled={this.disableForm()} className=>Register</button>



      // <form action="/register" method="POST">
      //
      //   <div className="form-group">
      //     <label>Username
      //         <input id="username" type="username" name="username" onChange={this.handleChange} required className="form-control"></input>
      //     </label>
      //   </div>
      //
      //   <div className="form-group">
      //     <label>Password
      //         <input id="password" type="password" name="password" onChange={this.handleChange} required className="form-control" maxLength="12"></input>
      //     </label>
      //   </div>
      //
      //   <div className="form-group">
      //     <label>Email
      //         <input id="email" type="email" name="email" onChange={this.handleChange} required className="form-control"></input>
      //     </label>
      //   </div>
      //
      //   <div className="form-group">
      //     <label>Zipcode
      //         <input id="zipcode" type="zipcode" name="zipcode" onChange={this.handleChange} required className="form-control"></input>
      //     </label>
      //   </div>
      //
      //   <div className="form-group">
      //     <input type="submit" value="Register" disabled={this.disableForm()} className="btn"></input>
      //   </div>
      //
      // </form>

    );
  }
}

/* main-start */
ReactDOM.render(
  <div>< Register /></div>,
    document.getElementById("root")
);
