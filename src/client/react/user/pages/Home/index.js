import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner, Button } from '@blueprintjs/core';
import { graphql, withApollo } from 'react-apollo';
import { getUserByEmail } from '../../../../graphql/user';
import { getTeam } from '../../../../graphql/team';
import TeamPanel from './TeamPanel';
import { setTeamInfo } from '../../../../actions/userInfoActions';

import '../../../scss/dashboard/_main.scss'
import '../../../scss/dashboard/_home.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		email: state.auth.login.email,
		teamName: state.userInfo.teamName
	};
}

const QueryGetUserByEmailOptions = {
	name: 'QueryGetUserByEmail',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { email: props.email }
		}
	}
}

const QueryGetTeamParams = '_id teamName points memberCount members{username firstname lastname mobileNumber}';

@connect(mapStateToProps)
@graphql(getUserByEmail('username teamId'), QueryGetUserByEmailOptions)
@withApollo
@autobind
class Home extends React.Component {
	static propTypes = {
		demo: PropTypes.bool
	}
	
	static defaultProps = {
		demo: false
	}

	state = {
		team: null,
		teamLoading: true,
		teamError: null,
		showHelp: false
	}

	componentDidMount() {
		this._mounted = true;

		// Fetch team once user email is loaded
		this.props.QueryGetUserByEmail.refetch()
		.then(() => {
			if (this.props.QueryGetUserByEmail.getUserByEmail) {
				this.refetchTeam(this.props.QueryGetUserByEmail.getUserByEmail.teamId);
			}
		});
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async refetchTeam(teamId) {
		if (!teamId) {
			// Reset team info
			this.props.dispatch(setTeamInfo(null, null, null));
			this.setState({ teamLoading: false });
		}
		else {
			if (this._mounted && !this.state.teamLoading) this.setState({ teamLoading: true });

			try {
				const result = await this.props.client.query({
					query: getTeam(QueryGetTeamParams),
					variables: { teamId },
					fetchPolicy: 'network-only'
				});

				if (this._mounted) this.setState({ team: result.data, teamLoading: false });
				
				// Save team info
				this.props.dispatch(setTeamInfo(
					result.data.getTeam._id, 
					result.data.getTeam.teamName, 
					result.data.getTeam.members
				));
			}
			catch (err) {
				// Reset team info
				this.props.dispatch(setTeamInfo(null, null, null));

				if (this._mounted) this.setState({ teamLoading: false, teamError: err.toString() });
				console.warn(err);
			}
		}
	}

	refresh() {
		const { getUserByEmail } = this.props.QueryGetUserByEmail;
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
		return (
			<main id='home' className='dashboard'>
				<div className='content'>
					<h2>
						{ this.props.teamName ? this.props.teamName : 'Your Team' }
						{ this.state.teamLoading ? <Spinner className='pt-small info-loading'/> : null }
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} disabled={this.state.teamLoading}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							<h5>Welcome to your dashboard.</h5>
							Here you can see an overview of your team's progress
							and any important announcements.
							Open the menu in the top right corner to navigate to other pages.
							<br/>
							<br/>
							Use the refresh button to refresh the data displayed.
							Don't stress about your data usage - 
							each refresh only uses around 1000 bytes, which is 0.1% of 1mb! 
						</div>
						: null
					}
					<TeamPanel team={ this.state.team ? this.state.team.getTeam : null } loading={this.state.teamLoading}/>
					<h5>
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
