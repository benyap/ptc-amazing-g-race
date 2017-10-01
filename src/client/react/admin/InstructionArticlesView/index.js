import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Intent, Spinner, Dialog } from '@blueprintjs/core';
import { compose, graphql } from 'react-apollo'
import { getArticles, addArticle } from '../../../graphql/article';
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';
import InstructionArticleCard from './InstructionArticleCard';
import InstructionArticleProfile from './InstructionArticleProfile';
import FormInput from '../../../../../lib/react/components/forms/FormInput';


const QueryGetArticlesParams = '_id title created createdBy{username} modified modifiedBy{username}';

const QueryGetArticlesOptions = {
	name: 'QueryGetArticles',
	options: {
		variables: { category: 'instructions' },
		fetchPolicy: 'network-and-cache'
	}
}

@compose(
	graphql(getArticles(QueryGetArticlesParams), QueryGetArticlesOptions),
	graphql(addArticle('_id'), { name: 'MutationAddArticle' })
)
@autobind
class InstructionArticlesView extends React.Component {
	state = {
		viewProfile: null,
		loading: false,
		refetching: false,
		showAddArticle: false,
		addArticleTitle: '',
		addArticleLoading: false,
		addArticleError: null
	}

	renderProfile(article) {
		this.setState({ viewProfile: article });
	}
	
	async closeProfile() {
		this.setState({ viewProfile: null, refetching: true });
		await this.props.QueryGetArticles.refetch();
		this.setState({ refetching: false });
	}

	toggleAddArticle() {
		this.setState((prevState) => {
			return { 
				showAddArticle: !prevState.showAddArticle, 
				addArticleTitle: '',
				addArticleError: null
			};
		});
	}

	addArticleTitleEdit(e) {
		this.setState({ addArticleTitle: e.target.value });
	}

	async submitAddArticle() {
		if (this.state.addArticleTitle.length < 1) {
			this.setState({ addArticleError: 'Article title is required.' });
		}
		else {
			this.setState({ addArticleLoading: true, addArticleError: false });
			try {
				await this.props.MutationAddArticle({
					variables: {
						title: this.state.addArticleTitle,
						category: 'instructions',
						content: `# ${this.state.addArticleTitle}\n`
					}
				});

				this.setState({ addArticleLoading: false, showAddArticle: false, refetching: true });
				await this.props.QueryGetArticles.refetch();
				this.setState({ refetching: false });
			}
			catch (e) {
				this.setState({ addArticleError: e.toString(), addArticleLoading: false });
			}
		}
	}

	render() {
		let content = null;
		const { loading, error, getArticles } = this.props.QueryGetArticles;

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
								These articles will appear in the order they appear here.
							</div>
							<div className='view-list'>
								{
									getArticles.map((article) => {
										return (
											<InstructionArticleCard key={article._id} article={article} renderProfile={this.renderProfile}/>
										);
									})
								}
								<Button text='Create Article' onClick={this.toggleAddArticle} intent={Intent.PRIMARY} iconName='clipboard' className='pt-minimal pt-fill'/>
							</div>

							{/* Add article dialog */}
							<Dialog title='Create a new article' isOpen={this.state.showAddArticle} onClose={this.toggleAddArticle}>
								<div className='pt-dialog-body'>
									{this.state.addArticleError ? 
										<div className='pt-callout pt-intent-danger pt-icon-error'>
											{this.state.addArticleError}
										</div>
										:null}
									<b>Article title:</b> <FormInput id='addArticle' value={this.state.addArticleTitle} onChange={this.addArticleTitleEdit} 
									intent={this.state.addArticleError ? Intent.DANGER : Intent.NONE}/>
								</div>
								<div className='pt-dialog-footer'>
									<div className='pt-dialog-footer-actions'>
										<Button className='pt-minimal' text='Cancel' onClick={this.toggleAddArticle} disabled={this.state.addArticleLoading}/>
										<Button intent={Intent.PRIMARY} text='Create' onClick={this.submitAddArticle} loading={this.state.addArticleLoading}/>
									</div>
								</div>
							</Dialog>
						</div>
					);
				}
			}
		}

		return (
			<div id='dashboard-instructions' className='dashboard-tab'>
				<h4>Instruction Articles</h4>
				<RefreshBar query={this.props.QueryGetArticles} disabled={this.state.viewProfile} refetching={this.state.refetching}/>
				{content}
			</div>
		);
	}
}


export default InstructionArticlesView;
