import React from 'react'
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { getResponsesByTeam } from '../../../../graphql/response';
import { getTeam } from '../../../../graphql/team';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam',
	options: (props) => {
		return { 
			variables: { teamId: props.teamId },
			fetchPolicy: 'cache-and-network'
		}
	}
}

const QueryGetResponsesByTeamOptions = {
	name: 'QueryGetResponsesByTeam',
	options: (props) => {
		return { 
			variables: { teamId: props.teamId },
			fetchPolicy: 'cache-and-network'
		}
	}
}

@compose(
	graphql(getTeam('_id points'), QueryGetTeamOptions),
	graphql(getResponsesByTeam('_id challengeKey itemKey checked responseValid'), QueryGetResponsesByTeamOptions)
)
class TeamProgressTable extends React.Component {
	static propTypes = {
		teamId: PropTypes.string.isRequired
	}

	state = {
		completed: null,
		pending: null
	}

	componentDidUpdate(prevProps, prevState) {
		const { getResponsesByTeam } = this.props.QueryGetResponsesByTeam;

		if (!prevState.completed && getResponsesByTeam) {
			const completed = new Set();
			const pending = new Set();

			getResponsesByTeam.forEach((response) => {
				if (response.checked) {
					if (response.responseValid) {
						completed.add(`[${response.challengeKey}] ${response.itemKey}`)
					}
				}
				else {
					pending.add(`[${response.challengeKey}] ${response.itemKey}`)
				}
			});

			this.setState({ completed: [...completed], pending: [...pending] });
		}
	}

	render() {
		const { loading: teamLoading, getTeam } = this.props.QueryGetTeam;

		return (
			<div style={{paddingRight:'0.5rem'}}>
				<h6><b>Team progress</b></h6>
				<table className='pt-table pt-striped'>
					<tbody>
						<tr>
							<td>Current points</td>
							<td>
								{ getTeam ? 
									getTeam.points:
									<span className='pt-text-muted'>Loading...</span>
								}
							</td>
						</tr>
						<tr>
							<td>Completed challenges</td>
							<td>
								<div style={{maxHeight:'15rem',overflow:'scroll'}}>
									{ this.state.completed ? 
										this.state.completed.map((challenge, index) => {
											return <div key={index} style={{whiteSpace:'nowrap'}}>{challenge}</div>;
										}):
										<span className='pt-text-muted'>Loading...</span>
									}
								</div>
							</td>
						</tr>
						<tr>
							<td>Pending challenges</td>
							<td>
								<div style={{maxHeight:'15rem',overflow:'scroll'}}>
									{ this.state.pending ? 
										this.state.pending.map((challenge, index) => {
											return <div key={index} style={{whiteSpace:'nowrap'}}>{challenge}</div>;
										}) :
										<span className='pt-text-muted'>Loading...</span>
									}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default TeamProgressTable;
