import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { NonIdealState } from '@blueprintjs/core';
import { getAllStories } from '../../../../graphql/story';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NotificationToaster from '../../../components/NotificationToaster';
import ViewError from '../../components/ViewError';
import RefreshBar from '../../components/RefreshBar';
import StoryCard from './StoryCard';
import StoryCreate from './StoryCreate';

import '../../scss/views/_feed-view.scss';


const GetAllStoriesParams = '_id type createdBy published publishDate iconName intent content likes';

const GetAllStoriesOptions = {
	name: 'QueryGetAllStories',
	options: { 
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 50 }
	}
};

@graphql(getAllStories(GetAllStoriesParams), GetAllStoriesOptions)
@autobind
class FeedView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool
	}

	state = {
		skip: '0',
		limit: '50',
		refetching: false,
		renderStory: null,
		publishing: false
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	renderProfile(story) {
		this.setState({ renderStory: story });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.refetchStories();
		});
	}

	setPublishing(publishing) {
		this.setState({publishing});
	}

	async refetchStories() {
		if (!this.state.viewProfile) {
			if (this._mounted) this.setState({refetching: true});

			try {
				await this.props.QueryGetAllStories.refetch();
				if (this._mounted) this.setState({refetching: false});
			}
			catch (err) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		const { loading, getAllStories } = this.props.QueryGetAllStories;
		let content;

		if (getAllStories) {
			if (getAllStories.length) {
				content = (
					<div className='story-list'>
						<div className='pt-dark'>
							{ getAllStories.map((story) => {
								return <StoryCard key={story._id} story={story} refetch={this.props.QueryGetAllStories.refetch} 
													publishing={this.state.publishing} setPublishing={this.setPublishing}/>;
							})}
						</div>
						<StoryCreate refetch={this.props.QueryGetAllStories.refetch}/>
					</div>
				);
			}
			else {
				content = (
					<div>
						<StoryCreate refetch={this.props.QueryGetAllStories.refetch}/>
						<div style={{margin:'3rem'}}>
							<NonIdealState title='No stories' description={`How boring.`} visual='feed'/>
						</div>
					</div>
				);
			}
		}
		else if (loading) {
			content = <LoadingSpinner/>;
		}

		return (
			<div id='dashboard-feed' className='dashboard-tab'>
				<h4>Newsfeed</h4>
				<RefreshBar query={this.props.QueryGetAllStories} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default FeedView;
