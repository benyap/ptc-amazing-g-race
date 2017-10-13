import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { getTeams } from '../../../../graphql/team';
import { addTeamToUnlocked } from '../../../../graphql/challenge';
import DropdownTeams from './DropdownTeams';


const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 0 }
	}
}

@graphql(addTeamToUnlocked('ok'), { name: 'MutationAddTeamToUnlocked' })
@autobind
class ButtonAddTeamAccess extends React.Component {
	static propTypes = {
		challengeKey: PropTypes.string.isRequired,
		refetch: PropTypes.func.isRequired
	}

	state = {
		showAddTeam: false,
		addTeamLoading: false,
		addTeamError: null,
		addTeamId: null
	}

	modifyTeamSelected(teamId) {
		this.setState({ addTeamId: teamId });
	}

	toggleAddTeamDialog() {
		this.setState((prevState) => {
			return { showAddTeam: !prevState.showAddTeam, addTeamId: null };
		});
	}

	async submitAddTeamAccess() {
		this.setState({ addTeamLoading: true, addTeamError: null });
		try {
			await this.props.MutationAddTeamToUnlocked({
				variables: { key: this.props.challengeKey, teamId: this.state.addTeamId }
			});
			await this.props.refetch();
			this.setState({ addTeamLoading: false, showAddTeam: false });
		}
		catch (err) {
			this.setState({ addTeamLoading: false, addTeamError: err.toString() });
		}
	}


	render() {
		return (
			<div style={{marginTop: '0.5rem'}} >
				<Button text='Add team' className='pt-small' onClick={this.toggleAddTeamDialog}/>
				<Dialog title={'Add team access'} isOpen={this.state.showAddTeam} onClose={this.toggleAddTeamDialog}>
					<div className='pt-dialog-body'>
						{ this.state.addTeamError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{ this.state.addTeamError }
							</div> 
							: null
						}
						<p>
							Team to give access to this challenge:
						</p>
						<DropdownTeams onChange={this.modifyTeamSelected}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleAddTeamDialog} className='pt-minimal' disabled={this.state.addTeamLoading}/>
							<Button text='Give team access' onClick={this.submitAddTeamAccess} intent={Intent.PRIMARY} loading={this.state.addTeamLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ButtonAddTeamAccess;
