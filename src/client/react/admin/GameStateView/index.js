import React from 'react';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { saveState } from '../../../actions/stateActions';
import DateFormat from 'dateformat';


const QueryRaceState = gql`
query GetSetting($key:String!){
  getSetting(key:$key){
		value
	}
}`;

const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: {
		variables: {
			key: 'race_state'
		}
	}
}

@graphql(QueryRaceState, QueryRaceStateOptions)
@connect()
@autobind
class GameStateView extends React.Component {
	state = {
		loading: false
	}

	render() {
		let content = null;
		let { loading, error, getSettings } = this.props.QueryRaceState;

		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
			this.loading = true;
		}
		else {
			if (this.loading) {
				this.lastFetch = new Date();
				this.loading = false;
			}

			if (error) {

			}
			else {

			}
		}

		return (
			<div id='dashboard-settings' className='dashboard-tab'>
				<h4>Game State</h4>
				<div className='view-header'>
					<p className='fetched'>Last fetched:<br/> {this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
					<Button text='Refresh' iconName='refresh' onClick={this.refetchSettings} loading={this.loading}/>
				</div>
				{content}
			</div>
		);
	}
}


export default GameStateView;
