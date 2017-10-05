import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


const mapStateToProps = (state, ownProps) => {
	return {
		authenticated: state.auth.login.authenticated,
		isAdmin: state.auth.login.admin
	}
}

@connect(mapStateToProps)
class Authenticated extends React.Component {
	static propTypes = {
		authenticated: PropTypes.bool.isRequired,
		hideUnauthenticated: PropTypes.bool,
		adminOnly: PropTypes.bool
	}

	static defaultProps = {
		authenticated: false,
		adminOnly: false,
		hideUnauthenticated: false
	}

	render() {
		// Only render if there are children to render
		if (this.props.children) {
			let shouldRender = false;
			let isAuthenticated = this.props.authenticated;
			
			// Authenticated
			if (this.props.authenticated) {
				if (this.props.adminOnly) {
					if (this.props.isAdmin) {
						shouldRender = true;
					}
					else {
						isAuthenticated = false;
						shouldRender = !this.props.hideUnauthenticated;
					}
				}
				else {
					shouldRender = true;
				}
			}

			// Unauthenticated
			else {
				shouldRender = !this.props.hideUnauthenticated;
			}

			if (shouldRender) {
				return (
					<div className='authenticated'>
						{this.renderChildren(isAuthenticated)}
					</div>
				);
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
