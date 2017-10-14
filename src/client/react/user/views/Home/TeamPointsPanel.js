import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { getTeam } from '../../../../graphql/team'
import { Button, Intent } from '@blueprintjs/core';
import NotificationToaster from '../../../components/NotificationToaster';
import HelpBox from './HelpBox';

import '../../scss/views/_team-panel.scss';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam',
	skip: props => !(props.user && props.user.teamId),
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { teamId: props.user.teamId }
		}
	}
}

@graphql(getTeam('_id teamName points'), QueryGetTeamOptions)
@autobind
class TeamPointsPanel extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			firstname: PropTypes.string.isRequired,
			teamId: PropTypes.string
		}).isRequired
	}

	state = {
		showHelp: false
	}

	async refresh() {
		try {
			if (this.props.QueryGetTeam) 
				this.props.QueryGetTeam.refetch();
		}
		catch(err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		const { QueryGetTeam, user } = this.props;
		let teamName = 'Your Team';
		let teamPoints = (
			<div className='pt-callout pt-intent-danger pt-icon-error'>
				You have not been allocated into a team.
			</div>
		);

		if (QueryGetTeam) {
			if (QueryGetTeam.getTeam) {
				teamName = QueryGetTeam.getTeam.teamName;
				teamPoints = (
					<div className='pt-callout'>
						<div className='points'>
							{QueryGetTeam.getTeam.points} points
						</div>
					</div>
				);
			}
			if (QueryGetTeam.loading) {
				if (QueryGetTeam.getTeam) {
					teamPoints = (
						<div className='pt-callout'>
							<div className='points'>
								<span style={{color:'#888'}}>{QueryGetTeam.getTeam.points} points</span>
							</div>
						</div>
					);
				}
				else {
					teamPoints = (
						<div className='pt-callout' style={{fontSize:'large'}}>
							Getting the latest stats...
						</div>
					);
				}
			}
		}

		return (
			<div id='dashboard-team-panel'>
				<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} loading={QueryGetTeam?QueryGetTeam.loading:false} style={{padding:'0'}}/>
				<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
				<h2>{teamName}</h2>
				<HelpBox showHelp={this.state.showHelp}/>
				<p>Hey {this.props.user.firstname}! Welcome to your team dashboard.</p>
				<div id='dashboard-team-panel'>
					{teamPoints}
				</div>
			</div>
		);
	}
}


export default TeamPointsPanel;
