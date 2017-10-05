const initialState = {
	loaded: false
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'REDUX_STORAGE_LOAD': {
			return { ...state,
				loaded: true
			}
		}

		default: {
			return state;
		}
	}
};
