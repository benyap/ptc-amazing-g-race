import React from 'react';


class AppContainer extends React.Component {
	render() {
		if (this.props.children) {
			return <div className='app'>{this.props.children}</div>;
		}
		else {
			return <div className='app'>Empty Application.</div>;
		}	
	}
}


export default AppContainer;
