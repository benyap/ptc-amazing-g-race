import React from 'react';
import { FocusStyleManager } from '@blueprintjs/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from './pages/Loading';
import LoginPage from './admin/LoginPage';
import DashboardPage from './admin/DashboardPage';
import { NotFoundPage } from './pages';
import { loadState } from '../actions/stateActions';
import AppContainer from '../../../lib/react/components/AppContainer';

import './scss/admin.scss';
import '../assets/favicon.ico';


FocusStyleManager.onlyShowFocusOnTabs();

const mapStateToProps = (state) => {
	return { loaded: state.state.loaded }
}

@connect(mapStateToProps)
class AdminRoot extends React.Component {

	componentWillMount() {
		this.props.dispatch(loadState());
	}

	render() {
		if (!this.props.loaded) {
			return <Loading/>;
		}
		else {
			return (
				<BrowserRouter>
					<AppContainer>
						<Switch>
							
							<Route exact path='/admin' component={LoginPage}/>
							<Route exact path='/admin/dashboard' component={DashboardPage}/>
							<Route path='/admin/dashboard/:view' component={DashboardPage}/>
							
							<Route component={NotFoundPage}/>
							
						</Switch>
					</AppContainer>
				</BrowserRouter>
			);
		}
	}
}


export default AdminRoot;
