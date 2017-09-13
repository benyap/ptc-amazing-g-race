import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button, EditableText, Spinner, Icon, Intent } from '@blueprintjs/core';
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
    raceDetails{ hasSmartphone friends PTProficiency }
    roles permissions
  }
}`;

const QueryUserOptions = {
	name: 'QueryUser',
	options: (props) => ({
		variables: { email: props.user.email }
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
							this.setState({saving: false});
							this.props.dispatch(saveState());
						});
				}
				else {
					this.setState({saving: false, error: result.data.setUserPaidAmount.failureMessage});
				}
			})
			.catch((err) => {
				this.setState({saving: false, error: err.toString()});
			});
	}

	render() {
		let { firstname, lastname, email, university } = this.props.user;
		let content;
		let savingIndicator;
		
		if (this.props.QueryUser.loading) {
			content = <Spinner className='pt-small'/>
		}
		else {
			let { username, mobileNumber, studentID, registerDate, paidAmount, raceDetails: { PTProficiency, hasSmartphone, friends} } = this.props.QueryUser.getUserByEmail;

			if (!this.state.paidAmount) {
				setTimeout(() => {
					this.setState({paidAmount});
				}, 0);
			}

			let paidIcon = <Icon iconName='error' intent={Intent.DANGER}/>;
			if (parseFloat(this.state.paidAmount) >= this.props.paymentAmount) {
				paidIcon = <Icon iconName='tick' intent={Intent.SUCCESS}/>;
			}

			if (this.state.saving) {
				savingIndicator = (
					<div style={{float:'right'}}>
						<Button className='pt-minimal' loading/>
					</div>
				);
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
						</tbody>
					</table>
				</div>
			);
		}

		return (
			<div className='pt-card user-profile'>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
				{savingIndicator}
				<h4><b>{firstname + ' ' + lastname}</b></h4>
				<p className='pt-text-muted'>{university}</p>
				{content}
			</div>
		);
	}
}


export default UserProfile;
