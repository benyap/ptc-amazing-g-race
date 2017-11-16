import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NotFoundPage from '../../../pages/NotFound';
import AppContainer from '../../../../../../lib/react/components/AppContainer';
import LoginRefresher from '../../../components/LoginRefresher';
import Login from '../../components/Login';
import Pay from '../../components/Pay';
import Info from '../../components/Info';
import Home from './Home';
import Register from './Register';
import PreRaceDashboard from '../../components/dashboards/PreRaceDashboard';


const mapStateToProps = (state, ownProps) => {
	return { refresh: state.auth.tokens.refresh };
}

@connect(mapStateToProps)
class Registration extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<LoginRefresher refreshToken={this.props.refresh}/>

					<Switch>
						
						<Route exact path='/' component={Home}/>
						<Route exact path='/register' component={Register}/>
						<Route exact path='/login'>
							<Login next='/info'/>
						</Route>
						<Route exact path='/pay' component={Pay}/>
						<Route exact path='/info' component={Info}/>
						<Route path='/dashboard' component={PreRaceDashboard}/>

						<Route component={NotFoundPage}/>

					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}


export default Registration;
