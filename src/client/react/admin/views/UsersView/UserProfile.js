import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql, compose } from 'react-apollo';
import { Button, EditableText, Spinner, Icon, Intent, Hotkey, Hotkeys, HotkeysTarget, Toaster, Position } from '@blueprintjs/core';
import { getUserByEmail, setUserPaidAmount, addPermission, removePermission } from '../../../../graphql/user';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import NotificationToaster from '../../../components/NotificationToaster';
import UserAddPermission from './UserAddPermission';
import UserPermissionCard from './UserPermissionCard';


const QueryUserParams = 
	'firstname lastname username email isAdmin university studentID ' + 
	'mobileNumber enabled registerDate paidAmount roles permissions ' + 
	'raceDetails{hasSmartphone friends PTProficiency dietaryRequirements}';

const QueryUserOptions = {
	name: 'QueryUser',
	options: (props) => ({
		variables: { email: props.user.email },
		fetchPolicy: 'cache-and-network'
	})
}

@compose(
	graphql(getUserByEmail(QueryUserParams), QueryUserOptions),
	graphql(setUserPaidAmount('ok failureMessage'), {name: 'MutationSetUserPaidAmount'}),
	graphql(addPermission('ok'), {name: 'MutationAddPermission'}),
	graphql(removePermission('ok'), {name: 'MutationRemovePermission'})
)
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
		saving: false
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

	async savePaid() {
		this.setState({ saving: true });

		const variables = {
			username: this.props.QueryUser.getUserByEmail.username,
			amount: this.state.paidAmount
		};

		try {
			const result = await this.props.MutationSetUserPaidAmount({ variables });
			await this.props.QueryUser.refetch();
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}

		if (this._mounted) this.setState({saving: false});
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

	render() {
		const { firstname, lastname, email, university } = this.props.user;
		let content;
		let showLoadingIndicator = false;
		
		if (this.props.QueryUser.loading) {
			showLoadingIndicator = true;
		}

		if (this.props.QueryUser.getUserByEmail) {
			const { 
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
									<UserAddPermission username={this.props.user.username} refetch={this.props.QueryUser.refetch}/>
								</td>
								<td>
									<ul>
										{ permissions.map((permission, index) => {
												return <UserPermissionCard key={index} username={this.props.user.username} permission={permission} refetch={this.props.QueryUser.refetch}/>;
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
				<Button className='pt-minimal' intent={Intent.NONE} iconName='cross' onClick={this.closeProfile} style={{float:'right'}}/>
				{showLoadingIndicator ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h4><b>{firstname + ' ' + lastname}</b></h4>
				<p className='pt-text-muted'>{university}</p>
				{content}
			</div>
		);
	}
}


export default UserProfile;
