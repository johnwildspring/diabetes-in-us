import 'isomorphic-fetch';
import React from 'react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';


import Mapbox from './Mapbox.jsx';
import { Controls } from './Controls.jsx';
import { getDOBRecords } from 'dob';

import '../styles/base.sass';

class App extends Mapbox {
	constructor(props) {
		super(props);
		this.center = [40.711414, -74.008958];
		this.style = {
			height:'100%',
			width: '100%'
		}
		this.standardCoord = true;
		this.state = {
			...this.state,
			location: '',
			locCenter: null,
			pin: null,
			records: [],
			loading: false
		}

		this.sourceFunctions.push((data, UIProps) => {
			const features = UIProps.locCenter ? [{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [UIProps.locCenter.latLng.lng, UIProps.locCenter.latLng.lat]
				}
			}] : [];
			return {
				name: 'location-pin',
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features
				}
			};
		});

		this.layerFunctions.push(() => (
			{
				"id": "point",
				"source": "location-pin",
				"type": "symbol",
				'layout': {
					'icon-image': 'pin',
					'icon-size': 0.8
				}
			}
		))
	}

	setLocation = location => {
		this.setState({
			location
		});
	}

	goLocation = (coordMode, map) => {
		const { location } = this.state;
		return geocodeByAddress(location)
			.then(results => {
				return Promise.all([results, getLatLng(results[0])]);
			})
			.then(results => {
				let address = results[0];
				if (!address || address.length == 0) {
					throw new Error('No results found.');
				} else {
					address = address[0];
				}
				const latLng = results[1];
				map.easeTo({center: latLng, offset: [0, -200]});
				const addressName = [address.address_components[0].long_name, address.address_components[1].long_name];
				const addressNameString = `${addressName[0]} ${addressName[1]}`;
				this.setState({
					locCenter: {...address, addressName: addressNameString, latLng},
					loading: addressNameString
				}, () => console.log(this.state));
				this.requestRecords(...addressName)
					.then(res => {
						console.log(res);
						if (res && res.length > 0 && this.state.loading == addressNameString) {
							this.setState({
								loading: false,
								records: res
							});
						}
					});
			})
			.catch(e => {
				console.error('Error', e);
			});
	}

	requestRecords(house, street) {
		return getDOBRecords(house, street)
			.catch(console.error);
	}

	get UIProps() {
		const { map, setLocation, goLocation } = this;
		const { location, locCenter, loading, records } = this.state;
		return {
			map,
			setLocation,
			goLocation,
			location,
			locCenter,
			loading,
			records
		}
	}

	addControls() {
		this.controls = new Controls(this.UIProps);
		this.controllers.push(this.controls);
	}

	componentDidUpdate() {
		super.componentDidUpdate(...arguments);
		this.controls.render(this.UIProps);
	}

	componentWillMount() {
		this.addControls();
	};

	setupMap() {
		const addImg = (name, data) => {
			const img = document.createElement('img');
			img.src = data;
			img.crossOrigin = 'Anonymous';
			img.onload = () => {
				if (this.images.indexOf(name) == -1) {
					this.images.push(name);
					this.map.addImage(name, img);
				}
			}
		}
		addImg('pin', 'https://i.imgur.com/MK4NUzI.png');

		super.setupMap();
	}

}



export default App;