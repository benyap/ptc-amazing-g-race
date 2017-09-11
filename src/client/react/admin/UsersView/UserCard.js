import React from 'react';


class UserCard extends React.Component {
	render() {
		let { firstname, lastname, username, email, university } = this.props.user;

		return (
			<div className='pt-card pt-elevation-0 pt-interactive'>
				<h5>{firstname + ' ' + lastname}</h5>
				<p className='pt-text-muted'>
					{university}
				</p>

			</div>
		);
	}
}


export default UserCard;
