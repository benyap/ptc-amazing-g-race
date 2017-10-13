import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Spinner, EditableText, Dialog } from '@blueprintjs/core';
import { graphql, compose } from 'react-apollo';
import { setChallengeItemOrder, setChallengeItemTitle, setChallengeItemDescription, deleteChallengeItem } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';


@compose(
	graphql(setChallengeItemOrder('ok'), { name: 'MutationSetChallengeItemOrder' }),
	graphql(setChallengeItemTitle('ok'), { name: 'MutationSetChallengeItemTitle' }),
	graphql(setChallengeItemDescription('ok'), { name: 'MutationSetChallengeItemDescription' }),
	graphql(deleteChallengeItem('ok'), { name: 'MutationDeleteChallengeItem' })
)
@autobind
class ChallengeItemProfile extends React.Component {
	static propTypes  = {
		itemKey: PropTypes.string.isRequired,
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			items: PropTypes.arrayOf(PropTypes.shape({
				key: PropTypes.string.isRequired,
				order: PropTypes.number.isRequired,
				title: PropTypes.string.isRequired,
				description: PropTypes.string.isRequired,
				type: PropTypes.oneOf([
					'upload', 'phrase'
				]),
			})).isRequired
		}),
		closeItem: PropTypes.func.isRequired,
		QueryGetChallenge: PropTypes.shape({
			refetch: PropTypes.func.isRequired
		}).isRequired
	}

	state = {
		saving: false,
		deleteLoading: false,
		showConfimClose: false,
		showConfirmDelete: false,
		deleteLoading: false,
		deleteError: null,
		modified: false,
		challengeItem: null,

		order: '',
		modified_order: false,

		title: '',
		modified_title: false,

		description: '',
		modified_description: false
	}

	componentDidMount() {
		if (this.state.challengeItem === null) {
			this.props.challenge.items.forEach((item) => {
				if (item.key === this.props.itemKey) {
					this.setState({
						challengeItem: item,
						order: item.order,
						title: item.title,
						description: item.description
					});
				}
			});
		}
	}

	closeItem() {
		if (this.state.modified) {
			this.toggleDialog('ConfirmClose')();
		}
		else {
			this.props.closeItem();
		}
	}

	toggleDialog(key) {
		return () => {
			this.setState((prevState) => {
				return { [`show${key}`]: !prevState[`show${key}`], deleteError: null }
			});
		}
	}

	handleTitleChange(value) {
		this.setState({title: value, modified: true, modified_title: true});
	}

	handleOrderChange(value) {
		this.setState({order: value, modified: true, modified_order: true});
	}

	handleDescriptionChange(e) {
		this.setState({description: e.target.value, modified: true, modified_description: true});
	}

	async saveContent() {
		this.setState({ saving: true });
		const promises = [];
		
		['Order', 'Title', 'Description'].map((property) => {
			if (this.state[`modified_${property.toLowerCase()}`]) {
				const promise = this.props[`MutationSetChallengeItem${property}`]({
					variables: {
						key: this.props.challenge.key,
						itemKey: this.props.itemKey,
						value: this.state[property.toLowerCase()]
					}
				})
				.then(() => {
					this.setState({ [`modified_${property.toLowerCase()}`]: false });
				});
				promises.push(promise);
			}
		});

		try {
			// Wait till all values have been saved
			await Promise.all(promises);
			await this.props.QueryGetChallenge.refetch();
			this.setState({saving: false, modified: false});
		}
		catch (err) {
			this.setState({saving: false});
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	async submitDeleteChallengeItem() {
		this.setState({ deleteLoading: true, deleteError: null, modified: false });
		try {
			await this.props.MutationDeleteChallengeItem({
				variables: { key: this.props.challenge.key, itemKey: this.props.itemKey }
			});
			await this.props.QueryGetChallenge.refetch();
			this.setState({ deleteLoading: false, deleteError: null });
			this.props.closeItem();
		}
		catch (err) {
			if (this._mounted && this.state.showConfirmDelete) this.setState({ deleteLoading: false, deleteError: err.toString() });
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
			<div className='challenge-item-profile'>
				<Button className='pt-minimal' intent={Intent.NONE} iconName='cross' onClick={this.closeItem} style={{float:'right'}}/>
				<Button className='pt-minimal' intent={Intent.PRIMARY} iconName='floppy-disk' onClick={this.saveContent} style={{float:'right'}} disabled={!this.state.modified||this.state.saving}/>
				<Button className='pt-minimal' intent={Intent.DANGER} iconName='trash' onClick={this.toggleDialog('ConfirmDelete')} style={{float:'right'}} disabled={this.state.deleteLoading}/>
				{this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h5>Editing challenge item</h5>
				<table className='pt-table pt-striped content'>
					<tbody>
						<tr>
							<td>Key</td>
							<td>{this.state.challengeItem ? this.state.challengeItem.key: <span className='pt-text-muted'>Loading...</span>}</td>
						</tr>
						<tr>
							<td>Type</td>
							<td>{this.state.challengeItem ? this.state.challengeItem.type: <span className='pt-text-muted'>Loading...</span>}</td>
							</tr>
						<tr>
							<td>Order</td>
							<td><EditableText value={this.state.order} onChange={this.handleOrderChange}/></td>
						</tr>
						<tr>
							<td>Title</td>
							<td><EditableText value={this.state.title} onChange={this.handleTitleChange}/></td>
						</tr>
					</tbody>
				</table>
				<div className='instruction-panel markdown-preview'>
					<MarkdownEditor content={this.state.description} onChange={this.handleDescriptionChange}/>
				</div>

				{/* Confirm close dialog */}
				<Dialog isOpen={this.state.showConfirmClose} onClose={this.toggleDialog('ConfirmClose')} title='Unsaved changes'>
					<div className='pt-dialog-body'>
						Are you sure you want to close? Your changes have not been saved yet.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button intent={Intent.DANGER} className='pt-minimal' text='Close' onClick={this.props.closeItem}/>
							<Button intent={Intent.PRIMARY} text='Cancel' onClick={this.toggleDialog('ConfirmClose')}/>
						</div>
					</div>
				</Dialog>

				{/* Confirm delete dialog */}
				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleDialog('ConfirmDelete')} title='Delete challenge item'>
					<div className='pt-dialog-body'>
						{ this.state.deleteError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{ this.state.deleteError }
							</div> 
							: 'Are you sure you want to delete this challenge item? This action is irreversible.'
						}
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleDialog('ConfirmDelete')} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteChallengeItem} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ChallengeItemProfile;
