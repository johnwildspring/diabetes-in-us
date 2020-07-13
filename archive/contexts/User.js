import React from 'react';

export const UserDefaultState = {
	id: null,
	session: null,
	first_name: '',
	last_name: '',
	email: ''
};
export const UserContext = React.createContext(UserDefaultState);
export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;