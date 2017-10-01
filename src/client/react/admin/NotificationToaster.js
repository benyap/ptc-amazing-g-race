import React from 'react';
import { Toaster } from '@blueprintjs/core/dist/components/toast/toaster';
import { Position } from '@blueprintjs/core/dist/common/position';

const NotificationToaster = Toaster.create({
	position: Position.BOTTOM_RIGHT
});

export default NotificationToaster;
