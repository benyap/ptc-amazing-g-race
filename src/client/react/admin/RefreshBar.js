import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button, Spinner } from '@blueprintjs/core';
import { saveState } from '../../actions/stateActions';


@connect()
@autobind
class RefreshBar extends React.Component {
	static propTypes = {
		query: PropTypes.shape({
			refetch: PropTypes.func.isRequired
		}).isRequired,
		setLoading: PropTypes.func,
	}

	state = {
		loading: false,
		lastFetch: new Date()
	}

	_setLoadingState(loading, lastFetch) {
		let options = { loading: loading };
		if (lastFetch) options.lastFetch = lastFetch;
		this.setState(options);
		if (this.props.setLoading) this.props.setLoading(loading);
	}

	componentDidMount() {
		this.refetch();
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	refetch() {
		if (this.mounted) this._setLoadingState(true);

		this.props.query.refetch()
			.then(() => {
				if (this.mounted) this._setLoadingState(false, new Date());
				this.props.dispatch(saveState());
			})
			.catch(() => {
				if (this.mounted) this._setLoadingState(false);
			});
	}

	render() {
		let { loading, error } = this.props.query;

		return (
			<div className='view-header'>
				<p className='fetched'>Last fetched:<br/> {DateFormat(new Date(this.state.lastFetch), 'mmm dd yyyy hh:MM:ss TT')}</p>
				<Button text='Refresh' iconName='refresh' onClick={this.refetch} loading={loading || this.state.loading}/>
			</div>
		);
	}
}


export default RefreshBar;