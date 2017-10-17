import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, NonIdealState } from '@blueprintjs/core';
import Story from '../../../components/Story';


@autobind
class StoryList extends React.Component {
	static propTypes = {
		stories: PropTypes.arrayOf(
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
				type: PropTypes.string.isRequired,
				createdBy: PropTypes.string.isRequired,
				publishDate: PropTypes.string.isRequired,
				iconName: PropTypes.string.isRequired,
				intent: PropTypes.string.isRequired,
				content: PropTypes.string.isRequired,
				likes: PropTypes.array.isRequired
			})
		).isRequired
	}

	render() {
		return (
			<div>
				{this.props.stories.map((story) => {
					return <Story key={story._id} story={story}/>;
				})}
			</div>
		);
	}
}


export default StoryList;
