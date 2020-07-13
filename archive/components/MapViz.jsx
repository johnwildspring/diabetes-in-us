import React from 'react';
import Mapbox from './Mapbox.jsx';

export class MapViz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			hoveringEntity: false, // Triggered by hovering over an entity.
			// deletingEntity: false, // Handled by the URL routing state.
			// editingEntity: false, // Handled by the URL routing state.
			map: null
		};
    }

    get mapProps() {
		const { hoveringEntity } = this.state;
		const that = this;

		return {
			width: '100%',
			height: '100%',
			center: [40.711414, -74.008958].reverse(),
			mapStyle: 'mapbox://styles/mapbox/light-v9',
			// cursor: hoveringEntity ? 'url(/assets/pencil.svg) 0 48' : 'url(/assets/pin.svg) 14 39',
			// images: [
			// 	{
			// 		name: 'pin',
			// 		data: '/assets/pin.svg'
			// 	},
			// 	{
			// 		name: 'pin-inactive',
			// 		data: '/assets/pin-inactive.svg'
			// 	},
			// 	{
			// 		name: 'pin-highlight',
			// 		data: '/assets/pin-highlight.svg'
			// 	},
			// 	{
			// 		name: 'pin-inactive-highlight',
			// 		data: '/assets/pin-inactive-highlight.svg'
			// 	},
			// 	{
			// 		name: 'pin-halo',
			// 		data: '/assets/pin-halo.svg'
			// 	},
			// 	{
			// 		name: 'pin-inactive-halo',
			// 		data: '/assets/pin-inactive-halo.svg'
			// 	},
			// ],
			sources: [
				// {
                //     name: 'diabetes-us',
                //     type: 'vector',
                //     url: `mapbox://johnwildspring.diabetes-us`
                // }
			],
			layers: [
				// () => Points({
				// 	id: 'points',
				// 	source: 'points',
				// 	'icon-image': [
				// 		'case',
				// 			['==', ['to-boolean', ['get', 'editing']], true], 'pin-halo',
				// 			['==', ['to-boolean', ['get', 'hovering']], true], 'pin-highlight',
				// 			'pin'
				// 	]
				// }),
				// () => Points({
				// 	id: 'garbage',
				// 	source: 'garbage',
				// 	'icon-image': [
				// 		'case',
				// 			['==', ['to-boolean', ['get', 'editing']], true], 'pin-inactive-halo',
				// 			['==', ['to-boolean', ['get', 'hovering']], true], 'pin-inactive-highlight',
				// 			'pin-inactive'
				// 	]
				// })
			],
			onInit: map => {
				that.setState({
					map
				});
			},
			interactivity: [
				// {
				// 	onClick(e, ctx) {
				// 		const { hoveringEntity } = that.state;
				// 		if (e.lngLat) {
				// 			const point = {
				// 				type: 'Feature',
				// 				geometry: {
				// 					type: 'Point',
				// 					coordinates: [e.lngLat.lng, e.lngLat.lat] 
				// 				}
				// 			};
				// 			if (!hoveringEntity) {
				// 				ctx.addPoints && ctx.addPoints(point, (updatedPoints = []) => {
				// 					that.editEntity(updatedPoints[0].properties?.id, ctx);
				// 				});	
				// 			} else {
				// 				that.editEntity(hoveringEntity, ctx);
				// 			}						
				// 		}			
				// 	},
				// 	once(mapbox) {
				// 		this.map = mapbox.map;
				// 		this.map.on('click', e => this.onClick(e, mapbox.ctx));
				// 	},
				// 	unbind() {
				// 		this.map && this.map.off('click', this.onClick);
				// 	}
				// },
				// {
				// 	onHover(e, ctx) {
				// 		const { featureSensitivity: sensitivity = 5 } = that.configurations;
				// 		const bbox = [[e.point.x - sensitivity, e.point.y - sensitivity], [e.point.x + sensitivity, e.point.y + sensitivity]];
				// 		const points = this.map.queryRenderedFeatures(bbox, { layers: ['points'] });
				// 		const garbage = this.map.queryRenderedFeatures(bbox, { layers: ['garbage'] });
				// 		const features = [...points, ...garbage].map(point => {
				// 			return ctx.points.get(point.properties?.id) || ctx.garbage.get(point.properties?.id);
				// 		}).filter(feat => !!feat);

				// 		that.hoverEntity(features[0]?.properties?.id, ctx);
				// 	},
				// 	once(mapbox) {
				// 		this.map = mapbox.map;
				// 		this.map.on('mousemove', e => this.onHover(e, mapbox.ctx));
				// 	},
				// 	unbind() {
				// 		this.map && this.map.off('mousemove', this.onHover);
				// 	}
				// },
				// {
				// 	onRightClick(e, ctx) {
				// 		const { hoveringEntity } = that.state;
				// 		if (hoveringEntity) {
				// 			const feature = ctx.points?.get(hoveringEntity);
				// 			that.deleteEntity(hoveringEntity, ctx);
				// 		}
				// 	},
				// 	once(mapbox) {
				// 		this.map = mapbox.map;
				// 		this.map.on('contextmenu', e => this.onRightClick(e, mapbox.ctx));
				// 	},
				// 	unbind() {
				// 		this.map && this.map.off('contextmenu', this.onRightClick);
				// 	}
				// },
			]
		};
	}

    render() {
        const { mapProps } = this;

        return (
            <div className="MapMaker">
                <Mapbox {...mapProps} />
            </div>
        )
    }
}