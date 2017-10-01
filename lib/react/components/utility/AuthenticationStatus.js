import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const mapStateToProps = (state, ownProps) => {
	return {
		email: state.auth.login.email
	}
}

@connect(mapStateToProps)
class AuthenticationStatus extends React.Component {
	static propTypes = {
		authenticated: PropTypes.bool
	}

	render() {
		let styles = 'pt-callout';
		let status = 'none';

		// Add coloured styles if wrapped by Authenticated container
		if (this.props.authenticated === true) {
			styles += ' pt-intent-success';
			status = 'true';
		}
		else if (this.props.authenticated === false) {
			styles += ' pt-intent-danger';
			status = 'false';
		}

		return (
			<div className={styles}>
				<h5>Authentication Status</h5>
				Authenticated: <code>{status}</code>
				<br/>
				{ status === 'true' && this.props.email ? 
					<span>User email: <code>{this.props.email}</code></span> : null }
			</div>
		);
	}
}


export default AuthenticationStatus;
