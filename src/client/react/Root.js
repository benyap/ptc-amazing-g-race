import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { FocusStyleManager } from "@blueprintjs/core";

import './scss/main.scss';
import AppContainer from '../../../lib/react/components/AppContainer';

import { 
	HomePage, 
	NotFoundPage
} from './pages';

FocusStyleManager.onlyShowFocusOnTabs();


class Root extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						{/* Paths */}
						<Route exact path='/'><Redirect to='/home'/></Route>
						<Route exact path='/home' render={HomePage}/>

						{/* Not found page */}
						<Route component={NotFoundPage}/>
					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}


export default Root;
