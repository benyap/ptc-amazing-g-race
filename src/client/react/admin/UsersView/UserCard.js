import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import ScrollAnimation from 'react-animate-on-scroll';
import '../../scss/admin/_user-card.scss';

@autobind
class UserCard extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			firstname: PropTypes.string,
			lastname: PropTypes.string,
			email: PropTypes.string,
			university: PropTypes.string,
			enabled: PropTypes.bool,
			paidAmount: PropTypes.number,
		}),
		paymentAmount: PropTypes.number.isRequired,
		renderProfile: PropTypes.func.isRequired
	}

	openProfile(e) {
		this.props.renderProfile(this.props.user);
	}

	render() {
		let { firstname, lastname, email, university, enabled } = this.props.user;
		let { paymentAmount } = this.props;

		return (
			<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0} duration={0.1}>
				<div className='pt-card pt-elevation-0 pt-interactive user-card' onClick={this.openProfile}>
					<h5>
						{firstname + ' ' + lastname + ' '}
						<span className={'pt-icon ' + (this.props.user.paidAmount >= paymentAmount ? 'pt-icon-tick pt-intent-success' : 'pt-icon-dollar pt-intent-danger') }> </span>
						{enabled ? null : <span className='pt-icon pt-icon-ban-circle pt-intent-danger'> </span>}
					</h5>
					<p className='pt-text-muted'>
						{university}
					</p>
				</div>
			</ScrollAnimation>
		);
	}
}


export default UserCard;
