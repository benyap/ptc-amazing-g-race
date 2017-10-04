import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { Button, Intent, Spinner, Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';
import { saveState } from '../../actions/stateActions';
import NotificationToaster from './NotificationToaster';


@connect()
@autobind
@HotkeysTarget
class RefreshBar extends React.Component {
	static propTypes = {
		query: PropTypes.shape({
			refetch: PropTypes.func.isRequired
		}).isRequired,
		shouldRefresh: PropTypes.bool,
		setLoading: PropTypes.func,
		refetching: PropTypes.bool,
		disabled: PropTypes.any
	}

	state = {
		loading: false,
		lastFetch: new Date()
	}

	_setLoadingState(loading, lastFetch) {
		const options = { loading: loading };
		if (lastFetch) options.lastFetch = lastFetch;
		this.setState(options);
		if (this.props.setLoading) this.props.setLoading(loading);
	}

	componentDidMount() {
		this.refetch(true);
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	refetch(force = false) {
		if (this.props.shouldRefresh || (force === true)) {

			if (this.mounted) this._setLoadingState(true);
	
			this.props.query.refetch()
				.then(() => {
					if (this.mounted) this._setLoadingState(false, new Date());
					this.props.dispatch(saveState());
				})
				.catch((err) => {
					if (this.mounted) this._setLoadingState(false);
					NotificationToaster.show({
						intent: Intent.DANGER,
						message: err.toString()	
					});
				});
		}
	}

	renderHotkeys() {
		return (
			<Hotkeys>
				<Hotkey
					global={true}
					combo='r'
					label='Refresh'
					onKeyDown={this.refetch}
				/>
			</Hotkeys>
		);
	}

	render() {
		const { loading, error } = this.props.query;

		return (
			<div className='view-header'>
				<p className='fetched'>Last fetched:<br/> {DateFormat(new Date(this.state.lastFetch), 'mmm dd yyyy hh:MM:ss TT')}</p>
				<Button text='Refresh' iconName='refresh' onClick={this.refetch} disabled={this.props.disabled}
					loading={loading || this.state.loading || this.props.refetching} />
			</div>
		);
	}
}


export default RefreshBar;