import React from 'react';
import axios from 'axios';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { ProgressBar, Intent, Icon } from '@blueprintjs/core';
import { logout } from '../../../../actions/authActions';
import API from '../../../../API';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';


const MutationRegisterUser = 
`mutation Register($firstname:String!, $lastname:String!, $username:String!, $email:String!, $mobileNumber:String!, $password:String!, $confirmPassword:String!, $university:String!, $studentID:String!, $PTProficiency: Int!, $hasSmartphone:Boolean!, $friends:String, $dietaryRequirements:String) {
  registerUser(firstname:$firstname, lastname:$lastname, username:$username, email:$email, mobileNumber:$mobileNumber, password: $password, confirmPassword:$confirmPassword, university:$university, studentID:$studentID, PTProficiency:$PTProficiency, hasSmartphone:$hasSmartphone, friends:$friends, dietaryRequirements:$dietaryRequirements){
    firstname
    lastname
    username
    email
  }
}`;


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}


@connect(mapStateToProps)
@autobind
class RegisterForm extends React.Component {
	state = {
		firstname: '',
		lastname: '',
		university: 'Monash University',
		email: '',
		mobileNumber: '',
		username: '',
		password: '',
		confirmPassword: '',
		studentID: '',
		PTProficiency: '2',
		hasSmartphone: 'yes',
		friends: '',
		dietaryRequirements: '',
		currentStage: 1,
		loading: false,
		error: false,
		complete: false
	}

	handleInputChange(id, value) {
		this.setState({
			[id]: value
		});
	}

	changeStage(nextId) {
		return () => {
			this.setState({ currentStage: nextId });
		}
	}

	async submitForm() {
		this.setState({
			loading: true,
			error: false,
			currentStage: 5
		});
	
		let options = {
			method: 'POST',
			url: API.api,
			data: {
				query: MutationRegisterUser,
				variables: {
					firstname: this.state.firstname, 
					lastname: this.state.lastname, 
					username: this.state.username,
					email: this.state.email, 
					mobileNumber: this.state.mobileNumber, 
					password: this.state.password, 
					confirmPassword: this.state.confirmPassword,
					university: this.state.university, 
					studentID: this.state.studentID, 
					PTProficiency: this.state.PTProficiency, 
					hasSmartphone: this.state.hasSmartphone, 
					friends: this.state.friends,
					dietaryRequirements: this.state.dietaryRequirements
				}
			}
		}

		try {
			let result = await axios(options);
			if (result.data.data.registerUser.email === this.state.email) {
				this.setState({ complete: true, loading: false });
			}
			else {
				this.setState({ error: 'Registration unsuccessful (server error)', loading: false });
			}
		}
		catch (e) {
			this.setState({ error: e, loading: false });
		}
	}

	logout() {
		this.props.dispatch(logout(new Date()));
	}

	render() {
		if (this.props.authenticated) {
			return (
				<div className='info'>
					<div className='fail title'>
						You are already registered.
					</div>
					<p>
						Hey! You're logged in at the moment which means already have an account.
						If someone else is trying to registering, please&nbsp;
						<a style={{color: 'yellow'}}onClick={this.logout}>log out</a> first. 
					</p>
				</div>
			);
		}
		else if (!this.state.complete) {
			let form = null;
			switch (this.state.currentStage) {
				case 1: form = <Form1 onChange={this.handleInputChange} state={this.state} next={this.changeStage(2)}/>; break;
				case 2: form = <Form2 onChange={this.handleInputChange} state={this.state} next={this.changeStage(3)} back={this.changeStage(1)}/>; break;
				case 3: form = <Form3 onChange={this.handleInputChange} state={this.state} next={this.changeStage(4)} back={this.changeStage(2)}/>; break;
				case 4: case 5:
					form = <Form4 onChange={this.handleInputChange} state={this.state} back={this.changeStage(3)} submitForm={this.submitForm} loading={this.state.loading}/>; break;
			}

			let error = null;
			if (this.state.error) {
				error = (
					<div className='pt-callout pt-intent-danger pt-icon-error'>
						<h5>An error occurred</h5>
						{this.state.error.toString()}
					</div>
				);
			}
	
			return (
				<form id='registerform'>
					<ProgressBar className='progress pt-no-stripes' value={this.state.currentStage / 5}
					intent={this.state.currentStage===5?Intent.SUCCESS:Intent.PRIMARY}/>
					{error}
					{form}
				</form>
			);
		}
		else {
			return (
				<div className='info'>
					<div className='success title'>
						Registration successful!
					</div>
					<p>
						Thanks for registering, {this.state.firstname}!
						Stay tuned for more updates and instructions for the event.
						Please note that your place is <em>NOT</em> secured until you have <Link to='/pay'>paid</Link>.
					</p>
				</div>
			)
		}
	}
}


export default RegisterForm;
