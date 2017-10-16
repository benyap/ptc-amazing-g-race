import React from 'react';
import PropTypes from 'prop-types';


class Search extends React.Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired
	}

	render() {
		return (
			<div class='pt-input-group'>
				<span class='pt-icon pt-icon-search'></span>
				<input class='pt-input' type='search' placeholder='Search...' value={this.props.value} onChange={this.props.onChange}/>
			</div>
		);
	}
}


export default Search;
