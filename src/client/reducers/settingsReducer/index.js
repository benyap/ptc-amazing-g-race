const initialState = {
	showNotifications: true
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'TOGGLE_SHOW_NOTIFICATIONS': {
			return { ...state,
				showNotifications: !state.showNotifications
			}
		}

		default: {
			return state;
		}
	}
};
