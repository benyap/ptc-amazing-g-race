import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import UsersFilter from './UsersFilter';
import Search from '../../components/Search';

import '../../scss/components/_summary-panel.scss';


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
		const { displayPaidCount, displayCount, filterValue, searchValue } = this.props;
		const descriptor = filterValue!=='all' || searchValue ? ' shown ' : ' total ';
		let intent = 'pt-intent-danger';

		if (displayPaidCount === displayCount) intent = 'pt-intent-success';
		
		return (
			<div className={'pt-callout summary-panel ' + intent}>
				{displayPaidCount} out of {displayCount}{descriptor}users have paid.
				<div className='summary-controls'>
					<UsersFilter value={filterValue} onChange={this.onFilterChange}/>
					<Search value={searchValue} onChange={this.onSearchChange}/>
				</div>
			</div>
		);
	}
}


export default UserSummary;
