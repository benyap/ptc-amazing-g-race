import React from 'react';
import { autobind } from 'core-decorators';
import { ProgressBar, Intent } from '@blueprintjs/core';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';


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
		currentStage: 1
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

	submitForm() {
		console.log(this.state);
	}

	render() {
		let form = null;
		switch (this.state.currentStage) {
			case 1: form = <Form1 onChange={this.handleInputChange} state={this.state} next={this.changeStage(2)}/>; break;
			case 2: form = <Form2 onChange={this.handleInputChange} state={this.state} next={this.changeStage(3)} back={this.changeStage(1)}/>; break;
			case 3: form = <Form3 onChange={this.handleInputChange} state={this.state} next={this.changeStage(4)} back={this.changeStage(2)}/>; break;
			case 4: form = <Form4 onChange={this.handleInputChange} state={this.state} back={this.changeStage(3)} submitForm={this.submitForm}/>; break;
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
