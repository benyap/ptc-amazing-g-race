import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import FormInput from '../../../../../lib/react/components/forms/FormInput';
import Filter from './Filter';
import Search from './Search';

import '../../scss/admin/_user-summary.scss';


@autobind
class UserSummary extends React.Component {
	static propTypes = {
		displayCount: PropTypes.number.isRequired,
		displayPaidCount: PropTypes.number.isRequired,
		onSearchChange: PropTypes.func.isRequired,
		searchValue: PropTypes.string.isRequired,
		onFilterChange: PropTypes.func.isRequired,
		filterValue: PropTypes.string.isRequired
	}

	onSearchChange(e) {
		this.props.onSearchChange(e.target.value);
	}

	onFilterChange(e) {
		this.props.onFilterChange(e.target.value);
	}

	render() {
		let intent = 'pt-intent-danger';
		if (this.props.displayPaidCount === this.props.displayCount) intent = 'pt-intent-success';
		
		return (
			<div id='user-summary' className={'pt-callout ' + intent}>
				{this.props.displayPaidCount} out of {this.props.displayCount} users have paid.
				<div className='user-summary-controls'>
					<Filter value={this.props.filterValue} onChange={this.onFilterChange}/>
					<Search value={this.props.searchValue} onChange={this.onSearchChange}/>
				</div>
			</div>
		);
	}
}


export default UserSummary;
