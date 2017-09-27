import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { compose, graphql, gql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText } from '@blueprintjs/core';
import { saveState } from '../../../actions/stateActions';
import MarkdownEditor from '../../../../../lib/react/components/MarkdownEditor';
import NotificationToaster from '../NotificationToaster';


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

const MutationSetArticleTitle = gql`
mutation SetArticleTitle($articleId:ID!,$category:String!, $newTitle:String!){
	setArticleTitle(articleId:$articleId, category:$category, newTitle:$newTitle){
		ok
	}
}`;

const MutationEditArticle = gql`
mutation EditArticle($articleId:ID!,$category:String!, $content:String!){
	editArticle(articleId:$articleId, category:$category, content:$content){
		ok
	}
}`;


@compose(
	graphql(QueryGetArticle, QueryGetArticleOptions),
	graphql(MutationSetArticleTitle, { name: 'MutationSetArticleTitle' }),
	graphql(MutationEditArticle, { name: 'MutationEditArticle' })
)
@connect()
@autobind
class InstructionArticleProfile extends React.Component {
	static propTypes = {
		article: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired
		}).isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	state = {
		saving: false,
		modified: false,
		titleText: this.props.article.title,
		content: null
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	closeProfile() {
		this.props.closeProfile();
	}

	editTitle(value) {
		this.setState({ titleText: value });
	}

	confirmTitle(value) {
		if (value.length < 1) {
			this.setState({ titleText: this.props.article.title });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: 'Title cannot be empty.'
			});
		}
		else {
			const options = {
				variables: {
					articleId: this.props.article._id,
					category: 'instructions',
					newTitle: this.state.titleText
				}
			};
			this._save(this.props.MutationSetArticleTitle, options);
		}
	}

	componentDidUpdate() {
		if (!this.state.content && this.props.QueryGetArticle.getArticle) {
			this.setState({content: this.props.QueryGetArticle.getArticle.content});
		}
	}

	editContent(event) {
		this.setState({content: event.target.value, modified: true});
	}

	saveContent() {
		this.setState({modified: false});
		const options = {
			variables: {
				articleId: this.props.article._id,
				category: 'instructions',
				content: this.state.content
			}
		};
		this._save(this.props.MutationEditArticle, options);
	}

	async _save(mutation, mutationOptions) {
		try {
			this.setState({saving: true});
			await mutation(mutationOptions);
	
			await this.props.QueryGetArticle.refetch();
			this.props.dispatch(saveState());
			if (this._mounted) this.setState({saving: false});
		}
		catch (e) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
			if (this._mounted) this.setState({saving: false});
		}
	}

	render() {
		let { loading, getArticle } = this.props.QueryGetArticle;

		return (
			<div id='instruction-article-profile' className='pt-card instruction-article-profile'>
				<Button className='pt-minimal' intent={Intent.PRIMARY} text='Save' onClick={this.saveContent} style={{float:'right'}} disabled={!this.state.modified}/>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
				{loading || this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }

				<h4><b>
					<EditableText value={this.state.titleText} onChange={this.editTitle} onConfirm={this.confirmTitle}/>
				</b></h4>
				
				{ loading ? null:
					<MarkdownEditor content={this.state.content || this.props.QueryGetArticle.getArticle.content} onChange={this.editContent}/>
				}
			</div>
		);
	}
}


export default InstructionArticleProfile;
