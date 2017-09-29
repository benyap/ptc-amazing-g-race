import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { gql, graphql, compose } from 'react-apollo';
import { Spinner, Button, Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import DateFormat from 'dateformat';
import { saveState } from '../../../actions/stateActions';
import { getSetting } from '../../../graphql/setting';
import ViewError from '../ViewError';
import UserCard from './UserCard';
import UserProfile from './UserProfile';
import UsersSummary from './UsersSummary';


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
		teamId
	}
}`;

const QueryUsersOptions = {
	name: 'QueryUsers',
	options: {
		variables: { skip: 0, limit: 0 }
	}
}

const QueryPaymentAmountOptions = {
	name: 'QueryPaymentAmount',
	options: {
		variables: { key: 'payment_amount' }
	}
}

@compose(
	graphql(QueryUsers, QueryUsersOptions),
	graphql(getSetting('value'), QueryPaymentAmountOptions),
)
@connect()
@autobind
@HotkeysTarget
class UsersView extends React.Component {
	static propTypes = {
		visible: PropTypes.bool
	}

	state = {
		loading: false,
		refetching: false,
		viewProfile: null,
		filter: '',
		lastFetch: new Date()
	}

	componentDidMount() {
		this.mounted = true;
		this.setState({ loading: false }, () => {
			this.refetchUsers(true);
		});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	refetchUsers(loading = false) {
		if (!this.state.viewProfile) {
			if (this.mounted) this.setState({loading, refetching: true});
			Promise.all([
				this.props.QueryPaymentAmount.refetch(),
				this.props.QueryUsers.refetch()
			])
				.then(() => {
					if (this.mounted) this.setState({loading: false, refetching: false, lastFetch: new Date()});
					this.props.dispatch(saveState());
				})
				.catch(() => {
					if (this.mounted) this.setState({loading: false, refetching: false});
				});
		}
	}

	renderProfile(user) {
		this.setState({ viewProfile: user });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.refetchUsers(false);
		});
	}

	filterUsers(filter) {
		this.setState({filter});
	}

	renderHotkeys() {
		return (
			<Hotkeys>
				<Hotkey
					global={true}
					combo='r'
					label='Refresh'
					onKeyDown={() => { if (this.props.visible) this.refetchUsers(false) }}
				/>
			</Hotkeys>
		);
	}

	render() {
		let content = null;
		let summary = null;
		let { loading, error, listAll } = this.props.QueryUsers;
		let loadingPayment = this.props.QueryPaymentAmount.loading;

		if (loading || loadingPayment || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
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
				summary = (
					<UsersSummary users={listAll} paymentAmount={paymentAmount} 
						filterValue={this.state.filter} onFilterChange={this.filterUsers}/>
				);
				
				content = (
					<div>
						<div className='view-list'>
							{listAll.map((user) => {
								let userCard = (
									<UserCard 
										key={user.email} user={user} 
										paymentAmount={paymentAmount}
										renderProfile={this.renderProfile}/>
								);
								if (this.state.filter.length > 0) {
									let filter = this.state.filter.toLowerCase();
									let matchFirst = user.firstname.toLowerCase().indexOf(filter) >= 0;
									let matchLast = user.lastname.toLowerCase().indexOf(filter) >= 0;
									let matchUser = user.username.toLowerCase().indexOf(filter) >= 0;
									let matchUni = user.university.toLowerCase().indexOf(filter) >= 0;

									if (matchFirst || matchLast || matchUser || matchUni) {
										return userCard;
									}
								}
								else return userCard;
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
					<p className='fetched'>Last fetched:<br/>{DateFormat(new Date(this.state.lastFetch), 'mmm dd yyyy hh:MM:ss TT')}</p>
					<Button text='Refresh' iconName='refresh' onClick={this.refetchUsers} 
						loading={this.state.refetching} disabled={this.state.viewProfile}/>
				</div>
				{summary}
				{content}
			</div>
		);
	}
}


export default UsersView;
