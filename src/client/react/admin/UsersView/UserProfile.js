import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button, EditableText, Spinner, Icon, Intent, Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import { gql, graphql, compose } from 'react-apollo';
import DateFormat from 'dateformat';
import { saveState } from '../../../actions/stateActions';
import '../../scss/admin/_user-profile.scss';


const QueryUser = gql`
query GetUserByEmail($email:String!) {
  getUserByEmail(email: $email) {
    firstname lastname
    username email
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

const MutationSetUserPaidAmountOptions = {
	name: 'MutationSetUserPaidAmount'
}


@compose(
	graphql(QueryUser, QueryUserOptions),
	graphql(MutationSetUserPaidAmount, MutationSetUserPaidAmountOptions)
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
		error: null
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
		this.setState({ saving: true });

		let variables = {
			username: this.props.QueryUser.getUserByEmail.username,
			amount: this.state.paidAmount
		};

		this.props.MutationSetUserPaidAmount({ variables })
			.then((result) => {
				if (result.data.setUserPaidAmount.ok) {
					this.props.QueryUser.refetch()
						.then(() => {
							this.props.dispatch(saveState());
							if (this._mounted) this.setState({saving: false});
						});
				}
				else {
					if (this._mounted) this.setState({saving: false, error: result.data.setUserPaidAmount.failureMessage});
				}
			})
			.catch((err) => {
				if (this._mounted) this.setState({saving: false, error: err.toString()});
				else console.warn(err);
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

	render() {
		let { firstname, lastname, email, university } = this.props.user;
		let content;
		let showLoadingIndicator = false;
		
		if (this.props.QueryUser.loading) {
			showLoadingIndicator = true;
		}

		if (this.props.QueryUser.getUserByEmail) {
			let { username, mobileNumber, studentID, registerDate, paidAmount, raceDetails: { PTProficiency, hasSmartphone, friends, dietaryRequirements } } = this.props.QueryUser.getUserByEmail;

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
			</div>
		);
	}
}


export default UserProfile;
