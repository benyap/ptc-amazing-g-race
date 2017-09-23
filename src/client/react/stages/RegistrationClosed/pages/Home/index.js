import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Spinner, Button } from '@blueprintjs/core';
import { gql, graphql, withApollo } from 'react-apollo';
import TeamPanel from './TeamPanel';
import { saveTeamInfo } from '../../../../../actions/userInfoActions';

import '../../../../scss/dashboard/_main.scss'
import '../../../../scss/dashboard/_home.scss';


const QueryGetUserByEmail = gql`
query GetUserByEmail($email:String!) {
	getUserByEmail(email:$email) {
		username
		teamId
  }
}`;

const QueryGetUserByEmailOptions = {
	name: 'QueryGetUserByEmail'
}

const QueryGetTeam = gql`
query GetTeam($teamId: ID!){
	getTeam(teamId: $teamId){
		_id
		teamName
		points
		memberCount
		members {
			username
			firstname
			lastname
			mobileNumber
		}
	}
}`;

const mapStateToProps = (state, ownProps) => {
	return { email: state.auth.login.email };
}

@connect(mapStateToProps)
@graphql(QueryGetUserByEmail, QueryGetUserByEmailOptions)
@withApollo
@autobind
class Home extends React.Component {
	state = {
		team: null,
		teamLoading: false,
		teamError: null,
		showHelp: false
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	refetchTeam(teamId) {
		setTimeout(() => { if (this._mounted) this.setState({ teamLoading: true }) }, 0);
		this.props.client.query({
			query: QueryGetTeam,
			variables: { teamId },
			fetchPolicy: 'network-only'
		})
		.then((result) => {
			if (this._mounted) this.setState({ team: result.data, teamLoading: false });
			this.props.dispatch(saveTeamInfo(result.data.getTeam._id, result.data.getTeam.members));
		})
		.catch((err) => {
			if (this._mounted) this.setState({ teamLoading: false, teamError: err.toString() });
			console.warn(err);
		});
	}

	refresh() {
		let { getUserByEmail } = this.props.QueryGetUserByEmail;
		if (getUserByEmail) {
			this.refetchTeam(getUserByEmail.teamId);
		}
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		let { loading, getUserByEmail } = this.props.QueryGetUserByEmail;
		
		if (getUserByEmail && getUserByEmail.teamId && !this.state.team && !this.state.teamLoading) {
			this.refetchTeam(getUserByEmail.teamId);
		}

		let teamName = this.state.team ? this.state.team.getTeam.teamName : null;

		return (
			<main id='home' className='dashboard'>
				<div className='content'>
					<h2 style={{color: 'white'}}>
						{ teamName ? teamName : 'Your Team' }
						{ this.state.teamLoading ? <Spinner className='pt-small team-loading'/> : null }
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} disabled={this.state.teamLoading}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							<h5>Welcome to your dashboard.</h5>
							Here you can see an overview of your team's progress
							and any important announcements.
							Use the cog in the top right corner to navigate to other pages.
							<br/>
							<br/>
							Use the refresh button to refresh the data displayed.
							Each refresh uses less than 500 bytes, which is 0.05% of 1mb! 
						</div>
						: null
					}
					<TeamPanel team={ this.state.team ? this.state.team.getTeam : null } loading={this.state.teamLoading}/>
					<h5 style={{color: 'white'}}>
						Important contacts
					</h5>
					<p>
						Go to the <Link to='/dashboard/help'>help page</Link> for important contact details.
					</p>
				</div>
			</main>
		);
	}
}


export default Home;
