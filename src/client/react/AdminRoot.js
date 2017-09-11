import React from 'react';
import { FocusStyleManager } from "@blueprintjs/core";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LoginPage from './admin/LoginPage';
import DashbaordPage from './admin/DashboardPage';
import { NotFoundPage } from './pages';
import AppContainer from '../../../lib/react/components/AppContainer';
import './scss/admin.scss';


FocusStyleManager.onlyShowFocusOnTabs();

class AdminRoot extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						
						<Route exact path='/admin' component={LoginPage}/>
						<Route exact path='/admin/dashboard' component={DashbaordPage}/>
						
						<Route component={NotFoundPage}/>
						
					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}


export default AdminRoot;
