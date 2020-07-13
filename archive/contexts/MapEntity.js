import React from 'react';
import uuidv4 from 'uuid/v4';

import { Storage } from 'services/storage';

const storage = new Storage('MapEntity');

const defaultPointState = {
	hovering: false,
	editing: false,
	list: 'points'
};

const Point = function(input) {
	if (!input) {
		throw new Error('Point expects an input.');
	}
	if (!input.geometry) {
		throw new Error('Point expects a geometry.');
	}

	return {
		type: 'Feature',
		geometry: input.geometry,
		properties: {
			id: uuidv4(),
			...defaultPointState,
			// Override default point state with input.
			...input.properties
		}
	};
}

let session;
let points = new Map();
if (storage) {
	session = storage.get('session');
	if (session && session.data) {
		points = session.data.points || [];
		points = new Map(points.map(point => [point.properties?.id, Point({
			...point,
			// Reset point state.
			properties: {
				...point.properties,
				...defaultPointState
			}
		})]));
	}
}
export const MapEntityDefaultState = {
	session_from: session ? session.timestamp || null : null,
	saving: false,
	id: null,
	points,
	garbage: new Map()
};
export const MapEntityContext = React.createContext(MapEntityDefaultState);
export const MapEntityProvider = MapEntityContext.Provider;
export const MapEntityConsumer = MapEntityContext.Consumer;

export const MapEntityActions = that => ({
	saveToStorage() {
		if (storage) {
			const data = {
				timestamp: Date.now(),
				data: {
					...that.state.MapEntity,
					points: [...that.state.MapEntity.points?.values()]
				}
			};
			storage.set('session', null, data);
			return true;
		} else {
			return false;
		}
	},
	getMaps() {
		const { points, garbage } = that.state.MapEntity;
		return {
			points,
			garbage
		};
	},
	getPointById(id, lists) {
		lists = lists ? [].concat(lists) : null;
		const maps = this.getMaps();
		const mapKeys = Object.keys(maps).filter(key => lists ? lists.includes(key) : true);
		let point;
		
		for (let i = 0, ii = mapKeys.length; i < ii; i++) {
			const map = maps[mapKeys[i]];
			point = map.get(id);
			if (point) {
				break;
			}
		}

		return point;
	},
	// movePointToList() {},
	addPoints(points, cb) {
		console.log('Adding:', points);
		const maps = this.getMaps();

		const dirtyMaps = {};
		
		const updatedPoints = [];
		
		const pointsMap = [].concat(points).forEach(point => {
			const newPoint = Point(point);
			const belongsToMap = Object.keys(maps).find(mapKey => {
				const map = maps[mapKey];
				return map.get && map.get(newPoint.properties?.id);
			}) || newPoint.properties?.list;
			const map = maps[belongsToMap];
			if (map) {
				updatedPoints.push(newPoint);
				dirtyMaps[belongsToMap] = map;
				map.set(newPoint.properties?.id, newPoint);	
			}
		});
		
		that.setState({
			MapEntity: {
				...that.state.MapEntity,
				...dirtyMaps
			}
		}, () => {
			this.saveToStorage();
			cb && cb(updatedPoints);
		});
	},
	removePoints(points, cb) {
		console.log('Removing:', points);
		const toGarbage = [];
		const pointsMap = [].concat(points).reduce((map, point) => {
			const currentPoint = map.get(point.properties?.id);
			if (currentPoint) {
				point.properties = {...point.properties, list: 'garbage'};
				toGarbage.push(point);
				map.delete(point.properties?.id);
			}
			return map;
		}, that.state.MapEntity.points || new Map());
		that.setState({
			MapEntity: {
				...that.state.MapEntity,
				points: pointsMap,
			}
		}, () => {
			this.saveToStorage();
			this.addPoints(toGarbage);
			cb && cb(toGarbage);
		});
	}
});