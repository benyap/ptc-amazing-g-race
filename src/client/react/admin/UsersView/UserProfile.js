import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button, Dialog, EditableText, Spinner, Icon, Intent, Hotkey, Hotkeys, HotkeysTarget, Toaster, Position } from '@blueprintjs/core';
import { gql, graphql, compose } from 'react-apollo';
import DateFormat from 'dateformat';
import { saveState } from '../../../actions/stateActions';
import NotificationToaster from '../NotificationToaster';
import FormInput from '../../../../../lib/react/components/forms/FormInput';
import '../../scss/admin/_user-profile.scss';


const QueryUser = gql`
query GetUserByEmail($email:String!) {
  getUserByEmail(email: $email) {
    firstname lastname
    username email isAdmin
    university studentID
    mobileNumber enabled
    registerDate paidAmount
    raceDetails{ hasSmartphone friends PTProficiency dietaryRequirements }
    roles permissions
  }
}`;

const QueryUserOptions = {
	name: 'QueryUser',
	options: (props) => ({
		variables: { email: props.user.email },
		fetchPolicy: 'cache-and-network'
	})
}

const MutationSetUserPaidAmount = gql`
mutation SetPaidAmount($username:String!, $amount:Float!){
  setUserPaidAmount(username:$username, amount:$amount){
    ok
    failureMessage
  }
}`;

const MutationAddPermission = gql`
mutation AddPermission($permission:String!, $username:String!){
	addPermission(permission:$permission, username:$username){
		ok
	}
}`;

const MutationRemovePermission = gql`
mutation RemovePermission($permission:String!, $username:String!){
	removePermission(permission:$permission, username:$username){
		ok
	}
}`;

