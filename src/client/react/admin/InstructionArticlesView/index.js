import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import { gql, graphql } from 'react-apollo'
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';
import InstructionArticleCard from './InstructionArticleCard';
import InstructionArticleProfile from './InstructionArticleProfile';


const QueryGetArticles = gql`
query GetArticles($category:String!){
	getArticles(category:$category){
		_id
		title
		modified
		modifiedBy{
			username
		}
	}
}`;

const QueryGetArticlesOptions = {
	name: 'QueryGetArticles',
	options: {
		variables: { category: 'instructions' }
	}
}

@graphql(QueryGetArticles, QueryGetArticlesOptions)
@autobind
class InstructionArticlesView extends React.Component {
	state = {
		viewProfile: null
	}

	renderProfile(article) {
		this.setState({ viewProfile: article });
	}
	
	closeProfile() {
		this.setState({ viewProfile: null });
	}

	render() {
		let content = null;
		let { loading, error, getArticles } = this.props.QueryGetArticles;

		if (loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				if (this.state.viewProfile) {
					content = <InstructionArticleProfile article={this.state.viewProfile} closeProfile={this.closeProfile}/>;
				}
				else {
					content = (
						<div>
							<div className='pt-callout pt-icon-info-sign' style={{marginBottom: '0.5rem'}}>
								These instruction articles are displayed on the 'Instructions' tab on the app.
								They should not contain any challenge-specific instructions, 
								as they are not protected and are accessible to all teams at any time.
							</div>
							<div className='view-list'>
								{
									getArticles.map((article) => {
										return (
											<InstructionArticleCard key={article._id} article={article} renderProfile={this.renderProfile}/>
										);
									})
								}
								<Button text='Create Article' intent={Intent.PRIMARY} iconName='clipboard' className='pt-minimal pt-fill'/>
							</div>
						</div>
					);
				}
			}
		}

		return (
			<div id='dashboard-instructions' className='dashboard-tab'>
				<h4>Instruction Articles</h4>
				<RefreshBar query={this.props.QueryGetArticles} disabled={false}/>
				{content}
			</div>
		);
	}
}


export default InstructionArticlesView;
