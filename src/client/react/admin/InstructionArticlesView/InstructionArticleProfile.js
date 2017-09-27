import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { compose, graphql, gql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText, Dialog } from '@blueprintjs/core';
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

const MutationRemoveArticle = gql`
mutation RemoveArticle($articleId:ID!,$category:String!){
	removeArticle(articleId:$articleId, category:$category){
		ok
	}
}`;

@compose(
	graphql(QueryGetArticle, QueryGetArticleOptions),
	graphql(MutationSetArticleTitle, { name: 'MutationSetArticleTitle' }),
	graphql(MutationEditArticle, { name: 'MutationEditArticle' }),
	graphql(MutationRemoveArticle, { name: 'MutationRemoveArticle' })
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
		content: null,
		showConfirmClose: false,
		showConfirmDelete: false,
		deleteLoading: false
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

	toggleConfirmClose() {
		if (this.state.showConfirmClose) {
			this.setState({ showConfirmClose: false });
		}
		else {
			if (this.state.modified) {
				this.setState({ showConfirmClose: true });
			}
			else {
				this.closeProfile();
			}
		}
	}

	toggleConfirmDelete() {
		this.setState((prevState) => {
			return { showConfirmDelete: !prevState.showConfirmDelete };
		});
	}

	async submitDeleteArticle() {
		this.setState({ deleteLoading: true });
		try {
			await this.props.MutationRemoveArticle({
				variables: {
					articleId: this.props.article._id,
					category: 'instructions'
				}
			});
			this.props.closeProfile();
		}
		catch(e) {
			this.setState({ deleteLoading: false });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: e.toString()
			});
		}
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
				<Button className='pt-minimal' intent={Intent.NONE} text='Close' onClick={this.toggleConfirmClose} style={{float:'right'}}/>
				<Button className='pt-minimal' intent={Intent.PRIMARY} text='Save' onClick={this.saveContent} style={{float:'right'}} disabled={!this.state.modified}/>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Delete' onClick={this.toggleConfirmDelete} style={{float:'right'}}/>
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

				{/* Confirm close dialog */}
				<Dialog isOpen={this.state.showConfirmClose} onClose={this.toggleConfirmClose} title='Unsaved changes'>
					<div className='pt-dialog-body'>
						Are you sure you want to close without saving?
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button intent={Intent.DANGER} className='pt-minimal' text='Close' onClick={this.closeProfile}/>
							<Button intent={Intent.PRIMARY} text='Cancel' onClick={this.toggleConfirmClose}/>
						</div>
					</div>
				</Dialog>

				{/* Confirm delete dialog */}
				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleConfirmDelete} title='Delete article'>
					<div className='pt-dialog-body'>
						Are you sure you want to delete this article? This action is irreversible.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleConfirmDelete} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteArticle} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default InstructionArticleProfile;
