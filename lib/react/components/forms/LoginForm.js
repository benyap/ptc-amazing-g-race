import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { InputGroup, Button, Checkbox, Intent } from '@blueprintjs/core';
import { withRouter } from 'react-router-dom';

import '../../scss/components/_loginForm.scss';

@connect()
@withRouter
@autobind
class LoginForm extends React.Component {
	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		loginAction: PropTypes.func.isRequired,
		authenticationHandler: PropTypes.func.isRequired,
		next: PropTypes.string,
		remember: PropTypes.bool,
		preventRedirect: PropTypes.bool
	}

	static defaultProps = {
		next: '/home'
	}

	state = {
		loading: false,
		remember: this.props.remember,
		error: null,
		emailRequired: false,
		invalidEmail: false,
		passwordRequired: false,
		preventRedirect: false
	}

	handleRemember() {
		this.setState(prevState => ({
			remember: !prevState.remember
		}));
	}

	async loginHandler(e) {
		e.preventDefault();
		this.setState({ error: null, emailRequired: false, invalidEmail: false, passwordRequired: false });
		
		let invalid = false;
		
		if (!this.email.value.length) {
			invalid = true;
			this.setState({ emailRequired: true });
		}
		else {
			const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			let emailCheck = emailRegex.exec(this.email.value);
			if (!emailCheck) {
				invalid = true;
				this.setState({ invalidEmail: true });
			}
		}

		if (!this.password.value.length) {
			invalid = true;
			this.setState({ passwordRequired: true });
		}

		if (!invalid) {
			this.setState({ loading: true });
	
			// Send authentication request
			try {
				let result = await this.props.authenticationHandler(this.email.value, this.password.value);

				if (result.ok) {
					// Login successful
					this.props.dispatch(this.props.loginAction(this.email.value, result.access_token, result.refresh_token, this.state.remember, new Date()));
	
					// Redirect to next location
					if (!this.props.preventRedirect) {
						let next = this.props.next;
						if (this.props.location.state && this.props.location.state.next) 
							next = this.props.location.state.next;
						this.props.history.push(next);
					}
					else this.setState({ loading: false });
				}
				else {
					this.setState({ loading: false, error: result.message });
				}
			}
			catch (e) {
				let message = e.toString();
				if (message === 'Error: timeout of 5000ms exceeded') {
					message = 'The server took too long to respond. Please try again.';
				} 
				else console.log(e);
				this.setState({ loading: false, error: message });
			}
		}
		else {
			this.setState({ loading: false });
		}
	}

	renderErrors() {
		if (this.state.error || this.state.emailRequired || this.state.invalidEmail || this.state.passwordRequired) {
			return (
				<div className='pt-callout pt-intent-danger pt-icon-error'>
					<h5>Log in failed</h5>
					{ this.state.error ? this.state.error : null}
					{ this.state.emailRequired ? <span>Email is required<br/></span> : null}
					{ this.state.invalidEmail ? <span>Invalid email<br/></span> : null}
					{ this.state.passwordRequired ? <span>Password is required<br/></span> : null}
				</div>
			);
		}
		else return null;
	}

	render() {
		return (
			<form className='login form'>
				{ this.renderErrors() }
				<div className='pt-control-group pt-vertical'>
					<InputGroup
						className='pt-large'
						leftIconName='person'
						placeholder='Email'
						defaultValue={this.props.email}
						disabled={this.state.loading}
						inputRef={(e) => { this.email = e }}
						intent={(this.state.emailRequired||this.state.invalidEmail)?Intent.DANGER:Intent.NONE}
						type='email'
					/>
					<InputGroup
						className='pt-large'
						leftIconName='lock'
						defaultValue={this.props.password}
						placeholder='Password'
						disabled={this.state.loading}
						inputRef={(e) => { this.password = e }}
						intent={this.state.passwordRequired?Intent.DANGER:Intent.NONE}
						type='password'
					/>
				</div>
				<Checkbox 
					disabled={this.state.loading}
					className='remember-checkbox' 
					label='Remember me on this device' 
					onChange={this.handleRemember} 
					defaultChecked={this.props.remember}
				/>
				<Button 
					className='pt-large pt-fill'
					type='submit'
					intent={Intent.PRIMARY}
					loading={this.state.loading}
					onClick={this.loginHandler}
				>
					Log in
				</Button>
			</form>
		);
	}
}


export default LoginForm;
