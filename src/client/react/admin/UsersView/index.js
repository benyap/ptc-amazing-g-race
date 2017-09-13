import React from 'react';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import DateFormat from 'dateformat';
import ViewError from '../ViewError';
import UserCard from './UserCard';


const QueryUsers = gql`
query ListAll($limit:Int, $skip:Int){
  listAll(limit:$limit, skip:$skip) {
    _id
    firstname
    lastname
    username
    email
    university
    studentID
    mobileNumber
    enabled
    registerDate
    paidAmount
    raceDetails{
      hasSmartphone
      friends
      PTProficiency
    }
    roles
    permissions
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


@graphql(QueryUsers, QueryUsersOptions)
@autobind
class UsersView extends React.Component {
	state = {
		loading: false
	}

	refetchUsers() {
		this.setState({loading: true});
		this.props.QueryUsers.refetch()
			.then(() => {
				this.setState({loading: false});
			})
			.catch(() => {
				this.setState({loading: false});
			});
	}

	render() {
		let content = null;
		let { loading, error, listAll } = this.props.QueryUsers;

		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
			this.loading = true;
		}
		else {
			if (this.loading) {
				this.lastFetch = new Date();
				this.loading = false;
			}
			
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				content = (
					<div className='view-list'>
						{listAll.map((user) => {
							return (
								<UserCard key={user.email} user={user}/>
							);
						})}
					</div>
				);
			}
		}

		return (
			<div id='dashboard-users' className='dashboard-tab'>
				<h4>Users</h4>
				<div className='view-header'>
					<p className='fetched'>Last fetched:<br/>{this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
					<Button text='Refresh' iconName='refresh' onClick={this.refetchUsers} loading={this.loading}/>
				</div>
				{content}
			</div>
		);
	}
}


export default UsersView;
