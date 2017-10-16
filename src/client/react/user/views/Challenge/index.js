import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Icon, NonIdealState } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import { getChallengeById } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import LoadingSpinner from '../../../components/LoadingSpinner';
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
		let content = <LoadingSpinner/>;

		const { loading, getChallengeById } = this.props.QueryGetChallengeById

		if (getChallengeById) {
			content = (
				<ChallengeProfile challenge={getChallengeById}/>
			);
		}
		else {
			if (!loading) {
				content = (
					<div style={{margin:'3rem'}}>
						<NonIdealState title={`There's nothing here.`} description='Sorry.' visual='error'/>
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
