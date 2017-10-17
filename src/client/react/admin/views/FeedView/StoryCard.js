import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import NotificationToaster from '../../../components/NotificationToaster';
import Story from '../../../components/Story';
import { setStoryPublished } from '../../../../graphql/story';


@graphql(setStoryPublished('ok'), { name: 'MutationSetStoryPublished' })
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
		setPublishing: PropTypes.func.isRequired,
		publishing: PropTypes.bool.isRequired,
		refetch: PropTypes.func.isRequired
	}

	state = {
		publishing: false
	}

	openProfile(e) {
		this.props.renderProfile(this.props.story);
	}

	_setPublishing(publishing) {
		this.setState({publishing});
		this.props.setPublishing(publishing);
	}

	async togglePublish() {
		this._setPublishing(true);
		try {
			await this.props.MutationSetStoryPublished({
				variables: {
					storyId: this.props.story._id,
					publish: !this.props.story.published
				}
			});
			await this.props.refetch();
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
		this._setPublishing(false);
	}

	render() {
		const { _id, type, createdBy, published, iconName, intent, content, likes } = this.props.story;
		let publishLabel;

		if (this.state.publishing) {
			if (published) publishLabel = 'Unpublishing...';
			else publishLabel = 'Publishing...';
		}
		else {
			if (published) publishLabel = 'Unpublish';
			else publishLabel = 'Publish';
		}

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
						<Button className='pt-minimal pt-small pt-intent-primary' text={publishLabel} disabled={this.props.publishing} onClick={this.togglePublish}/>
						<Button className='pt-minimal pt-small pt-intent-primary' text='Edit'/>
						<Button className='pt-minimal pt-small pt-intent-danger' text='Delete'/>
					</div>
				</div>

			</div>
		);
	}
}


export default StoryCard;
