import React, { useContext, useReducer } from "react";

type State = {
	data?: any;
};
export interface ContextProps {
	state: State;
	dispatch: (action: any) => void;
}
export const Context = React.createContext<ContextProps>({
	state: {},
	dispatch: () => {}
});

const reducer = (state: State, action) => {
	switch (action.type) {
		case "x":
			return state;
		default:
			return state;
	}
};

export const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		data: window.bundleStats
	});
	return (
		<Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
	);
};
export const useStore = () => useContext(Context);
