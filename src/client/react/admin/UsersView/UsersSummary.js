import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import FormInput from '../../../../../lib/react/components/forms/FormInput';

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
		onFilterChange: PropTypes.func.isRequired,
		filterValue: PropTypes.string.isRequired
	}

	onChange(e) {
		this.props.onFilterChange(e.target.value);
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
				<div class='pt-input-group'>
					<span class='pt-icon pt-icon-search'></span>
					<input class='pt-input' type="search" placeholder='Filter...' value={this.props.filterValue} onChange={this.onChange}/>
				</div>
			</div>
		);
	}
}


export default UserSummary;
