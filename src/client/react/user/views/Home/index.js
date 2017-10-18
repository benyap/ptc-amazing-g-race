import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { getUserByEmail } from '../../../../graphql/user';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TeamPointsPanel from './TeamPointsPanel';
import TeamResponsesPanel from './TeamResponsesPanel';

import '../../scss/views/_main.scss'
import '../../scss/views/_home.scss';


const mapStateToProps = (state, ownProps) => {
	return { email: state.auth.login.email };
}

const QueryGetUserOptions = {
	name: 'QueryGetUser',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { email: props.email }
		}
	}
}

@connect(mapStateToProps)
@graphql(getUserByEmail('_id firstname teamId'), QueryGetUserOptions)
@autobind
class Home extends React.Component {
	static propTypes = {
		email: PropTypes.string
	}

	componentDidMount() {
		this.props.QueryGetUser.refetch();
	}
	
	render() {
		const { loading, getUserByEmail: user } = this.props.QueryGetUser;
		let content;

		if (user) {
			content = (
				<div>
					<TeamPointsPanel user={user}/>
					<TeamResponsesPanel user={user}/>
				</div>
			);
		}
		else {
			content = <LoadingSpinner/>;
		}

		return (
			<main id='dashboard-home' className='dashboard'>
				<div className='content'>
					{content}

					<h4>
						See your challenges
					</h4>
					<div className='pt-callout'>
						Go to the challenges page to see how you can earn points!
						Every time you submit something, you do it on behalf of your team.
						Make sure everyone is happy before submitting a response!
						<Link to='/dashboard/challenges' className='pt-button pt-minimal pt-icon-flag pt-fill pt-small pt-intent-primary' style={{marginTop:'0.5rem'}}>
							Take me there!
						</Link>
					</div>

					<h4>
						Check out the newsfeed!
					</h4>
					<div className='pt-callout'>
						Everyone in the Amazing GRace has access to the newsfeed! 
						See what's new, or post some news of your own!
						<Link to='/dashboard/feed' className='pt-button pt-minimal pt-fill pt-small pt-icon-feed pt-intent-primary' style={{marginTop:'0.5rem'}}>
							Show me!
						</Link>
					</div>
				</div>
			</main>
		);
	}
}


export default Home;
