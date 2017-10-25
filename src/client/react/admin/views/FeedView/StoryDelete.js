import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { deleteStory } from '../../../../graphql/story';


@graphql(deleteStory('ok'), { name: 'MutationDeleteStory' })
@autobind
class StoryDelete extends React.Component {
	static propTypes = {
		storyId: PropTypes.string.isRequired,
		refetch: PropTypes.func.isRequired,
		setDeleting: PropTypes.func.isRequired
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

	async submitDeleteStory() {
		this.props.setDeleting(true);
		this.setState({ deleteLoading: true, deleteError: null });
		try {
			await this.props.MutationDeleteStory({
				variables: { storyId: this.props.storyId }
			});
			this.setState({ deleteLoading: false, showConfirmDelete: false }, async () => {
				this.props.refetch();
			});
		}
		catch (err) {
			this.props.setDeleting(false);
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
				<Button className='pt-minimal pt-small pt-intent-danger' text='Delete' onClick={this.toggleShowConfirmDelete} loading={this.state.deleteLoading}/>

				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleShowConfirmDelete} title='Delete story'>
					<div className='pt-dialog-body'>
						{ this.state.deleteError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{ this.state.deleteError }
							</div> : null
						}
						Are you sure you want to delete this story? This action is irreversible.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Cancel' onClick={this.toggleShowConfirmDelete} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteStory} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>
			</span>
		);
	}
}


export default StoryDelete;
