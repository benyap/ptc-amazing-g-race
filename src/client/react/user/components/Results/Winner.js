import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { getTeam } from '../../../../graphql/team';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { teamId: props.team._id }
		}
	}
}

@graphql(getTeam('_id members{firstname lastname}'), QueryGetTeamOptions)
class Winner extends React.Component {
	static propTypes = {
		team: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			teamName: PropTypes.string.isRequired,
			points: PropTypes.number.isRequired
		}).isRequired
	}
	render() {
		const { teamName, points } = this.props.team;
		const { getTeam } = this.props.QueryGetTeam;

		return (
			<div style={{padding:'1rem',marginBottom:'1.5rem',backgroundColor:'rgba(92,112,128,.15)',borderRadius:'0.3rem'}}>
				<h4 style={{textAlign:'center',color:'white',marginBottom:'1rem'}}>Congratulations to</h4>
				<h2 style={{textAlign:'center'}}>{teamName}</h2>
				<p style={{textAlign:'center'}}>
					with {points} points
				</p>
				<div style={{textAlign:'center',color:'slategray'}}>
					{ getTeam ? 
						getTeam.members.map((member) => {
							return (
								<span key={member.firstname+member.lastname}>
									{`${member.firstname}`}&nbsp;{`${member.lastname}`}  &nbsp;&nbsp;
								</span>
							);
						}) : 
						<div style={{textAlign:'center'}}>
							<Spinner className='pt-small'/>
						</div>
					}
				</div>
			</div>
		);
	}
}


export default Winner;
