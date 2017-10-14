import React from 'react';
import PropTypes from 'prop-types';


class ContactFromTeam extends React.Component {
	static propTypes = {
		member: PropTypes.shape({
			firstname: PropTypes.string.isRequired,
			lastname: PropTypes.string.isRequired,
			mobileNumber: PropTypes.string.isRequired
		}).isRequired
	}
	render() {
		const { firstname, lastname, mobileNumber } = this.props.member;
		return (
			<tr>
				<td>{firstname} {lastname}</td>
				<td>
					<a href={`tel:${mobileNumber}`}>{mobileNumber}</a>
				</td>
			</tr>
		);
	}
}

export default ContactFromTeam;
