import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Spinner, EditableText, Switch, Dialog } from '@blueprintjs/core';
import { graphql, compose } from 'react-apollo';
import { 
	getChallenge, 
	setChallengePublic,
	setChallengeOrder,
	setChallengePassphrase,
	setChallengeTitle,
	setChallengeDescription,
	setChallengeLocked
} from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';
import ChallengeItemProfile from './ChallengeItemProfile';
import TeamAccessCard from './TeamAccessCard';
import AddTeamAccess from './AddTeamAccess';
import AddChallengeItem from './AddChallengeItem';
import ChallengeRemove from './ChallengeRemove';

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
	graphql(setChallengePublic('ok'), { name: 'MutationSetChallengePublic' }),
	graphql(setChallengeOrder('ok'), { name: 'MutationSetChallengeOrder' }),
	graphql(setChallengePassphrase('ok'), { name: 'MutationSetChallengePassphrase' }),
	graphql(setChallengeTitle('ok'), { name: 'MutationSetChallengeTitle' }),
	graphql(setChallengeDescription('ok'), { name: 'MutationSetChallengeDescription' }),
	graphql(setChallengeLocked('ok'), { name: 'MutationSetChallengeLocked' })
)
@autobind
class ChallengeProfile extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			key: PropTypes.string.isRequired,
			order: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			public: PropTypes.bool.isRequired,
			locked: PropTypes.bool.isRequired
		}),
		refetchChallenges: PropTypes.func.isRequired,
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
		showConfirmClose: false,

		editChallengeItem: null,

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
		modified_passphrase: false
	}

	confirmClose() {
		if (this.state.modified) {
			this.toggleConfirmClose();
		}
		else {
			this.props.closeProfile();
		}
	}

	toggleConfirmClose() {
		this.setState((prevState) => {
			return { showConfirmClose: !prevState.showConfirmClose };
		});
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

		if (this.state.editChallengeItem) {
			content = (
				<div>
					<ChallengeItemProfile itemKey={this.state.editChallengeItem} refetchChallenges={this.props.QueryGetChallenge.refetch}
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
									The <code>title</code> is visible to the user, so make sure it remains cryptic if necessary.
								</li>
								<li>
									A <code>public</code> challenge is available to all teams (the passphrase is not used when it is public).
								</li>
								<li>
									The <code>passphrase</code> can be entered to unlock this challenge if it is <b>not</b> public.
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
										<td>Id</td>
										<td>{this.props.challenge._id}</td>
									</tr>
									<tr>
										<td>Key</td>
										<td>{this.props.challenge.key}</td>
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
										<td>Passphrase<br/><span className='pt-text-muted'>(lowercase only)</span></td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<EditableText value={this.state.passphrase} onChange={this.handleChange('passphrase')}/>
											}
										</td>
									</tr>
									<tr>
										<td>
											Items<br/>
											<AddChallengeItem challengeKey={this.props.challenge.key} refetchChallenges={this.props.QueryGetChallenge.refetch}/>
										</td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<div>
													{getChallenge.items.map((item) => {
														return (
															<div key={item.key} order={item.order}>
																<a onClick={this.editChallengeItem(item.key)}>{item.key}</a>
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
										<td>
											Teams with access<br/>
											<AddTeamAccess challengeKey={this.props.challenge.key} refetchChallenges={this.props.QueryGetChallenge.refetch}/>
										</td>
										<td>
											{ loading ? <span className='pt-text-muted'>Loading...</span> :
												<div>
													{getChallenge.teams.map((teamId) => {
														return <TeamAccessCard key={teamId} teamId={teamId} challengeKey={this.props.challenge.key} refetchChallenges={this.props.QueryGetChallenge.refetch}/>
													})}
												</div>
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
				<span style={{float:'right'}}>
					<ChallengeRemove challengeKey={this.props.challenge.key} disabled={this.state.editChallengeItem?true:false} refetchChallenges={this.props.refetchChallenges} closeProfile={this.props.closeProfile}/>
				</span>
				{loading || this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h5>
					<span className={`pt-icon ${icon}`}></span>&nbsp;
					Title: <b><EditableText value={this.state.title} onChange={this.handleChange('title')} disabled={this.state.editChallengeItem}/></b>
				</h5>

				{content}

				{/* Confirm close dialog */}
				<Dialog isOpen={this.state.showConfirmClose} onClose={this.toggleConfirmClose} title='Unsaved changes'>
					<div className='pt-dialog-body'>
						Are you sure you want to close? Your changes have not been saved yet.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button intent={Intent.DANGER} className='pt-minimal' text='Close' onClick={this.props.closeProfile}/>
							<Button intent={Intent.PRIMARY} text='Cancel' onClick={this.toggleConfirmClose}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ChallengeProfile;
