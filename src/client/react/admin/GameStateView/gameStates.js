// ===============
//  Define states
// ===============

export const rego_not_open = {
	name: 'Promotion',
	key: 'rego_not_open',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'rego_not_open'
			}
		]
	}
};

export const rego_open = {
	name: 'Registration open',
	key: 'rego_open',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'rego_open'
			}
		]
	}
};

export const rego_closed = {
	name: 'Registration closed',
	key: 'rego_closed',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'rego_closed'
			}
		]
	}
};

export const race = {
	name: 'The Amazing GRace',
	key: 'race',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'race'
			}
		]
	}
};

export const post_race = {
	name: 'Race finished',
	key: 'post_race',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'post_race'
			}
		]
	}
};

export const closed = {
	name: 'Closed',
	key: 'closed',
	settings: {
		set: [
			{
				key: 'race_state',
				value: 'closed'
			}
		]
	}
};