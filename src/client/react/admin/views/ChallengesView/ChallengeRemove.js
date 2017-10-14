import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, EditableText, Switch, Dialog } from '@blueprintjs/core';
import { graphql, compose } from 'react-apollo';
import { deleteChallenge } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(deleteChallenge('ok'), { name: 'MutationDeleteChallenge' })
@autobind
class ChallengeRemove extends React.Component {
	static propTypes = {
		challengeKey: PropTypes.string.isRequired,
		disabled: PropTypes.bool,
		refetchChallenges: PropTypes.func.isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	state = {
		showConfirmDelete: false,
		deleteLoading: false,
		deleteError: null
	}

	toggleShowConfirmDelete(key) {
		this.setState((prevState) => {
			return { 
				showConfirmDelete: !prevState.showConfirmDelete,
				deleteError: null
			}
		});
	}

	async submitDeleteChallenge() {
		this.setState({ deleteLoading: true, deleteError: null, modified: false });
		try {
			await this.props.MutationDeleteChallenge({
				variables: { key: this.props.challengeKey }
			});
			await this.props.refetchChallenges();
			this.setState({ deleteLoading: false, deleteError: null });
			this.props.closeProfile();
		}
		catch (err) {
			if (this.state.showConfirmDelete) this.setState({ deleteLoading: false, deleteError: err.toString() });
			else {
				this.setState({ deleteLoading: false });
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<span>
				<Button className='pt-minimal' intent={Intent.DANGER} iconName='trash' onClick={this.toggleShowConfirmDelete} disabled={this.state.deleteLoading||this.props.disabled}/>
				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleShowConfirmDelete} title='Delete challenge'>
					<div className='pt-dialog-body'>
						{ this.state.deleteError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{ this.state.deleteError }
							</div> : null
						}
						Are you sure you want to delete this challenge? This action is irreversible.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleShowConfirmDelete} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteChallenge} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>
			</span>
		);
	}
}


export default ChallengeRemove;
