import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


const mapStateToProps = (state, ownProps) => {
	return {
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Authenticated extends React.Component {
	static propTypes = {
		authenticated: PropTypes.bool.isRequired,
		hideUnauthenticated: PropTypes.bool,
	}

	static defaultProps = {
		authenticated: false,
		hideUnauthenticated: false
	}

	render() {
		if (this.props.hideUnauthenticated && !this.props.authenticated) {
			// Do not render anything
			return null;
		}
		else {
			if (this.props.children) {
				return (
					<div className='authenticated'>
						{this.renderChildren(this.props.authenticated)}
					</div>
				);
			}
			else {
				// FIXME: Rendering this for debugging purposes
				// return <div>Empty Container ({this.props.authenticated ? 'authenticated' : 'not authenticated'})</div>;
				return null;
			}
		}
	}

	renderChildren(authenticated) {
		return React.Children.map(this.props.children, child => {
			return React.cloneElement(child, { authenticated });
		});
	}
}


export default Authenticated;
