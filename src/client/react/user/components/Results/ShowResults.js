import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { NonIdealState } from '@blueprintjs/core';
import { getTeams } from '../../../../graphql/team';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Winner from './Winner';

import '../../scss/components/_results.scss'


const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		variables: { skip: 0, limit: 0 },
		fetchPolicy: 'cache-and-network'
	}
}

@graphql(getTeams('_id teamName points'), QueryGetTeamsOptions)
@autobind
class ShowResults extends React.Component {
	render() {
		const { getTeams } = this.props.QueryGetTeams;

		if (getTeams) {
			if (getTeams.length) {
				const teamsSorted = [];
				
				getTeams.forEach((team) => {
					teamsSorted.push(team);
				});

				teamsSorted.sort((a, b) => {
					if (a.points > b.points) return -1;
					else if (a.points < b.points) return 1;
					else return 0;
				});
	
				return (
					<div style={{marginTop:'2rem'}}>
						<Winner team={teamsSorted[0]}/>
						<table class='pt-table pt-striped results-table'>
							<thead>
								<tr>
									<th>Rank</th>
									<th>Team</th>
									<th>Score</th>
								</tr>
							</thead>
							<tbody>
								{teamsSorted.map((team, index) => {
									return (
										<tr key={team._id}>
											<td>{index+1}</td>
											<td>
												{team.teamName}
											</td>
											<td>
												{team.points} points
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				);
			}
			else {
				return <NonIdealState title='No teams.' visual='error'/>;
			}
		}
		else if (loading) {
			return <LoadingSpinner hideText/>;
		}
	}
}


export default ShowResults;
