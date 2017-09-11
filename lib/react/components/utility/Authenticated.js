import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


const mapStateToProps = (state, ownProps) => {
	return {
		authenticated: state.auth.login.authenticated,
		admin: state.auth.login.admin
	}
}

@connect(mapStateToProps)
class Authenticated extends React.Component {
	static propTypes = {
		authenticated: PropTypes.bool.isRequired,
		hideUnauthenticated: PropTypes.bool,
		isAdmin: PropTypes.bool
	}

	static defaultProps = {
		authenticated: false,
		isAdmin: false,
		hideUnauthenticated: false
	}

	render() {
		if (this.props.hideUnauthenticated && !this.props.authenticated) {
			// Do not render anything
			return null;
		}
		else {
			if (this.props.children) {
				let authenticated = this.props.authenticated;
				if (this.props.isAdmin) authenticated = authenticated && this.props.admin;
				
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
