import React from 'react';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { saveState } from '../../../actions/stateActions';
import DateFormat from 'dateformat';
import Setting from './Setting';
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';


const QuerySettings = gql`
query GetSettings($skip:Int,$limit:Int){
	getSettings(skip:$skip,limit:$limit){
		key
		valueType
		value
		values
		modified
		modifiedBy
	}
}`;

const QuerySettingsOptions = {
	name: 'QuerySettings',
	options: {
			variables: {
				skip: 0,
				limit: 0
		}
	}
}

@graphql(QuerySettings, QuerySettingsOptions)
@connect()
@autobind
class ServerSettingsView extends React.Component {
	state = {
		loading: false
	}

	render() {
		let content = null;
		let { loading, error, getSettings } = this.props.QuerySettings;

		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
			this.loading = true;
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				content = (
					<div>
						<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom: '0.5rem'}}>
							<h5>Warning</h5>
							Do not modify these settings unless you know what you are doing.
						</div>
						<div className='view-list'>
							{getSettings.map((setting) => {
								return <Setting key={setting.key} name={setting.key} value={setting.value} values={setting.values} 
								modified={setting.modified} modifiedBy={setting.modifiedBy} valueType={setting.valueType}/>;
							})}
						</div>
					</div>
				);
			}
		}

		return (
			<div id='dashboard-settings' className='dashboard-tab'>
				<h4>Server State Settings</h4>
				<RefreshBar query={this.props.QuerySettings} setLoading={(loading)=>{this.setState({loading})}}/>
				{content}
			</div>
		);
	}
}


export default ServerSettingsView;
