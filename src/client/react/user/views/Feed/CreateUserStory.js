import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Dialog } from '@blueprintjs/core';
import { createUserStory } from '../../../../graphql/story';


@graphql(createUserStory('ok'), { name: 'MutationCreateUserStory' })
@autobind
class CreateUserStory extends React.Component {
	static propTypes = {
		refetch: PropTypes.func.isRequired
	}

	state = {
		showCreateStory: false,
		createStoryLoading: false,
		createStoryError: null,
		content: ''
	}

	toggleShowCreateStory() {
		if (!this.state.createStoryLoading) {
			this.setState((prevState) => {
				return { 
					showCreateStory: !prevState.showCreateStory, 
					createStoryError: null,
					content: ''
				 };
			});
		}
	}

	onContentChange(e) {
		this.setState({ content: e.target.value });
	}

	async submitCreateStory() {
		this.setState({ createStoryLoading: true, createStoryError: null });
		try  {
			await this.props.MutationCreateUserStory({
				variables: { content: this.state.content }
			});
			await this.props.refetch();
			this.setState({ createStoryLoading: false, showCreateStory: false });
		}
		catch (err) {
			this.setState({ createStoryLoading: false, createStoryError: err.toString() });
		}
	}

	render() {
		return (
			<div>
				<Button text='Pitch in to the excitement!' className='pt-fill pt-intent-primary' style={{marginBottom:'0.5rem'}}
					iconName='chat' onClick={this.toggleShowCreateStory} disabled={this.state.createStoryLoading}/>

				<Dialog isOpen={this.state.showCreateStory} onClose={this.toggleShowCreateStory} title='What do you want to say?' iconName='chat'>
					<div className='pt-dialog-body'>
						{ this.state.createStoryError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								<h5>We couldn't post your story</h5>
								{this.state.createStoryError}
							</div>
							:null
						}

						<textarea className='pt-input pt-large' style={{width:'100%',minHeight:'8rem',fontSize:'1.5rem',marginBottom:'1rem'}}
							onChange={this.onContentChange} value={this.state.content}/>

						<Button className='pt-fill pt-intent-primary' text='Post' onClick={this.submitCreateStory} 
							loading={this.state.createStoryLoading} disabled={!this.state.content}/>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default CreateUserStory;
