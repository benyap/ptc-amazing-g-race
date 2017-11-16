import React from 'react';
import { FocusStyleManager } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { loadState } from '../actions/stateActions';
import LoadingPage from './pages/Loading';
import { getPublicSetting } from '../graphql/setting';
import AppContainer from '../../../lib/react/components/AppContainer';
import Promotion from './user/stages/Promotion';
import Registration from './user/stages/Registration';
import RegistrationClosed from './user/stages/RegistrationClosed';
import Race from './user/stages/Race';
import PostRace from './user/stages/PostRace';

import './scss/main.scss';
import '../assets/favicon.ico';


FocusStyleManager.onlyShowFocusOnTabs();

const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: { variables: { key: 'race_state' } }
}

const mapStateToProps = (state) => {
	return { loaded: state.state.loaded }
}

@connect(mapStateToProps)
@graphql(getPublicSetting('value'), QueryRaceStateOptions)
class Root extends React.Component {

	componentWillMount() {
		this.props.dispatch(loadState());
	}

	render() {
		if (!this.props.QueryRaceState.loading && this.props.loaded) {
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
					return <PostRace showResults={false}/>;
				}
				case 'closed': {
					return <PostRace showResults/>;
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
