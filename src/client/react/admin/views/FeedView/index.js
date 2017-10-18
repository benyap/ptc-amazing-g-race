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
import FeedSummary from './FeedSummary';

import '../../scss/views/_feed-view.scss';


const GetAllStoriesParams = '_id type createdBy published publishDate iconName intent content likes';

const GetAllStoriesOptions = {
	name: 'QueryGetAllStories',
	options: { 
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 0 }
	}
};

@graphql(getAllStories(GetAllStoriesParams), GetAllStoriesOptions)
@autobind
class FeedView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool
	}

	state = {
		publishing: false,
		filter: 'none',
		search: ''
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	setPublishing(publishing) {
		this.setState({publishing});
	}

	_applySearchFeed(story) {
		if (this.state.search.length > 0) {
			const search = this.state.search.toLowerCase();
			const matchContent = story.content.toLowerCase().indexOf(search) >= 0;
			const matchIntent = story.intent.toLowerCase().indexOf(search) >= 0;
			const matchAuthor = story.createdBy.toLowerCase().indexOf(search) >= 0;

			if (matchContent || matchIntent || matchAuthor) return true;
			else return false;
		}
		else return true;
	}

	_applyFilterFeed(story) {
		switch (this.state.filter) {
			case 'custom': {
				return story.type === 'custom';
			}
			case 'user': {
				return story.type === 'user';
			}
			case 'system': {
				return story.type !== 'custom' && story.type !== 'user';
			}
			case 'none':
			default: return true;
		}
	}

	searchFeed(search) {
		this.setState({search});
	}

	filterFeed(filter) {
		this.setState({filter});
	}

	render() {
		const { loading, getAllStories } = this.props.QueryGetAllStories;
		let content, summary;
		let storyCount = 0, storyTotal = 0;
		
		if (getAllStories) {
			if (getAllStories.length) {
				content = (
					<div className='story-list'>
						<div className='pt-dark'>
							{ getAllStories.map((story) => {
									storyTotal += 1;
									if (this._applySearchFeed(story) && this._applyFilterFeed(story)) {
										storyCount += 1;
										return <StoryCard key={story._id} story={story} refetch={this.props.QueryGetAllStories.refetch} publishing={this.state.publishing} setPublishing={this.setPublishing}/>;
									}
								})}
						</div>
					</div>
				);

				if (storyCount === 0) {
					content = (
						<div style={{margin:'3rem'}}>
							<NonIdealState title='No stories match your query.' description='Did you make a typo?' visual='search'/>
						</div>
					);
				}
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

		summary = (
			<div>
				<FeedSummary 
					searchValue={this.state.search} onSearchChange={this.searchFeed} 
					filterValue={this.state.filter} onFilterChange={this.filterFeed}
					storyTotal={storyTotal} storyCount={storyCount}/>
				<StoryCreate refetch={this.props.QueryGetAllStories.refetch}/>
			</div>
		);

		return (
			<div id='dashboard-feed' className='dashboard-tab'>
				<h4>Newsfeed</h4>
				<RefreshBar query={this.props.QueryGetAllStories} shouldRefresh={this.props.shouldRefresh}/>
				{summary}
				{content}
			</div>
		);
	}
}


export default FeedView;
