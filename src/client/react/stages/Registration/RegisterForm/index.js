import React from 'react';
import axios from 'axios';
import { autobind } from 'core-decorators';
import { ProgressBar, Intent } from '@blueprintjs/core';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';


const MutationRegisterUser = 
`mutation Register($firstname:String!, $lastname:String!, $username:String!, $email:String!, $mobileNumber:String!, $password:String!, $confirmPassword:String!, $university:String!, $studentID:String!, $PTProficiency: Int!, $hasSmartphone:Boolean!, $friends:String) {
  registerUser(firstname:$firstname, lastname:$lastname, username:$username, email:$email, mobileNumber:$mobileNumber, password: $password, confirmPassword:$confirmPassword, university:$university, studentID:$studentID, PTProficiency:$PTProficiency, hasSmartphone:$hasSmartphone, friends:$friends){
    _id
    firstname
    lastname
    username
    email
    studentID
    university
    raceDetails{
      PTProficiency
      hasSmartphone
      friends
    }
  }
}`;


@autobind
class RegisterForm extends React.Component {
	state = {
		firstname: '',
		lastname: '',
		university: 'Monash University',
		email: '',
		mobile: '',
		password: '',
		password2: '',
		studentID: '',
		PTProficiency: '2',
		hasSmartphone: 'yes',
		friends: '',
		currentStage: 1,
		loading: false
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
			loading: true
		});
		console.log(this.state);
		
	}

	render() {
		let form = null;
		switch (this.state.currentStage) {
			case 1: form = <Form1 onChange={this.handleInputChange} state={this.state} next={this.changeStage(2)}/>; break;
			case 2: form = <Form2 onChange={this.handleInputChange} state={this.state} next={this.changeStage(3)} back={this.changeStage(1)}/>; break;
			case 3: form = <Form3 onChange={this.handleInputChange} state={this.state} next={this.changeStage(4)} back={this.changeStage(2)}/>; break;
			case 4: form = <Form4 onChange={this.handleInputChange} state={this.state} back={this.changeStage(3)} submitForm={this.submitForm} loading={this.state.loading}/>; break;
		}

		return (
			<form id='registerform'>
				<ProgressBar className='progress pt-no-stripes' intent={Intent.PRIMARY} value={this.state.currentStage / 4}/>
				{form}
			</form>
		);
	}
}


export default RegisterForm;
