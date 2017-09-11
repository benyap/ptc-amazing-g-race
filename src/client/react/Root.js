import React from 'react';
import { FocusStyleManager } from "@blueprintjs/core";
import { gql, graphql } from 'react-apollo';
import { LoadingPage, FallbackPage } from './pages';
import Promotion from './stages/Promotion';

import './scss/main.scss';
import AppContainer from '../../../lib/react/components/AppContainer';


FocusStyleManager.onlyShowFocusOnTabs();

const QueryRaceState = gql`
query GetPublicSetting($key:String!){
  getPublicSetting(key:$key) {
    value
  }
}`

const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: {
		variables: { key: 'race_state' }
	}
}


@graphql(QueryRaceState, QueryRaceStateOptions)
class Root extends React.Component {
	render() {
		if (!this.props.QueryRaceState.loading) {
			switch(this.props.QueryRaceState.getPublicSetting.value) {
				// Render the site according to the state of the race as determined by backend
				case 'rego_not_open': {
					return <Promotion/>;
				}
				case 'rego_open': {

				}
				case 'rego_closed': {

				}
				case 'pre_race': {

				}
				case 'race': {

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
