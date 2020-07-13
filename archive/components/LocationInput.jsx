import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import Search from '../assets/search.svg';

export const LocationInput = props => {
	const {
		map,
		setLocation,
		goLocation,
		location,
	} = props;

	const handleKeyPress = e => {
		if (e.key === 'Enter') {
			e.target.blur();
		}
	};

	return (
		<div className="LocationInput clickable">
			<PlacesAutocomplete 
			// classNames={{input: 'text Location'}} 
			inputProps={{placeholder: "Address", value: location, onChange: e => setLocation(e), onBlur: () => goLocation(null, map), onKeyUp: e => handleKeyPress(e)}} 
			searchOptions={{
				location: new google.maps.LatLng(40.711744, -74.013315),
				radius: 20000,
				types: ['address']
			}}
			/>
			{/* <img className="SearchIcon" src={Search}/> */}
		</div>
	)
};