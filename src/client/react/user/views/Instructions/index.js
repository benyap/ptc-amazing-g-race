import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Button, NonIdealState } from '@blueprintjs/core';
import { getArticles } from '../../../../graphql/article';
import LoadingSpinner from '../../../components/LoadingSpinner';
import InstructionCollapse from './InstructionCollapse';

import '../../scss/views/_main.scss'
import '../../scss/views/_instructions.scss';


const QueryGetArticlesOptions = {
	name: 'QueryGetArticles',
	options: {
		fetchPolicy: 'cache-and-network',
		variables: { category: 'instructions' }
	}
}

@graphql(getArticles('_id title content'), QueryGetArticlesOptions)
@autobind
class Instructions extends React.Component {
	state = {
		showHelp: false
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		const { loading, getArticles } = this.props.QueryGetArticles;
		let content;

		if (getArticles) {
			if (getArticles.length) {
				content = (
					<div>
						{getArticles.map((article) => {
							return <InstructionCollapse key={article._id} article={article}/>;
						})}
					</div>
				);
			}
			else {
				content = (
					<div style={{margin:'3rem 0'}}>
						<NonIdealState title='No instructions found' description={`You'll be alright.`} visual='clipboard'/>
					</div>
				);
			}
		}
		else if (loading) {
			content = <LoadingSpinner/>;
		}

		return (
			<main id='instructions' className='dashboard'>
				<div className='content'>
					<h2>
						Instructions
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							This page contains general information and instructions for the events on the day. 
							For challenge specific instructions, please go to the <Link to='/dashboard/challenges'>challenges</Link> page. 
						</div>
						: null
					}
					{content}
				</div>
			</main>
		);
	}
}


export default Instructions;
