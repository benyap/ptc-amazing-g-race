import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';


@autobind
class Filters extends React.Component {
	static propTypes = {
		action: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		skip: PropTypes.string.isRequired,
		limit: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		onFilter: PropTypes.func.isRequired,
		loading: PropTypes.bool.isRequired
	}

	render() {
		return (
			<div className='pt-callout'>
				<div className='filters'>
					<FormInput id='username' label='Username' value={this.props.username} onChange={this.props.onChange} disabled={this.props.loading}/>
					<FormInput id='action' label='Action' value={this.props.action} onChange={this.props.onChange} disabled={this.props.loading}/>
					<FormInput id='skip' label='Skip' value={this.props.skip} onChange={this.props.onChange} disabled={this.props.loading}/>
					<FormInput id='limit' label='Limit' value={this.props.limit} onChange={this.props.onChange} disabled={this.props.loading}/>
				</div>
				<Button text='Get logs' iconName='cloud-download' className='pt-fill pt-minimal' onClick={this.props.onFilter} loading={this.props.loading}/>
			</div>
		);
	}
}


export default Filters;
