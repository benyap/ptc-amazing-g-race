import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import '../../scss/admin/_user-card.scss';


@autobind
class UserCard extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			firstname: PropTypes.string,
			lastname: PropTypes.string,
			username: PropTypes.string,
			email: PropTypes.string,
			university: PropTypes.string,
			enabled: PropTypes.bool,
			paidAmount: PropTypes.number,
			teamId: PropTypes.any
		}),
		paymentAmount: PropTypes.number.isRequired,
		renderProfile: PropTypes.func.isRequired
	}

	openProfile(e) {
		this.props.renderProfile(this.props.user);
	}

	render() {
		let { firstname, lastname, username, email, university, enabled } = this.props.user;
		let { paymentAmount } = this.props;

		return (
			<div className='pt-card pt-elevation-0 pt-interactive user-card' onClick={this.openProfile}>
				<h5>
					<span className={'pt-icon pt-icon-dollar' + (this.props.user.paidAmount >= paymentAmount ? ' pt-intent-success' : ' pt-intent-danger') }> </span>
					<span className={'pt-icon ' + (this.props.user.teamId ? 'pt-icon-confirm pt-intent-success' : 'pt-icon-circle pt-intent-warning') }> </span>
					{enabled ? null : <span className='pt-icon pt-icon-ban-circle pt-intent-danger'> </span>}
					{` ${firstname} ${lastname} (${username})`}
				</h5>
				<p className='pt-text-muted'>
					{university}
				</p>
			</div>
		);
	}
}


export default UserCard;
