import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import FeedFilter from './FeedFilter';
import Search from '../../components/Search';

import '../../scss/components/_summary-panel.scss';


@autobind
class ResponsesSummary extends React.Component {
	static propTypes = {
		storyCount: PropTypes.number.isRequired,
		storyTotal: PropTypes.number.isRequired,
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
		const { storyCount, storyTotal } = this.props;

		const count = `Showing ${storyCount} out of ${storyTotal} ${storyTotal===1?'story.':'stories.'}`;

		return (
			<div className='pt-callout summary-panel'>
				{count}
				<div className='summary-controls'>
					<FeedFilter value={this.props.filterValue} onChange={this.onFilterChange}/>
					<Search value={this.props.searchValue} onChange={this.onSearchChange}/>
				</div>
			</div>
		);
	}
}


export default ResponsesSummary;
