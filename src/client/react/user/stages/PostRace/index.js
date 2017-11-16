import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFoundPage from '../../../pages/NotFound';
import AppContainer from '../../../../../../lib/react/components/AppContainer';
import Login from '../../components/Login';
import Results from '../../components/Results';
import PostRaceHome from '../../components/PostRaceHome';
import PostRaceDashboard from '../../components/dashboards/PostRaceDashboard';


class Race extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						
						<Route exact path='/' component={PostRaceHome}/>
						<Route exact path='/login'>
							<Login notAnimated next='/results'/>
						</Route>
						<Route path='/results' component={Results}/>
						<Route path='/dashboard' component={PostRaceDashboard}/>

						<Route component={NotFoundPage}/>

					</Switch>
				</AppContainer>
			</BrowserRouter>

		);
	}
}


export default Race;
