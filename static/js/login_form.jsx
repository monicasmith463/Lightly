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
    return (!this.state.username.length || !this.state.password.length);
  }

//handleChange sets username and password of the login object to the value
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <div className="container">
    			<div className="row main">
    				<div className="panel-heading">
    	               <div className="panel-title text-center">
    	               		<h1 className="title">Login</h1>
    	               	</div>
    	            </div>
    				<div className="main-login main-center">

    					<form action="/login" className="form-horizontal" method="POST">


    						<div className="form-group">
    							<label htmlFor="username" className="cols-sm-2 control-label">Username</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-user" aria-hidden="true"></i></span>
    									<input type="text" className="form-control" name="username" id="username" onChange={this.handleChange} required className="form-control" placeholder="Enter your Username"/>
    								</div>
    							</div>
    						</div>

    						<div className="form-group">
    							<label htmlFor="password" className="cols-sm-2 control-label">Password</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-lock" aria-hidden="true"></i></span>
    									<input type="password" className="form-control" name="password" id="password" onChange={this.handleChange} required className="form-control" placeholder="Enter your Password"/>
    								</div>
    							</div>
    						</div>

    						<div className="form-group ">
                  <input type="submit" value="Login" disabled={this.validateForm()} className="btn btn-primary btn-lg btn-block login-button"></input>

    						</div>
    						<div className="login-login">
    				            <a href="/register">Register</a>
    				         </div>
    					</form>
    				</div>
    			</div>
    		</div>
    );
  }
}

/* main-start */
ReactDOM.render(
  <div>< Login /></div>,
    document.getElementById("root")
);