@compose(
	graphql(QueryUser, QueryUserOptions),
	graphql(MutationSetUserPaidAmount, {name: 'MutationSetUserPaidAmount'}),
	graphql(MutationAddPermission, {name: 'MutationAddPermission'}),
	graphql(MutationRemovePermission, {name: 'MutationRemovePermission'})
)
@connect()
@autobind
@HotkeysTarget
class UserProfile extends React.Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		closeProfile: PropTypes.func.isRequired,
		paymentAmount: PropTypes.number.isRequired
	}

	state = {
		paidAmount: null,
		saving: false,
		error: null,
		showAddPermissionDialog: false,
		addPermissionText: '',
		addPermissionLoading: false,
		addPermissionError: null,
		showRemovePermissionDialog: false,
		permissionToRemove: null
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}
	
	closeProfile() {
		this.props.closeProfile();
	}

	editPaid(value) {
		this.setState({paidAmount: value});
	}

	confirmPaid(value) {
		if (value.length > 0) {
			const regex = /^[0-9]+(\.|)[0-9]{0,2}$/;
			if (regex.exec(value)) {
				this.savePaid();
				return;
			}
		}
		this.setState({paidAmount: this.props.QueryUser.getUserByEmail.paidAmount});
	}

	savePaid() {
		this.setState({ saving: true, error: null });

		let variables = {
			username: this.props.QueryUser.getUserByEmail.username,
			amount: this.state.paidAmount
		};

		this.props.MutationSetUserPaidAmount({ variables })
		.then((result) => {
			if (result.data.setUserPaidAmount.ok) {
				this._refetchUser();
			}
			else {
				if (this._mounted) this.setState({saving: false});
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: result.data.setUserPaidAmount.failureMessage
				});
			}
		})
		.catch((err) => {
			if (this._mounted) this.setState({saving: false});
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		});
	}

	_refetchUser() {
		if (this._mounted) this.setState({saving: true});
		this.props.QueryUser.refetch()
		.then(() => {
			this.props.dispatch(saveState());
			if (this._mounted) this.setState({saving: false});
		});
	}

	renderHotkeys() {
		return (
			<Hotkeys>
				<Hotkey
					global={true}
					combo='esc'
					label='Close profile'
					onKeyDown={this.closeProfile}
				/>
			</Hotkeys>
		);
	}

	toggleAddPermission() {
		this._toggleDialog('showAddPermissionDialog', 'addPermissionText', 'addPermissionError');
	}

	toggleRemovePermission(permissionToRemove) {
		return () => {
			this.setState({permissionToRemove})
			this._toggleDialog('showRemovePermissionDialog', 'removePermissionText', 'removePermissionError');
		}
	}

	_toggleDialog(name, text, error) {
		this.setState((prevState) => {
			return { 
				[name]: !prevState[name],
				[text]: '',
				[error]: null
			 };
		});
	}

	addPermissionChange({ target: { value }}) {
		this.setState({addPermissionText: value});
	}
	
	submitAddPermission() {
		this._submitPermissionChange('add', 'Add', this.state.addPermissionText);
	}
	
	submitRemovePermission() {
		this._submitPermissionChange('remove', 'Remove', this.state.permissionToRemove);
	}

	_submitPermissionChange(type, Type, permission) {
		this.setState({[`${type}PermissionLoading`]: true, [`${type}PermissionError`]: null});

		this.props[`Mutation${Type}Permission`]({
			variables: {
				username: this.props.user.username,
				permission: permission
			}
		})
		.then((result) => {
			if (result.data[`${type}Permission`].ok) {
				this.setState({
					[`${type}PermissionLoading`]: false, 
					[`show${Type}PermissionDialog`]: false,
					saving: true
				});
				this._refetchUser();
			}
			else {
				if (this._mounted) {
					this.setState({
						[`${type}PermissionLoading`]: false, 
						[`${type}PermissionError`]: result.data[`${type}Permission`].failureMessage
					});
				}
			}
		})
		.catch((err) => {
			this.setState({
				[`${type}PermissionLoading`]: false, 
				[`${type}PermissionError`]: err.toString()
			});
		});
	}

	render() {
		let { firstname, lastname, email, university } = this.props.user;
		let content;
		let showLoadingIndicator = false;
		
		if (this.props.QueryUser.loading) {
			showLoadingIndicator = true;
		}

		if (this.props.QueryUser.getUserByEmail) {
			let { 
				username, mobileNumber, studentID, isAdmin,
				registerDate, paidAmount, permissions,
				raceDetails: { 
					PTProficiency, hasSmartphone, 
					friends, dietaryRequirements 
				} 
			} = this.props.QueryUser.getUserByEmail;

			if (this.state.paidAmount === null) {
				setTimeout(() => {
					this.setState({paidAmount});
				}, 0);
			}

			let paidIcon = <Icon iconName='error' intent={Intent.DANGER}/>;
			if (parseFloat(this.state.paidAmount) >= this.props.paymentAmount) {
				paidIcon = <Icon iconName='tick' intent={Intent.SUCCESS}/>;
			}

			if (this.state.saving) {
				showLoadingIndicator = true;
			}

			content = (
				<div>
					<table className='pt-table pt-striped'>
						<tbody>
							<tr>
								<td>Username</td>
								<td>{username}</td>
							</tr>
							<tr>
								<td>Email</td>
								<td>{email}</td>
							</tr>
							<tr>
								<td>Mobile</td>
								<td>{mobileNumber}</td>
							</tr>
							<tr>
								<td>Paid {paidIcon}</td>
								<td>
									$<EditableText value={this.state.paidAmount} 
										onChange={this.editPaid} selectAllOnFocus
										onConfirm={this.confirmPaid}/>
								</td>
							</tr>
							<tr>
								<td>Student ID</td>
								<td>{studentID}</td>
							</tr>
							<tr>
								<td>Register date</td>
								<td>{DateFormat(new Date(registerDate), 'mmm dd yyyy hh:MM TT')}</td>
							</tr>
							<tr>
								<td>PT Proficiency</td>
								<td>{PTProficiency}</td>
							</tr>
							<tr>
								<td>Has smartphone</td>
								<td>{hasSmartphone ? 'Yes' : 'No' }</td>
							</tr>
							<tr>
								<td>Friends</td>
								<td>{friends ? friends : 'None'}</td>
							</tr>
							<tr>
								<td>Dietary Requirements</td>
								<td>{dietaryRequirements ? dietaryRequirements : 'None'}</td>
							</tr>
							<tr>
								<td>Admin</td>
								<td><code>{isAdmin ? 'true':'false'}</code></td>
							</tr>
							<tr>
								<td>
									Account Permissions<br/>
									<Button style={{marginTop: '0.5rem'}} onClick={this.toggleAddPermission}
										iconName='add' text='Add permission' className='pt-button pt-icon-add pt-small'/>
								</td>
								<td>
									<ul>
										{ permissions.map((permission, index) => {
												return (
													<li key={index}>
														<Button iconName='remove' className='pt-small pt-minimal' 
															intent={Intent.DANGER} onClick={this.toggleRemovePermission(permission)}
															loading={this.state[permission+'RemoveLoading']}/>
														{permission}
													</li>
												);
										}) }
									</ul>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		}

		return (
			<div className='pt-card user-profile'>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
				{showLoadingIndicator ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h4><b>{firstname + ' ' + lastname}</b></h4>
				<p className='pt-text-muted'>{university}</p>
				{content}

				{/* Add permission dialog */}
				<Dialog title='Add new permission to user' 
					isOpen={this.state.showAddPermissionDialog} onClose={this.toggleAddPermission}>
					<div className='pt-dialog-body'>
						{this.state.addPermissionError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.addPermissionError}
							</div>
							:null}
						<FormInput id='permission' value={this.state.addPermissionText} 
							onChange={this.addPermissionChange}
							label='Permission:' disabled={this.state.addPermissionLoading}
							intent={this.state.addPermissionError?Intent.DANGER:Intent.NONE}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' onClick={this.toggleAddPermission} disabled={this.state.addPermissionLoading}>Cancel</Button>
							<Button className='pt-intent-primary' onClick={this.submitAddPermission} loading={this.state.addPermissionLoading}>Add</Button>
						</div>
					</div>
				</Dialog>

				{/* Remove permission dialog */}
				<Dialog title='Remove user permission' 
					isOpen={this.state.showRemovePermissionDialog} onClose={this.toggleRemovePermission(null)}>
					<div className='pt-dialog-body'>
						{this.state.removePermissionError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.removePermissionError}
							</div>
							:null}
							<p>
								Are you sure yu want to remove the permission <code>{this.state.permissionToRemove}</code> from the user?
							</p>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' onClick={this.toggleRemovePermission(null)} disabled={this.state.removePermissionLoading}>Cancel</Button>
							<Button className='pt-intent-danger' onClick={this.submitRemovePermission} loading={this.state.removePermissionLoading}>Remove</Button>
						</div>
					</div>
				</Dialog>

			</div>
		);
	}
}


export default UserProfile;
