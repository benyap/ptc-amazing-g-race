import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Spinner, Button, Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import DateFormat from 'dateformat';
import { saveState } from '../../../actions/stateActions';
import { getSetting } from '../../../graphql/setting';
import { getUsers } from '../../../graphql/user';
import ViewError from '../ViewError';
import UserCard from './UserCard';
import UserProfile from './UserProfile';
import UsersSummary from './UsersSummary';


const QueryUserParams = 'firstname lastname username email university enabled paidAmount teamId isAdmin';

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
	graphql(getUsers(QueryUserParams), QueryUsersOptions),
	graphql(getSetting('value'), QueryPaymentAmountOptions)
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
		displayCount: 0, 
		displayPaidCount: 0,
		search: '',
		filter: 'all',
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

	searchUsers(search) {
		this.setState({search});
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

	_applySearchUser(user) {
		if (this.state.search.length > 0) {
			const search = this.state.search.toLowerCase();
			const matchFirst = user.firstname.toLowerCase().indexOf(search) >= 0;
			const matchLast = user.lastname.toLowerCase().indexOf(search) >= 0;
			const matchUser = user.username.toLowerCase().indexOf(search) >= 0;
			const matchUni = user.university.toLowerCase().indexOf(search) >= 0;

			if (matchFirst || matchLast || matchUser || matchUni) return true;
			else return false;
		}
		else return true;
	}

	_applyFilterUser(user) {
		switch (this.state.filter) {
			case 'admins': {
				return user.isAdmin;
			}
			case 'players': {
				return !user.isAdmin;
			}
			case 'paid': {
				if (this.props.QueryPaymentAmount.getSetting) {
					return user.paidAmount >= parseFloat(this.props.QueryPaymentAmount.getSetting.value);
				}
				else return true;
			}
			case 'notpaid': {
				if (this.props.QueryPaymentAmount.getSetting) {
					return user.paidAmount < parseFloat(this.props.QueryPaymentAmount.getSetting.value);
				}
				else return true;
			}
			case 'noteam': {
				return user.teamId === null;
			}
			case 'all':
			default: return true;
		}
	}

	render() {
		let content = null;
		let summary = null;
		const { loading, error, getUsers } = this.props.QueryUsers;
		const loadingPayment = this.props.QueryPaymentAmount.loading;

		if (loading || loadingPayment || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
			const paymentAmount = parseFloat(this.props.QueryPaymentAmount.getSetting.value);

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
					<UsersSummary 
						displayCount={this.state.displayCount} displayPaidCount={this.state.displayPaidCount}
						searchValue={this.state.search} onSearchChange={this.searchUsers}
						filterValue={this.state.filter} onFilterChange={this.filterUsers}/>
				);
				
				let displayCount = 0;
				let displayPaidCount = 0;

				content = (
					<div>
						<div className='view-list'>
							{getUsers.map((user) => {
								if (this._applyFilterUser(user) && this._applySearchUser(user)) {

									// Count users and paid users
									displayCount++;
									if (user.paidAmount >= paymentAmount) displayPaidCount++;

									return (
										<UserCard key={user.email} user={user} paymentAmount={paymentAmount} renderProfile={this.renderProfile}/>
									);
								}
							})}
						</div>
					</div>
				);

				if (this.state.displayCount !== displayCount || this.state.displayPaidCount !== displayPaidCount) {
					// Update count if it has changed since last render
					setTimeout(() => { this.setState({displayCount, displayPaidCount}) }, 0);
				}
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
