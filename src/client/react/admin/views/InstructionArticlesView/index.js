import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { NonIdealState } from '@blueprintjs/core';
import { graphql } from 'react-apollo'
import { getArticles } from '../../../../graphql/article';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';
import InstructionArticleCard from './InstructionArticleCard';
import InstructionArticleProfile from './InstructionArticleProfile';
import AddInstructionArticle from './AddInstructionArticle';

import '../../scss/components/_markdown-preview.scss';


const QueryGetArticlesParams = '_id title created createdBy{username} modified modifiedBy{username}';

const QueryGetArticlesOptions = {
	name: 'QueryGetArticles',
	options: {
		variables: { category: 'instructions' },
		fetchPolicy: 'cache-and-network'
	}
}

@graphql(getArticles(QueryGetArticlesParams), QueryGetArticlesOptions)
@autobind
class InstructionArticlesView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		viewProfile: null
	}

	renderProfile(article) {
		this.setState({ viewProfile: article });
	}
	
	async closeProfile() {
		this.setState({ viewProfile: null });
	}

	render() {
		const { loading, error, getArticles } = this.props.QueryGetArticles;
		let content, help;
		
		if (error) {
			content = <ViewError error={error}/>;
		}
		else {
			if (this.state.viewProfile) {
				content = <InstructionArticleProfile article={this.state.viewProfile} closeProfile={this.closeProfile} refetchArticles={this.props.QueryGetArticles.refetch}/>;
			}
			else if (getArticles) {
				if (getArticles.length) {
					content = (
						<div className='view-list'>
							{getArticles.map((article) => {
								return (
									<InstructionArticleCard key={article._id} article={article} renderProfile={this.renderProfile}/>
								);
							})}
							<AddInstructionArticle refetchArticles={this.props.QueryGetArticles.refetch}/>
						</div>
					);
				}
				else {
					content = (
						<div>
							<AddInstructionArticle refetchArticles={this.props.QueryGetArticles.refetch}/>
							<div style={{margin:'3rem'}}>
								<NonIdealState title='No instructions' description={`Poor souls. They are going to get so lost.`} visual='clipboard'/>
							</div>
						</div>
					);
				}
			}
			else if (loading) {
				content = <LoadingSpinner/>;
			}

			help = (
				<div className='pt-callout pt-icon-info-sign' style={{marginBottom: '0.5rem'}}>
					These instruction articles are displayed on the 'Instructions' tab on the app.
					They should not contain any challenge-specific instructions, 
					as they are not protected and are accessible to all teams at any time.
					These articles will appear in the order they appear here.
				</div>
			);
		}
		
		return (
			<div id='dashboard-instructions' className='dashboard-tab'>
				<h4>Instruction Articles</h4>
				<RefreshBar query={this.props.QueryGetArticles} disabled={this.state.viewProfile} shouldRefresh={this.props.shouldRefresh}/>
				{help}
				{content}
			</div>
		);
	}
}


export default InstructionArticlesView;
