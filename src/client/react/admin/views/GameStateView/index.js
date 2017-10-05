import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { connect } from 'react-redux';
import * as GameState from './gameStates';
import State from './State';
import ViewError from '../../components/ViewError';
import RefreshBar from '../../components/RefreshBar';
import { getPublicSetting } from '../../../../graphql/setting';

import '../../scss/_gamestate-view.scss';


const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: {
		fetchPolicy: 'network-only',
		variables: { key: 'race_state' }
	}
}

@graphql(getPublicSetting('value'), QueryRaceStateOptions)
@connect()
@autobind
class GameStateView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool
	}

	state = {
		loading: false
	}

	render() {
		let content = null;
		let currentState = '...';
		const { loading, error, getSettings } = this.props.QueryRaceState;
		
		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				currentState = this.props.QueryRaceState.getPublicSetting.value;
				content = (
					<div>
						<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom: '0.5rem'}}>
							<h5>Warning</h5>
							Clicking on one of the following states will change the game state.
							The current game state is <code>{currentState}</code>.
						</div>
						<div className='state-list'>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.rego_not_open}/>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.rego_open}/>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.rego_closed}/>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.race}/>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.post_race}/>
							<State currentState={currentState} reload={this.props.QueryRaceState.refetch} state={GameState.closed}/>
						</div>
					</div>
				);
			}
		}

		return (
			<div id='dashboard-state' className='dashboard-tab'>
				<h4>Game State</h4>
				<RefreshBar query={this.props.QueryRaceState} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default GameStateView;
