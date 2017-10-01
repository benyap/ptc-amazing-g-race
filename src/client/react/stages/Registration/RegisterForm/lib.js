import React from 'react';
import { Icon } from '@blueprintjs/core/dist/components/icon/icon';
import { Intent } from '@blueprintjs/core/dist/common/intent';
import { Spinner } from '@blueprintjs/core/dist/components/spinner/spinner';


const errorIcon = () => {
	return <Icon iconName='error' intent={Intent.DANGER} style={{marginTop: '0.7rem', marginRight: '0.7rem'}}/>;
};

const tickIcon = () => {
	return <Icon iconName='tick' intent={Intent.SUCCESS} style={{marginTop: '0.7rem', marginRight: '0.7rem'}}/>;
}

const errorProps = () => {
	return {intent: Intent.DANGER, rightElement: errorIcon()};
};

const pendingProps = () => {
	return {intent: Intent.WARNING, rightElement: <Spinner className='pt-small'/>}
};

const successProps = () => {
	return {intent: Intent.SUCCESS, rightElement: tickIcon()}
};


export {
	errorIcon,
	errorProps,
	pendingProps,
	successProps
}
