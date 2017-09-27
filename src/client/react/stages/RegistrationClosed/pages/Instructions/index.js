import React from 'react';
import { Link } from 'react-router-dom';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Button, Spinner } from '@blueprintjs/core';
import InstructionCollapse from './InstructionCollapse';

import '../../../../scss/dashboard/_main.scss'
import '../../../../scss/components/_instructions.scss';


const QueryGetArticles = gql`
query GetArticles($category:String!){
	getArticles(category:$category){
		_id
		title
		content
	}
}`;

const QueryGetArticlesOptions = {
	name: 'QueryGetArticles',
	options: {
		fetchPolicy: 'cache-and-network',
		variables: { category: 'instructions' }
	}
}

@graphql(QueryGetArticles, QueryGetArticlesOptions)
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
					{ this.props.QueryGetArticles.getArticles ? 
						this.props.QueryGetArticles.getArticles.map((article) => {
							return <InstructionCollapse key={article._id} article={article}/>;
						})
						: 
						<div style={{textAlign:'center', margin: '2rem'}}>
							<Spinner/>
						</div>
					}
				</div>
			</main>
		);
	}
}


export default Instructions;
