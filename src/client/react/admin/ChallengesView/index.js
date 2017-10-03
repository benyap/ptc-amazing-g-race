import React from 'react';
import autobind from 'core-decorators/es/autobind';


@autobind
class ChallengesView extends React.Component {
	render() {
		return (
			<div id='dashboard-challenges' className='dashboard-tab'>
				<h4>Challenges</h4>
			</div>
		);
	}
}


export default ChallengesView;
