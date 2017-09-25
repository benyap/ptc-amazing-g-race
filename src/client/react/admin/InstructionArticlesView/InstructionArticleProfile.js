import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { graphql, gql } from 'react-apollo';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import MarkdownEditor from '../../../../../lib/react/components/MarkdownEditor';


const QueryGetArticle = gql`
query GetArticle($category:String!, $articleId:ID!){
	getArticle(category:$category, articleId:$articleId){
		title
		content
		modified
		modifiedBy{
			username
		}
	}
}`;

const QueryGetArticleOptions = {
	name: 'QueryGetArticle',
	options: (props) => {
		return {
			variables: {
				category: 'instructions',
				articleId: props.article._id
			}
		}
	}
}

@graphql(QueryGetArticle, QueryGetArticleOptions)
@autobind
class InstructionArticleProfile extends React.Component {
	static propTypes = {
		article: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired
		}).isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	closeProfile() {
		this.props.closeProfile();
	}

	render() {
		let { loading, getArticle } = this.props.QueryGetArticle;

		return (
			<div id='instruction-article-profile' className='pt-card instruction-article-profile'>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
				<h4>{this.props.article.title}</h4>
			</div>
		);
	}
}


export default InstructionArticleProfile;
