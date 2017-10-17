import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import '../../../components/LoadingSpinner';
import ViewError from '../../components/ViewError';
import RefreshBar from '../../components/RefreshBar';


@autobind
class FeedView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool
	}

	render() {

		return (
			<div id='dashboard-feed' className='dashboard-tab'>
				<h4>Newsfeed</h4>
				{/* <RefreshBar query={} shouldRefresh={this.props.shouldRefresh}/> */}
				
			</div>
		);
	}
}


export default FeedView;
