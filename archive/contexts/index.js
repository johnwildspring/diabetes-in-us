import React from 'react';

import { UserDefaultState, UserProvider } from './User';
import { MapEntityDefaultState, MapEntityProvider, MapEntityActions } from './MapEntity';

export class Store extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			User: UserDefaultState,
			MapEntity: MapEntityDefaultState
		};
	}

	render() {
		const { state } = this;
		return (
			<UserProvider value={{state: state.User}}>
				<MapEntityProvider value={{state: state.MapEntity, actions: MapEntityActions(this)}}>
					{this.props.children}
				</MapEntityProvider>
			</UserProvider>
		)
	}
}