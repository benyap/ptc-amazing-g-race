import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { saveState } from '../../../../actions/stateActions';
import { getSettings } from '../../../../graphql/setting';
import Setting from './Setting';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';


const QueryGetSettingsParams = 'key valueType value values modified modifiedBy';

const QueryGetSettingsOptions = {
	name: 'QuerySettings', 
	options: {
		variables: { skip: 0, limit: 0 }
	}
}

@graphql(getSettings(QueryGetSettingsParams), QueryGetSettingsOptions)
@connect()
@autobind
class ServerSettingsView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool
	}

	state = {
		loading: false
	}

	render() {
		let content = null;
		const { loading, error, getSettings } = this.props.QuerySettings;

		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (getSettings) {
			content = (
				<div>
					<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom: '0.5rem'}}>
						<h5>Warning</h5>
						Do not modify these settings unless you know what you are doing.
					</div>
					<div className='view-list'>
						{getSettings.map((setting) => {
							return (
								<Setting key={setting.key} name={setting.key} value={setting.value} values={setting.values} 
									modified={setting.modified} modifiedBy={setting.modifiedBy} valueType={setting.valueType}
									reload={this.props.QuerySettings.refetch}/>
							);
						})}
					</div>
				</div>
			);
		}
		else if (loading) {
			content = <div className='loading-spinner'><Spinner/></div>;
		}

		return (
			<div id='dashboard-settings' className='dashboard-tab'>
				<h4>Server State Settings</h4>
				<RefreshBar query={this.props.QuerySettings} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default ServerSettingsView;
