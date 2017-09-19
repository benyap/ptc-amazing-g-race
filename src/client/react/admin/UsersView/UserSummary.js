import React from 'react';
import PropTypes from 'prop-types';


class UserSummary extends React.Component {
	static propTypes = {
		users: PropTypes.arrayOf(PropTypes.shape({
			firstname: PropTypes.string,
			lastname: PropTypes.string,
			username: PropTypes.string,
			email: PropTypes.string,
			university: PropTypes.string,
			enabled: PropTypes.bool,
			paidAmount: PropTypes.number,
		})).isRequired,
		paymentAmount: PropTypes.number.isRequired
	}

	render() {
		// Count users
		let userCount = 0;
		let paidCount = 0;
		this.props.users.forEach((user) => {
			userCount++;
			if (user.paidAmount >= this.props.paymentAmount) {
				paidCount++;
			}
		});

		let intent = 'pt-intent-danger';
		if (paidCount === userCount) intent = 'pt-intent-success';
		
		return (
			<div className={'pt-callout ' + intent}>
				{paidCount} out of {userCount} registered users have paid.
			</div>
		);
	}
}


export default UserSummary;