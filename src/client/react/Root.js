import React from 'react';
import { FocusStyleManager } from "@blueprintjs/core";
import { graphql } from 'react-apollo';
import { LoadingPage, FallbackPage } from './pages';
import { getPublicSetting } from '../graphql/setting';
import AppContainer from '../../../lib/react/components/AppContainer';
import Promotion from './stages/Promotion';
import Registration from './stages/Registration';
import RegistrationClosed from './stages/RegistrationClosed';
import Race from './stages/Race';

import './scss/main.scss';


FocusStyleManager.onlyShowFocusOnTabs();

const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: { variables: { key: 'race_state' } }
}

@graphql(getPublicSetting('value'), QueryRaceStateOptions)
class Root extends React.Component {
	render() {
		if (!this.props.QueryRaceState.loading) {
			switch(this.props.QueryRaceState.getPublicSetting.value) {
				// Render the site according to the state of the race as determined by backend
				case 'rego_not_open': {
					return <Promotion/>;
				}
				case 'rego_open': {
					return <Registration/>;
				}
				case 'rego_closed': {
					return <RegistrationClosed/>;
				}
				case 'race': {
					return <Race/>;
				}
				case 'post_race': {

				}
				case 'closed': {

				}
				default: return null;
			}
		}
		else {
			return <LoadingPage/>;
		}
	}
}


export default Root;
