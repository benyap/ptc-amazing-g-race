import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from '@blueprintjs/core';


@autobind
class UserProfile extends React.Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		closeProfile: PropTypes.func.isRequired
	}
	
	closeProfile() {
		this.props.closeProfile();
	}

	render() {
		let { firstname, lastname, username, email, university } = this.props.user;

		return (
			<div className='pt-card'>
				<Button onClick={this.closeProfile} style={{float:'right'}}>Close</Button>
				<h5>{firstname + ' ' + lastname}</h5>
				<p className='pt-text-muted'>
					{university}
				</p>

			</div>
		);
	}
}


export default UserProfile;
