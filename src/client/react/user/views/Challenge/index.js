import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Spinner, NonIdealState, Icon } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import NotificationToaster from '../../../components/NotificationToaster';
import { getChallengeById } from '../../../../graphql/challenge';
import ChallengeProfile from './ChallengeProfile';


const QueryGetChallengeByIdOptions = {
	name: 'QueryGetChallengeById',
	options: (props) => {
		return {
			variables: { id: props.match.params.id },
			fetchPolicy: 'cache-and-network'
		}
	}
};

@graphql(getChallengeById('key order locked title description teams items{key order type title description}'), QueryGetChallengeByIdOptions)
@autobind
class Challenge extends React.Component {
	render() {
		let content = (
			<div style={{margin:'3rem 0'}}>
				<NonIdealState title='Loading...' visual={<Spinner/>}/>
			</div>
		);

		const { loading, getChallengeById } = this.props.QueryGetChallengeById

		if (getChallengeById) {
			content = (
				<ChallengeProfile challenge={getChallengeById}/>
			);
		}
		else {
			if (!loading) {
				content = (
					<div className='pt-non-ideal-state' style={{height:'40vh'}}>
						<div className='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
							<span className='pt-icon pt-icon-error'></span>
						</div>
						<h4>There's nothing here.</h4>
						<div className='pt-non-ideal-state-description'>
							Sorry.
						</div>
					</div>
				);
			}
		}

		return (
			<main id='challenge' className='dashboard'>
				<Link to='/dashboard/challenges' className='pt-button pt-fill pt-intent-warning'>
					<Icon iconName='chevron-left'/> Back to Challenges
				</Link>
				<div className='content'>
					{content}
				</div>
			</main>
		);
	}
}


export default Challenge;
