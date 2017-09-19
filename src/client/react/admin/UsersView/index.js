import React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { gql, graphql, compose } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import DateFormat from 'dateformat';
import { saveState } from '../../../actions/stateActions';
import ViewError from '../ViewError';
import UserCard from './UserCard';
import UserProfile from './UserProfile';
import UserSummary from './UserSummary';


const QueryPaymentAmount = gql`
query GetSetting($key:String!){
  getSetting(key:$key) {
    value
  }
}`;

const QueryPaymentAmountOptions = {
	name: 'QueryPaymentAmount',
	options: {
		variables: {
			key: 'payment_amount'
		}
	}
}

const QueryUsers = gql`
query ListAll($limit:Int, $skip:Int){
  listAll(limit:$limit, skip:$skip) {
    firstname
		lastname
		username
		email
    university
    enabled
    paidAmount
  }
}`;

const QueryUsersOptions = {
	name: 'QueryUsers',
	options: {
			variables: {
				skip: 0,
				limit: 0
		}
	}
}


@compose(
	graphql(QueryUsers, QueryUsersOptions),
	graphql(QueryPaymentAmount, QueryPaymentAmountOptions),
)
@connect()
@autobind
class UsersView extends React.Component {
	state = {
		loading: false,
		refetching: false,
		viewProfile: null
	}

	refetchUsers(refetching = false, loading = true) {
		if (!this.state.viewProfile) {
			this.setState({loading, refetching: refetching?true:false});
			Promise.all([
				this.props.QueryPaymentAmount.refetch(),
				this.props.QueryUsers.refetch()
			])
				.then(() => {
					this.setState({loading: false, refetching: false});
					this.props.dispatch(saveState());
				})
				.catch(() => {
					this.setState({loading: false, refetching: false});
				});
		}
	}

	renderProfile(user) {
		this.setState({ viewProfile: user });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.refetchUsers(true, false);
		});
	}

	render() {
		let content = null;
		let summary = null;
		let { loading, error, listAll } = this.props.QueryUsers;
		let loadingPayment = this.props.QueryPaymentAmount.loading;

		if (loading || loadingPayment || this.state.loading) {
			content = (
				<div>
					<div className='loading-spinner'>
						<Spinner/>
					</div>
				</div>
			);
			this.loading = true;
		}
		else {
			if (this.loading) {
				this.lastFetch = new Date();
				this.loading = false;
			}

			let paymentAmount = parseFloat(this.props.QueryPaymentAmount.getSetting.value);

			if (error) {
				content = <ViewError error={error}/>
			}
			else if (this.state.viewProfile) {
				content = (
					<UserProfile user={this.state.viewProfile} closeProfile={this.closeProfile} paymentAmount={paymentAmount}/>
				);
			}
			else {
				summary = <UserSummary users={listAll} paymentAmount={paymentAmount}/>;
				content = (
					<div>
						<div className='view-list'>
							{listAll.map((user) => {
								return (
									<UserCard 
										key={user.email} user={user} 
										paymentAmount={paymentAmount}
										renderProfile={this.renderProfile}/>
								);
							})}
						</div>
					</div>
				);
			}
		}

		return (
			<div id='dashboard-users' className='dashboard-tab'>
				<h4>Users</h4>
				{summary}
				<div className='view-header'>
					<p className='fetched'>Last fetched:<br/>{this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
					<Button text='Refresh' iconName='refresh' onClick={this.refetchUsers} 
						loading={this.state.refetching&&!this.loading} disabled={this.state.viewProfile||this.loading}/>
				</div>
				{content}
			</div>
		);
	}
}


export default UsersView;
