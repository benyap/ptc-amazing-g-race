import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { graphql, compose } from 'react-apollo';
import { getTeam } from '../../../../graphql/team';
import { removeTeamFromUnlocked } from '../../../../graphql/challenge';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam',
	options: ({teamId}) => {
		return { variables: { teamId } }
	}
}

@compose(
	graphql(getTeam('_id teamName'), QueryGetTeamOptions),
	graphql(removeTeamFromUnlocked('ok'), { name: 'MutationRemoveTeamFromUnlocked' })
)
@autobind
class TeamAccessCard extends React.Component {
	static propTypes  = {
		teamId: PropTypes.string.isRequired,
		challengeKey: PropTypes.string.isRequired,
		refetchChallenges: PropTypes.func.isRequired
	}

	state = {
		showRemoveTeamAccess: false,
		removeTeamAccessLoading: false,
		removeTeamAccessError: null
	}

	toggleRemoveTeamAccess() {
		this.setState((prevState) => {
			return { showRemoveTeamAccess: !prevState.showRemoveTeamAccess, removeTeamAccessError: null };
		});
	}

	async submitRemoveTeamAccess() {
		this.setState({ removeTeamAccessLoading: true, removeTeamAccessError: null });
		try {
			const { teamId, challengeKey, refetchChallenges } = this.props;
			await this.props.MutationRemoveTeamFromUnlocked({
				variables: { key: challengeKey, teamId }
			});
			await refetchChallenges();
			this.setState({ removeTeamAccessLoading: false, showRemoveTeamAccess: false });
		}
		catch (err) {
			this.setState({ removeTeamAccessLoading: false, removeTeamAccessError: err.toString() });
		}
	}

	render() {
		const { loading, getTeam: team } = this.props.QueryGetTeam;

		if (team) {
			return (
				<div>
					<Button iconName='remove' className='pt-small pt-minimal' intent={Intent.DANGER} onClick={this.toggleRemoveTeamAccess}/>
					<span>{team.teamName}</span>

					{/* Remove team Dialog */}
					<Dialog title={'Remove team access'} isOpen={this.state.showRemoveTeamAccess} onClose={this.toggleRemoveTeamAccess}>
						<div className='pt-dialog-body'>
							Are you sure you want to remove {team.teamName}'s access to this challenge?
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button text='Close' onClick={this.toggleRemoveTeamAccess} className='pt-minimal' disabled={this.state.removeTeamAccessLoading}/>
								<Button text='Remove' onClick={this.submitRemoveTeamAccess} intent={Intent.DANGER} loading={this.state.removeTeamAccessLoading}/>
							</div>
						</div>
					</Dialog>
				</div>
			);
		}
		else if (loading) {
			return (
				<div>
					<span className='pt-text-muted'>Loading...</span>
				</div>
			);
		}
		else {
			return (
				<div>
					<span>{this.props.teamId}</span>
					<span className='pt-text-muted'>(Unable to retrieve data from server)</span>
				</div>
			);
		}
	}
}


export default TeamAccessCard;
