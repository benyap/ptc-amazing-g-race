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
		viewProfile: null
	}

	refetchUsers() {
		if (!this.state.viewProfile) {
			this.setState({loading: true});
			Promise.all([
				this.props.QueryPaymentAmount.refetch(),
				this.props.QueryUsers.refetch()
			])
				.then(() => {
					this.setState({loading: false});
					this.props.dispatch(saveState());
				})
				.catch(() => {
					this.setState({loading: false});
				});
		}
	}

	renderProfile(user) {
		this.setState({ viewProfile: user });
	}

	closeProfile() {
		this.setState({ viewProfile: null });
	}

	render() {
		let content = null;
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
				<div className='view-header'>
					<p className='fetched'>Last fetched:<br/>{this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
					<Button text='Refresh' iconName='refresh' onClick={this.refetchUsers} loading={this.loading} disabled={this.state.viewProfile}/>
				</div>
				{content}
			</div>
		);
	}
}


export default UsersView;
