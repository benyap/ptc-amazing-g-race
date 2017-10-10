import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Spinner, EditableText, Switch, Dialog } from '@blueprintjs/core';
import { graphql, compose } from 'react-apollo';
import { 
	getChallenge, 
	deleteChallenge,
	setChallengePublic,
	setChallengeOrder,
	setChallengePassphrase,
	setChallengeTitle,
	setChallengeDescription,
	setChallengeLocked,
	createChallengeItem
} from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import ChallengeItemProfile from './ChallengeItemProfile';

import '../../../user/scss/components/_instruction-panel.scss';
import '../../scss/components/_markdown-preview.scss';


const QueryGetChallengeOptions = {
	name: 'QueryGetChallenge',
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { key: props.challenge.key }
		}
	}
}

@compose(
	graphql(getChallenge('key public order passphrase title description locked teams items{key type order title description}'), QueryGetChallengeOptions),
	graphql(deleteChallenge('ok'), { name: 'MutationDeleteChallenge' }),
	graphql(setChallengePublic('ok'), { name: 'MutationSetChallengePublic' }),
	graphql(setChallengeOrder('ok'), { name: 'MutationSetChallengeOrder' }),
	graphql(setChallengePassphrase('ok'), { name: 'MutationSetChallengePassphrase' }),
	graphql(setChallengeTitle('ok'), { name: 'MutationSetChallengeTitle' }),
	graphql(setChallengeDescription('ok'), { name: 'MutationSetChallengeDescription' }),
	graphql(setChallengeLocked('ok'), { name: 'MutationSetChallengeLocked' }),
	graphql(createChallengeItem('ok'), { name: 'MutationCreateChallengeItem' })
)
@autobind
class ChallengeProfile extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			order: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			public: PropTypes.bool.isRequired,
			locked: PropTypes.bool.isRequired
		}),
		closeProfile: PropTypes.func.isRequired
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	state = {
		saving: false,
		loaded: false,
		modified: false,
		showConfimClose: false,
		showConfirmDelete: false,
		deleteLoading: false,
		deleteError: null,

		editChallengeItem: null,

		showAddItem: false,
		addItemLoading: false,
		addItemError: null,
		addItemKey: '',
		addItemTitle: '',
		addItemOrder: '',
		addItemType: 'phrase',

		key: this.props.challenge.key,
		
		// Edit challenge values
		order: this.props.challenge.order,
		modified_order: false,

		public: this.props.challenge.public,
		modified_public: false,

		locked: this.props.challenge.locked,
		modified_locked: false,

		title: this.props.challenge.title,
		modified_title: false,

		description: '',
		modified_description: false,

		passphrase: '',
		modified_passphrase: false,

		teams: [],

	}

	confirmClose() {
		if (this.state.modified) {
			this.toggleDialog('ConfirmClose')();
		}
		else {
			this.props.closeProfile();
		}
	}

	toggleDialog(key) {
		return () => {
			this.setState((prevState) => {
				return { 
					[`show${key}`]: !prevState[`show${key}`],

					// Reset to dialog defaults
					deleteError: null, 
					addItemError: null,
					addItemKey: '',
					addItemTitle: '',
					addItemOrder: '',
					addItemType: 'phrase'
				}
			});
		}
	}

	async submitDeleteChallenge() {
		this.setState({ deleteLoading: true, deleteError: null, modified: false });
		try {
			await this.props.MutationDeleteChallenge({
				variables: { key: this.props.challenge.key }
			});
			this.setState({ deleteLoading: false, deleteError: null });
			this.props.closeProfile();
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

	_loadValues(challenge) {
		setTimeout(() => {
			if (!this.state.loaded) {
				if (!challenge) this.setState({ loaded: true }); // Prevent this method being called if challenge is null
				else {
					this.setState({
						loaded: true,
						description: challenge.description,
						passphrase: challenge.passphrase,
						teams: challenge.teams
					});
				}
			}
		}, 0);
	}

	handleChange(property) {
		return (value) => { 
			this.setState({
				[property]: value, 
				[`modified_${property}`]: true,
				modified: true
			}); 
		}
	}

	async saveContent() {
		this.setState({ saving: true });
		const promises = [];

		['Order','Passphrase','Title','Description','Public','Locked'].map((property) => {
			if (this.state[`modified_${property.toLowerCase()}`]) {
				const promise = this.props[`MutationSetChallenge${property}`]({
					variables: {
						key: this.props.challenge.key,
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

	editChallengeItem(itemKey) {
		return () => {
			this.setState({editChallengeItem: itemKey});
		}
	}
	
	closeChallengeItem() {
		this.setState({editChallengeItem: null});
	}

	onAddItemValueChange(value) {
		return (e) => {
			this.setState({[value]: e.target.value});
		}
	}

	async submitAddItem() {
		this.setState({addItemLoading: true, addItemError: false});
		try {
			await this.props.MutationCreateChallengeItem({
				variables: { 
					key: this.props.challenge.key,
					itemKey: this.state.addItemKey,
					title: this.state.addItemTitle,
					order: this.state.addItemOrder,
					type: this.state.addItemType
				}
			});
			await this.props.QueryGetChallenge.refetch();
			this.setState({addItemLoading: false, showAddItem: false});
		}
		catch (err) {
			if (this._mounted && this.state.showAddItem) this.setState({ addItemLoading: false, addItemError: err.toString() });
			else {
				this.setState({ addItemLoading: false });
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		const { key, title, locked } = this.props.challenge;
		const { loading, getChallenge } = this.props.QueryGetChallenge;

		let icon = 'pt-icon-lock ';
		
		if (getChallenge ? getChallenge.public : this.props.challenge.public) {
			icon = 'pt-icon-globe ';
		}

		if (getChallenge ? getChallenge.locked : locked) {
			icon += 'pt-intent-danger';
		}

		if (getChallenge) {
			this._loadValues(getChallenge);
		}

		let content;

		if (this.state.deleteLoading) content = (
			<div className='pt-text-muted' style={{margin:'1rem 0'}}>Deleting challenge...</div>
		);
		else if (this.state.editChallengeItem) {
			content = (
				<div>
					<ChallengeItemProfile itemKey={this.state.editChallengeItem} QueryGetChallenge={this.props.QueryGetChallenge}
						challenge={getChallenge} closeItem={this.closeChallengeItem}/>
				</div>
			);
		}
		else {
			try {
				content = (
					<div>
						<div className='pt-callout pt-intent-primary pt-icon-info-sign' style={{margin:'1rem 0'}}>
							<ul style={{margin: '0', padding: '0 0 0 1rem'}}>
								<li>
									The <code>key</code> will not be visible to the user, 
									but the <code>title</code> will be visible - 
									so make sure it doesn't give away anything unintentionally.
								</li>
								<li>
									If the challenge is not <code>public</code>, a team can enter the <code>passphrase</code> to unlock the challenge.
								</li>
								<li>
									<code>Locked</code> challenges are viewable but do not accept responses.
								</li>
							</ul>
						</div>
						<div className='profile-content'>
							<table className='pt-table pt-striped content'>
								<tbody>
									<tr>
										<td>Key</td>
										<td>{this.state.key}</td>
									</tr>
									<tr>
										<td>Order</td>
										<td><EditableText value={this.state.order} onChange={this.handleChange('order')} disabled={loading}/></td>
									</tr>
									<tr>
										<td>Public</td>
										<td><Switch checked={this.state.public} onChange={(e)=>{this.handleChange('public')(e.target.value==='on'!==this.state.public)}} disabled={loading}/></td>
									</tr>
									<tr>
										<td>Locked</td>
										<td><Switch checked={this.state.locked} onChange={(e)=>{this.handleChange('locked')(e.target.value==='on'!==this.state.locked)}} disabled={loading}/></td>
									</tr>
									<tr>
										<td>Passphrase</td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<EditableText value={this.state.passphrase} onChange={this.handleChange('passphrase')}/>
											}
										</td>
									</tr>
									<tr>
										<td>
											Items<br/>
											<Button style={{marginTop: '0.5rem'}} text='Add item' className='pt-small' onClick={this.toggleDialog('AddItem')}/>
										</td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<div>
													{getChallenge.items.map((item) => {
														return (
															<div key={item.key} order={item.order}>
																<a onClick={this.editChallengeItem(item.key)}>{item.title} ({item.key})</a>
															</div>
														)
													}).sort((a, b) => {
														if (a.props.order > b.props.order) return 1;
														else if (a.props.order < b.props.order) return -1;
														else return 0;
													})}
												</div>
											}
										</td>
									</tr>
									<tr>
										<td>Teams with access</td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<ul>
													{getChallenge.teams.map((team) => {
														return <li key={team}>{team}</li>
													})}
												</ul>
											}
										</td>
									</tr>
								</tbody>
							</table>
							<div className='content'>
								<div className='pt-callout pt-intent-primary pt-icon-info-sign'>
									The information below is presented to users if they have access to the challenge.
								</div>
								<div className='instruction-panel markdown-preview'>
									{ loading ? <div className='pt-text-muted' style={{marginTop:'1rem'}}>Loading description content...</div> :
										<MarkdownEditor content={this.state.description} onChange={(e)=>{this.handleChange('description')(e.target.value)}}/>
									}
								</div>
							</div>
						</div>
					</div>
				);
			}
			catch (err) {
				setTimeout(() => {
					NotificationToaster.show({
						intent: Intent.DANGER,
						message: err.toString()
					});
					this.props.closeProfile();
				}, 0);
			}
		}

		return (
			<div className='pt-card challenge-profile'>
				<Button className='pt-minimal' intent={Intent.NONE} iconName='cross' onClick={this.confirmClose} style={{float:'right'}} disabled={this.state.editChallengeItem}/>
				<Button className='pt-minimal' intent={Intent.PRIMARY} iconName='floppy-disk' onClick={this.saveContent} style={{float:'right'}} disabled={!this.state.modified||this.state.saving||this.state.editChallengeItem}/>
				<Button className='pt-minimal' intent={Intent.DANGER} iconName='trash' onClick={this.toggleDialog('ConfirmDelete')} style={{float:'right'}} disabled={this.state.deleteLoading||this.state.editChallengeItem}/>
				{loading || this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h5>
					<span className={`pt-icon ${icon}`}></span>&nbsp;
					Title: <b><EditableText value={this.state.title} onChange={this.handleChange('title')} disabled={this.state.deleteLoading||this.state.editChallengeItem}/></b>
				</h5>

				{content}

				{/* Confirm close dialog */}
				<Dialog isOpen={this.state.showConfirmClose} onClose={this.toggleDialog('ConfirmClose')} title='Unsaved changes'>
					<div className='pt-dialog-body'>
						Are you sure you want to close? Your changes have not been saved yet.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button intent={Intent.DANGER} className='pt-minimal' text='Close' onClick={this.props.closeProfile}/>
							<Button intent={Intent.PRIMARY} text='Cancel' onClick={this.toggleDialog('ConfirmClose')}/>
						</div>
					</div>
				</Dialog>

				{/* Confirm delete dialog */}
				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleDialog('ConfirmDelete')} title='Delete challenge'>
					<div className='pt-dialog-body'>
						{ this.state.deleteError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{ this.state.deleteError }
							</div> 
							: 'Are you sure you want to delete this challenge? This action is irreversible.'
						}
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleDialog('ConfirmDelete')} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteChallenge} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>

				{/* Add item dialog */}
				<Dialog isOpen={this.state.showAddItem} onClose={this.toggleDialog('AddItem')} title='Add challenge item'>
					<div className='pt-dialog-body'>
						{ this.state.addItemError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{ this.state.addItemError }
							</div> 
							: null
						}
						<FormInput id='key' value={this.state.addItemKey} label='Challenge item key' onChange={this.onAddItemValueChange('addItemKey')} disabled={this.state.addItemLoading}/>
						<FormInput id='title' value={this.state.addItemTitle} label='Challenge item title' onChange={this.onAddItemValueChange('addItemTitle')} disabled={this.state.addItemLoading}/>
						<FormInput id='order' value={this.state.addItemOrder} label='Challenge item order' onChange={this.onAddItemValueChange('addItemOrder')} disabled={this.state.addItemLoading}/>
						<label className='pt-label'>
							Challenge item type
							<div className='pt-select pt-fill'>
								<select onChange={this.onAddItemValueChange('addItemType')} disabled={this.state.addItemLoading}>
									<option value='phrase'>Phrase</option>
									<option value='upload'>Upload</option>
								</select>
							</div>
						</label>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleDialog('AddItem')} className='pt-minimal' disabled={this.state.addItemLoading}/>
							<Button text='Add item' onClick={this.submitAddItem} intent={Intent.PRIMARY} loading={this.state.addItemLoading}/>
						</div>
					</div>
				</Dialog>

			</div>
		);
	}
}


export default ChallengeProfile;
