import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import PostRaceMenu from '../../components/PostRaceMenu';
import TeamDashboard from '../../views/TeamDashboard';
import Feed from '../../views/Feed';
import NotFound from '../../views/NotFound';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/login',
				state: { next: '/dashboard' }
			}}/>;
		}

		const { url } = this.props.match;

		return (
			<div className='pt-dark'>
				<Base/>
				<PostRaceMenu/>
				<Switch>
					<Route exact path={`${url}`}>
						<TeamDashboard hideChallenges/>
					</Route>
					<Route exact path={`${url}/feed`} component={Feed}/>
					<Route component={NotFound}/>
			</Switch>
			</div>
		);
	}
}


export default Dashboard;
