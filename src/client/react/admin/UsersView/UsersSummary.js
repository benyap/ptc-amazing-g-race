import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import FormInput from '../../../../../lib/react/components/forms/FormInput';
import Search from './Search';

import '../../scss/admin/_user-summary.scss';


@autobind
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
		paymentAmount: PropTypes.number.isRequired,
		onSearchChange: PropTypes.func.isRequired,
		searchValue: PropTypes.string.isRequired
	}

	onSearchChange(e) {
		this.props.onSearchChange(e.target.value);
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
			<div id='user-summary' className={'pt-callout ' + intent}>
				{paidCount} out of {userCount} registered users have paid.
				<div className='user-summary-controls'>
					<Search value={this.props.searchValue} onChange={this.onSearchChange}/>
				</div>
			</div>
		);
	}
}


export default UserSummary;
