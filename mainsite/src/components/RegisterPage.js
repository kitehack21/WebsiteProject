import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux';
import {onRegister} from '../actions'
import Cookies from 'universal-cookie'

const cookies = new Cookies();

class RegisterPage extends Component {

    componentWillReceiveProps(newProps){
        if(newProps.auth.username !== ""){
                        //cookie name
            cookies.set('myCookie', newProps.auth.email, {path: "/"})
        }
    }

    onRegisterClick = () => {
        if(this.refs.username.value === "" || this.refs.email.value === "" || this.refs.password.value === ""){
            alert("Please Fill All Forms")
        }
        this.props.onRegister({
            username: this.refs.username.value,
            email: this.refs.email.value,
            password: this.refs.password.value
        })
    }

    //Redirects to SignIn page on click
    onSignInClick = () =>{
        this.props.history.push("/SignIn")
    }
    onKeyPress(x) {
        if (x.which == 13) {
            this.onRegisterClick()
        }
    }
    errorRender(){
        if(this.props.auth.error !== ""){
          return (
            <div>
              <br/>
              <div id="content" className="alert alert-danger rounded alert-block animated fadeInUp">
                {this.props.auth.error}
              </div>
            </div>
          )
        }
      }
 
    render(){
        if(this.props.auth.username === ""){
            return(
                <section id="content" className="m-t-lg wrapper-md animated fadeInDown">
                    <div className="container aside-xl">
                    <a className="navbar-brand block" href="index.html"><span className="h1 font-bold">Saku</span></a>
                    <section className="m-b-lg">
                        <header className="wrapper text-center">
                        <strong>Sign up to gain access to over 100,000+ songs!</strong>
                        </header>
                        <form action="index.html">
                        <div className="form-group">
                            <input type="username" ref="username" placeholder="Username" className="form-control rounded input-lg text-center no-border"  onKeyPress={this.onKeyPress.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <input type="email" ref="email" placeholder="Email" className="form-control rounded input-lg text-center no-border"  onKeyPress={this.onKeyPress.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" ref="password" placeholder="Password" className="form-control rounded input-lg text-center no-border"  onKeyPress={this.onKeyPress.bind(this)}/>
                        </div>
                        <div className="checkbox i-checks m-b">
                            <label className="m-l">
                                <input type="checkbox"/><i></i> Agree to the <a href="#">terms and policy</a>
                            </label>
                        </div>
                        <Button onClick={this.onRegisterClick} className="btn btn-lg btn-primary lt b-white b-2x btn-block btn-rounded"><i className="icon-arrow-right pull-right"></i><span className="m-r-n-lg">Register</span></Button>
                        {this.errorRender()}
                        <div className="line line-dashed"></div>
                        <p className="text-muted text-center"><small>Already have an account?</small></p>
                        <a className="btn btn-lg btn-info btn-block btn-rounded" onClick={()=>{this.onSignInClick()}}>Sign in</a>
                        </form>
                    </section>
                    </div>
                </section>
            )
        }
        
        return <Redirect to ="/" />
    }
}

//state below is the Global State
const mapStateToProps = (state) => {
    const auth = state.auth;
    return {auth};
}
export default connect(mapStateToProps, {onRegister})(RegisterPage);
  