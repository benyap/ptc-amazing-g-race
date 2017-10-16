import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import ResponsesFilter from './ResponsesFilter';
import Search from '../../components/Search';


@autobind
class ResponsesSummary extends React.Component {
	static propTypes = {
		responseCount: PropTypes.number.isRequired,
		responseTotal: PropTypes.number.isRequired,
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
		const { responseCount, responseTotal } = this.props;

		const count = `Showing ${responseCount} out of ${responseTotal} ${responseTotal===1?'response.':'responses.'}`;

		return (
			<div id='responses-summary' className={'pt-callout'}>
				{count}
				<div className='response-summary-controls'>
					<ResponsesFilter value={this.props.filterValue} onChange={this.onFilterChange}/>
					<Search value={this.props.searchValue} onChange={this.onSearchChange}/>
				</div>
			</div>
		);
	}
}


export default ResponsesSummary;
