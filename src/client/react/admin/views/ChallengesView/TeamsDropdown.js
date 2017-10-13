import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { getTeams } from '../../../../graphql/team';


const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 0 }
	}
}

@graphql(getTeams('_id teamName'), QueryGetTeamsOptions)
@autobind
class TeamsDropdown extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired
	}
	
	onChange(e) {
		this.props.onChange(e.target.value);
	}

	render() {
		const { loading, getTeams: teams, error } = this.props.QueryGetTeams;
		let options;

		if (teams) {
			options = teams.map((team) => {
				return <option key={team._id} value={team._id}>{team.teamName}</option>
			})
		}

		return (
			<div className='pt-select pt-fill'>
				<select onChange={this.onChange} disabled={!teams}>
					{ teams ?
						<option key={'null'} value={null}>Select a team...</option>:
						<option key={'null'} value={null}>Loading teams...</option>
					}
					{options}
				</select>
			</div>
		);
	}
}


export default TeamsDropdown;
