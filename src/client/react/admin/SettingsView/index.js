import React from 'react';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import DateFormat from 'dateformat';
import Setting from './Setting';
import ViewError from '../ViewError';


const QuerySettings = gql`
query GetSettings($skip:Int,$limit:Int){
  getSettings(skip:$skip,limit:$limit){
    key
    valueType
    value
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
@autobind
class Settings extends React.Component {
	state = {
		loading: false
	}

	refetchSettings() {
		this.setState({loading: true});
		this.props.QuerySettings.refetch()
			.then(() => {
				this.setState({loading: false});
			})
			.catch(() => {
				this.setState({loading: false});
			});
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
			if (this.loading) {
				this.lastFetch = new Date();
				this.loading = false;
			}

			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				content = (
					<div>
						<div className='view-header'>
							<p>Fetched: {this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
							<Button text='Refresh' iconName='refresh' onClick={this.refetchSettings} loading={this.loading}/>
						</div>
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
				{content}
			</div>
		);
	}
}


export default Settings;
