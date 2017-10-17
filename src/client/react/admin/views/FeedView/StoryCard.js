import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import Story from '../../../components/Story';


@autobind
class StoryCard extends React.Component {
	static propTypes = {
		story: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			createdBy: PropTypes.string.isRequired,
			published: PropTypes.bool.isRequired,
			iconName: PropTypes.string.isRequired,
			intent: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
			likes: PropTypes.array.isRequired,
		}),
		renderProfile: PropTypes.func.isRequired
	}

	openProfile(e) {
		this.props.renderProfile(this.props.story);
	}

	render() {
		const { _id, type, createdBy, published, iconName, intent, content, likes } = this.props.story;

		return (
			<div className='pt-card pt-elevation-0 pt-interactive'>
				<div className='story-preview-container markdown-preview'>
					<Story story={this.props.story}/>
				</div>

				<div style={{marginTop:'0.2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
					<div className='pt-text-muted'>
						{published ? 'Published' : 'Not published'}
					</div>
					<div>
						<Button className='pt-minimal pt-small pt-intent-primary' text={published?'Unpublish':'Publish'}/>
						<Button className='pt-minimal pt-small pt-intent-primary' text='Edit'/>
						<Button className='pt-minimal pt-small pt-intent-danger' text='Delete'/>
					</div>
				</div>

			</div>
		);
	}
}


export default StoryCard;
