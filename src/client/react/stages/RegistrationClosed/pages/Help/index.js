import React from 'react';
import { connect } from 'react-redux';

import '../../../../scss/dashboard/_main.scss'
import '../../../../scss/dashboard/_help.scss';


const mapStateToProps = (state, ownProps) => {
	return { members: state.userInfo.teamMembers };
}

@connect(mapStateToProps)
class Help extends React.Component {
	render() {
		let memberContacts = null;
		if (this.props.members) {
			memberContacts = this.props.members.map((member) => {
				return (
					<tr key={member.username}>
						<td>{`${member.firstname} ${member.lastname}`}</td>
						<td><a href={`tel:${member.mobileNumber}`}>{member.mobileNumber}</a></td>
					</tr>
				);
			});
		}

		return (
			<main id='help' className='dashboard'>
				<div className='content'>
					<h2>
						Help
					</h2>
					<div className='pt-callout pt-icon-info-sign'>
						This page contains important contacts for you on the day.
						Please note that pressing a phone number will CALL that number if you are viewing on mobile.
					</div>

					<h5>Emergency contacts</h5>
					<table className='pt-table pt-striped contacts'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Mobile</th>
							</tr>
						</thead>
						<tbody>
								{/* 
								TODO: Add contact numbers of important people here
								 */}
							<tr>
								<td>Emergency</td>
								<td><a href={`tel:000`}>000</a></td>
							</tr>
							<tr>
								<td>Event coordinator</td>
								<td><a href={`tel:`}></a></td>
							</tr>
						</tbody>
					</table>
					<br/>

					<h5>Team contacts</h5>
					<table className='pt-table pt-striped contacts'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Mobile</th>
							</tr>
						</thead>
						<tbody>
							{ memberContacts }
						</tbody>
					</table>
				</div>
			</main>
		);
	}
}


export default Help;
