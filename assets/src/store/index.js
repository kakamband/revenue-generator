import { registerStore } from '@wordpress/data';

// Data store key.
const STORE_KEY = 'laterpay-revenue-generator';

const DEFAULT_STATE = {
	globalOptions: {
		...window.revenueGenerator.globalOptions,
	},
};

// Data module actions.
const actions = {
	setConfig( item, value ) {
		return {
			type: 'SET_GLOBAL_OPTION',
			item,
			value,
		};
	},
};

// Handle actions.
const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_GLOBAL_OPTION':
			return {
				...state,
				globalOptions: {
					...state.globalOptions,
					[ action.item ]: action.value,
				},
			};
	}
	return state;
};

// Data selectors.
const selectors = {
	getGlobalOptionValue( state, item ) {
		const { globalOptions } = state;
		return globalOptions[ item ];
	},
};

registerStore( STORE_KEY, {
	reducer,
	actions,
	selectors,
} );
