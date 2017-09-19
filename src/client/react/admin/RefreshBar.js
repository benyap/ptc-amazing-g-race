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
		loading: false
	}

	_setLoadingState(loading) {
		this.setState({loading: loading});
		if (this.props.setLoading) this.props.setLoading(loading);
	}

	refetch() {
		this._setLoadingState(true);

		this.props.query.refetch()
			.then(() => {
				this._setLoadingState(false);
				this.props.dispatch(saveState());
			})
			.catch(() => {
				this._setLoadingState(false);
			});
	}

	render() {
		let { loading, error } = this.props.query;
		
		if (loading || this.state.loading) {
			this.loading = true;
		}
		else {
			if (this.loading) {
				this.lastFetch = new Date();
				this.loading = false;
			}
		}

		return (
			<div className='view-header'>
				<p className='fetched'>Last fetched:<br/> {this.lastFetch ? DateFormat(new Date(this.lastFetch), 'mmm dd yyyy hh:MM:ss TT'): null}</p>
				<Button text='Refresh' iconName='refresh' onClick={this.refetch} loading={this.loading}/>
			</div>
		);
	}
}


export default RefreshBar;