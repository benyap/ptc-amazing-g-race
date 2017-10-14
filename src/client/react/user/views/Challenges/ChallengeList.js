import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, NonIdealState } from '@blueprintjs/core';
import ChallengeCard from './ChallengeCard';


class ChallengeList extends React.Component {
	static propTypes = {
		challenges: PropTypes.array
	}

	render() {
		const { challenges } = this.props;

		if (challenges) {
			if (challenges.length > 0) {
				return challenges.map((challenge) => {
					return <ChallengeCard key={challenge.key} order={challenge.order} challenge={challenge}/>;
				})
				.sort((a, b) => {
					if (a.props.order > b.props.order) return 1;
					else if (a.props.order < b.props.order) return -1;
					else return 0;
				});
			}
			else {
				return (
					<div style={{margin:'3rem 0'}}>
						<NonIdealState title='No challenges' description='No challenges are currently available.' visual='map'/>
					</div>
				);
			}
		}
		else {
			return (
				<div style={{margin:'3rem 0'}}>
					<NonIdealState title='Loading...' visual={<Spinner/>}/>
				</div>
			);
		}
	}
}


export default ChallengeList;
