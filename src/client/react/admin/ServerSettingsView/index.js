import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { saveState } from '../../../actions/stateActions';
import DateFormat from 'dateformat';
import { getSettings } from '../../../graphql/setting';
import Setting from './Setting';
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';


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
		visible: PropTypes.bool
	}

	state = {
		loading: false
	}

	render() {
		let content = null;
		const { loading, error, getSettings } = this.props.QuerySettings;

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
		}

		return (
			<div id='dashboard-settings' className='dashboard-tab'>
				<h4>Server State Settings</h4>
				<RefreshBar query={this.props.QuerySettings} visible={this.props.visible}/>
				{content}
			</div>
		);
	}
}


export default ServerSettingsView;
