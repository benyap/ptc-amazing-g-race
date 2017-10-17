import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, NonIdealState } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import { getStories } from '../../../../graphql/story';
import LoadingSpinner from '../../../components/LoadingSpinner';
import StoryList from './StoryList';
import CreateUserStory from './CreateUserStory';


const GetStoriesParams = '_id type createdBy published publishDate iconName intent content likes';

const GetStoriesOptions = {
	name: 'QueryGetStories',
	options: { 
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 50 }
	}
};

@graphql(getStories(GetStoriesParams), GetStoriesOptions)
@autobind
class Feed extends React.Component {
	state = {
		loading: false,
		showHelp: false
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	componentDidMount() {
		this.refresh();
	}

	refresh() {
		this.props.QueryGetStories.refetch();
	}

	render() {
		const { getStories, loading } = this.props.QueryGetStories;
		let content;

		if (getStories) {
			if (getStories.length) {
				content = <StoryList stories={getStories} refetch={this.props.QueryGetStories.refetch}/>;
			}
			else {
				content = (
					<div style={{margin:'3rem 0'}}>
						<NonIdealState title='No stories' description={`I guess there's nothing much happening yet.`} visual='feed'/>
					</div>
				);
			}
		}
		else if (loading) {
			content = <LoadingSpinner/>;
		}

		return (
			<main id='feed' className='dashboard'>
				<div className='content'>
					<h2>
						Newsfeed
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} loading={this.props.QueryGetStories.loading} style={{padding:'0'}}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							See regular updates on what the other teams have been up to... 
							make sure you keep up or you don't stand a chance!
							<br/>
							<br/>
							Or, you could say a few words and send the other teams some love with a word of encourgement.
							Double tap to like!
						</div>
						: null
					}
					<CreateUserStory refetch={this.props.QueryGetStories.refetch}/>
					{content}
				</div>
			</main>
		);
	}
}


export default Feed;
