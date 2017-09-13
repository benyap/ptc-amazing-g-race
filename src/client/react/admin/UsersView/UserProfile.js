import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, EditableText, Spinner, Icon, Intent } from '@blueprintjs/core';
import { gql, graphql } from 'react-apollo';
import DateFormat from 'dateformat';
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


@graphql(QueryUser, QueryUserOptions)
@autobind
class UserProfile extends React.Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		closeProfile: PropTypes.func.isRequired,
		paymentAmount: PropTypes.number.isRequired
	}

	state = {
		mobileNumber: null,
		paidAmount: null,
	}
	
	closeProfile() {
		this.props.closeProfile();
	}

	saveProfile() {

	}

	editMobile(value) {
		this.setState({mobileNumber: value});
	}
	
	confirmMobile(value) {
		if (value.length > 0) {
			const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
			if (regex.exec(value)) {
				// TODO: Save changes
				return;
			}
		}
		this.setState({mobileNumber: this.props.QueryUser.getUserByEmail.mobileNumber});
	}

	editPaid(value) {
		this.setState({paidAmount: value});
	}

	confirmPaid(value) {
		if (value.length > 0) {
			const regex = /^[0-9]+(\.|)[0-9]{0,2}$/;
			if (regex.exec(value)) {
				// TODO: save changes
				return;
			}
		}
		this.setState({paidAmount: this.props.QueryUser.getUserByEmail.paidAmount});		
	}

	render() {
		let { firstname, lastname, email, university } = this.props.user;
		let content;
		let savable;
		
		if (this.props.QueryUser.loading) {
			content = <Spinner className='pt-small'/>
		}
		else {
			let { username, mobileNumber, studentID, registerDate, paidAmount, raceDetails: { PTProficiency, hasSmartphone, friends} } = this.props.QueryUser.getUserByEmail;

			if (!this.state.mobileNumber && !this.state.paidAmount) {
				setTimeout(() => {
					this.setState({mobileNumber, paidAmount});
				}, 0);
			}

			let paidIcon = <Icon iconName='error' intent={Intent.DANGER}/>;
			if (parseFloat(this.state.paidAmount) >= this.props.paymentAmount) {
				paidIcon = <Icon iconName='tick' intent={Intent.SUCCESS}/>;
			}
			
			savable = parseFloat(this.state.paidAmount) !== parseFloat(paidAmount) || 
				parseFloat(this.state.mobileNumber) !== parseFloat(mobileNumber);

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
								<td>
									<EditableText value={this.state.mobileNumber} 
										onChange={this.editMobile} selectAllOnFocus
										onConfirm={this.confirmMobile}/>
								</td>
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
								<td>StudentID</td>
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
				<Button intent={Intent.PRIMARY} disabled={!savable} text='Save' onClick={this.saveProfile} style={{float:'right', marginRight: '0.1rem'}}/>
				<h4><b>{firstname + ' ' + lastname}</b></h4>
				<p className='pt-text-muted'>{university}</p>
				{content}
			</div>
		);
	}
}


export default UserProfile;
