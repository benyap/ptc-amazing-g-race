import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { compose, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText } from '@blueprintjs/core';
import { getTeam, setTeamName, setTeamPoints } from '../../../../graphql/team';
import NotificationToaster from '../../../components/NotificationToaster';
import TeamMemberList from './TeamMemberList';
import TeamAddUser from './TeamAddUser';
import TeamUser from './TeamUser';
import TeamRemove from './TeamRemove';


const QueryTeamParams = '_id teamName memberCount points';

const QueryTeamOptions = {
	name: 'QueryTeam',
	options: (props) => ({
		variables: { teamId: props.team._id },
		fetchPolicy: 'cache-and-network'
	})
}

@compose(
	graphql(getTeam(QueryTeamParams), QueryTeamOptions),
	graphql(setTeamName('ok failureMessage'), {name: 'MutationSetTeamName'}),
	graphql(setTeamPoints('ok failureMessage'), {name: 'MutationSetTeamPoints'})
)
@autobind
class TeamProfile extends React.Component {
	static propTypes = {
		team: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			teamName: PropTypes.string.isRequired
		}).isRequired,
		closeProfile: PropTypes.func.isRequired,
		refetch: PropTypes.func.isRequired
	}
	
	state = {
		teamName: null,
		teamNameModified: false,
		points: null,
		pointsModified: false,
		saving: false
	}

	async componentDidMount() {
		this._mounted = true;

		// Check if there is data available
		const { getTeam } = this.props.QueryTeam;

		if (this.props.QueryTeam.getTeam) {
			this.setState({ 
				points: getTeam.points,
				teamName: getTeam.teamName
			});
		}

		// Fetch latest data
		try {
			const { data: { getTeam } } = await this.props.QueryTeam.refetch();
			if (getTeam) {
				this.setState({
					points: getTeam.points,
					teamName: getTeam.teamName
				})
			}
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	closeProfile() {
		this.props.closeProfile();
	}

	editPoints(value) {
		this.setState({points: value, pointsModified: true});
	}

	editName(value) {
		this.setState({teamName: value, teamNameModified: true});
	}

	confirmPoints(value) {
		if (value.length > 0 && this.state.pointsModified) {
			const regex = /^[-0-9]+(\.|)[0-9]{0,2}$/;
			if (regex.exec(value)) {
				this.savePoints();
				return;
			}
		}
		this.setState({points: this.props.QueryTeam.getTeam.points});
	}

	confirmName(value) {
		if (value.length > 0 && this.state.teamNameModified) {
			this.saveName();
			return;
		}
		this.setState({teamName: this.props.QueryTeam.getTeam.teamName});
	}

	savePoints() {
		const variables = { 
			teamId: this.props.team._id,
			points: this.state.points 
		};

		// Save points
		this._save(this.props.MutationSetTeamPoints, 'setTeamPoints', variables);
	}

	saveName() {
		const variables = { 
			teamId: this.props.team._id,
			name: this.state.teamName 
		};

		// Save name
		this._save(this.props.MutationSetTeamName, 'setTeamName', variables);
	}

	async _save(mutation, mutationName, variables) {
		this.setState({saving: true});
		
		// Execute mutation
		try {
			const result = await mutation({ variables });
			if (result.data[mutationName].ok) {
				await this.props.QueryTeam.refetch();
				if (this._mounted) this.setState({saving: false, teamNameModified: false, pointsModified: false });
			}
			else {
				if (this._mounted) this.setState({saving: false});
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: result.data[mutationName].failureMessage
				});
			}
		}
		catch (err) {
			if (this._mounted) this.setState({saving: false});
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	render() {
		return (
			<div id='team-profile' className='pt-card team-profile'>
				<Button className='pt-minimal' intent={Intent.NONE} iconName='cross' onClick={this.closeProfile} style={{float:'right'}}/>
				<span style={{float:'right'}}><TeamRemove teamId={this.props.team._id} closeProfile={this.closeProfile} refetch={this.props.refetch}/></span>

				{this.props.QueryTeam.loading || this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }

				<h4><b>
					{
						this.state.teamName ? 
						<EditableText selectAllOnFocus 
							value={this.state.teamName} 
							onChange={this.editName} 
							onConfirm={this.confirmName}/> :
						this.props.team.teamName
					}
					<TeamAddUser teamId={this.props.team._id} refetch={this.props.QueryTeam.refetch}/>
				</b></h4>

				<div className='manage'>
					<div className='manage-item'>
						Team ID: {this.props.team._id}
					</div>
					<div className='manage-item'>
						<span>Points:&nbsp;</span>
						{ this.state.points === null ? 
							<span className='pt-text-muted'>Loading...</span> :
							<EditableText selectAllOnFocus 
								value={this.state.points} 
								onChange={this.editPoints} 
								onConfirm={this.confirmPoints}/>
						}
					</div>
				</div>

				<TeamMemberList teamId={this.props.team._id}/>
			</div>
		);
	}
}


export default TeamProfile;
