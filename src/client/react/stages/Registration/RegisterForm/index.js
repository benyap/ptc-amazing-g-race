import React from 'react';
import axios from 'axios';
import { autobind } from 'core-decorators';
import { withRouter, Link } from 'react-router-dom';
import { ProgressBar, Intent, Icon } from '@blueprintjs/core';
import API from '../../../../API';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';


const MutationRegisterUser = 
`mutation Register($firstname:String!, $lastname:String!, $username:String!, $email:String!, $mobileNumber:String!, $password:String!, $confirmPassword:String!, $university:String!, $studentID:String!, $PTProficiency: Int!, $hasSmartphone:Boolean!, $friends:String) {
  registerUser(firstname:$firstname, lastname:$lastname, username:$username, email:$email, mobileNumber:$mobileNumber, password: $password, confirmPassword:$confirmPassword, university:$university, studentID:$studentID, PTProficiency:$PTProficiency, hasSmartphone:$hasSmartphone, friends:$friends){
    firstname
    lastname
    username
    email
  }
}`;


@withRouter
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
					friends: this.state.friends
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

	render() {
		if (!this.state.complete) {
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
				<div className='success'>
					<div className='success-title'>
						Registration successful!
					</div>
					<p>
						Thanks for registering, {this.state.firstname}!
						Stay tuned for more updates and instructions for the event.
						Please not that your place is <em>NOT</em> secured until you have <Link to='/pay'>paid</Link>.
					</p>
				</div>
			)
		}
	}
}


export default RegisterForm;
