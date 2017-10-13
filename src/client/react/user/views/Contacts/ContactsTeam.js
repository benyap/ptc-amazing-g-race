import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { getTeam } from '../../../../graphql/team';
import ContactFromTeam from './ContactFromTeam';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam',
	skip: props => !props.teamId,
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { teamId: props.teamId }
		}
	}
}

@graphql(getTeam('_id members{firstname lastname mobileNumber}'), QueryGetTeamOptions)
class ContactsTeam extends React.Component {
	static propTypes = {
		teamId: PropTypes.string
	}

	render() {
		const { QueryGetTeam } = this.props;
		if (!QueryGetTeam) {
			return (
				<div>
					<h5>Team contacts</h5>
					<div className='pt-callout pt-icon-info-sign'>
						<h5 style={{color:'white'}}>No team</h5>
						You are not in a team at the moment.
					</div>
				</div>
			);
		}
		else {
			if (QueryGetTeam.getTeam) {
				return (
					<div>
						<h5>Team contacts</h5>
						<table className='pt-table pt-striped' style={{width:'100%'}}>
							<tbody>
								{QueryGetTeam.getTeam.members.map((member) => {
									return <ContactFromTeam member={member}/>;
								})}
							</tbody>
						</table>
					</div>
				);
			}
			else {
				return (
					<div>
						<h5>Team contacts</h5>
						<div style={{textAlign:'center',margin:'3rem'}}>
							<Spinner/>
						</div>
					</div>
				);
			}
		}
	}
}


export default ContactsTeam;
