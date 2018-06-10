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
  disableForm = () => {
    for(var field in this.state) {
      if(!this.state[field]) {
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
    									<input type="text" className="form-control" name="username" id="username" onChange={this.handleChange} required className="form-control" placeholder="Enter your Username"/>
    								</div>
    							</div>
    						</div>

    						<div className="form-group">
    							<label htmlFor="email" className="cols-sm-2 control-label">Your Email</label>
    							<div className="cols-sm-10">
    								<div className="input-group">
    									<span className="input-group-addon"><i className="glyphicon glyphicon-envelope" aria-hidden="true"></i></span>
    									<input type="text" className="form-control" name="email" id="email"  onChange={this.handleChange} required className="form-control" placeholder="Enter your Email"/>
    								</div>
    							</div>
    						</div>

                <div className="form-group">
                  <label htmlFor="name" className="cols-sm-2 control-label">Your Zipcode</label>
                  <div className="cols-sm-10">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="glyphicon glyphicon-map-marker" aria-hidden="true"></i></span>
                      <input type="text" className="form-control" name="zipcode" id="zipcode" onChange={this.handleChange} required className="form-control" placeholder="Enter your Zipcode"/>
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

                <div className="form-group">
                  <label htmlFor="confirm" className="cols-sm-2 control-label">Confirm Password</label>
                  <div className="cols-sm-10">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="glyphicon glyphicon-lock" aria-hidden="true"></i></span>
                      <input type="password" className="form-control" name="confirm" id="confirm"  onChange={this.handleChange} required className="form-control" placeholder="Confirm your Password"/>
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
    );
  }
}

/* main-start */
ReactDOM.render(
  <div>< Register /></div>,
    document.getElementById("root")
);
