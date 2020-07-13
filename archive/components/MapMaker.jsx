import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Mapbox from './Mapbox.jsx';
import { Loader } from './Loader.jsx';

import { EntityEditor } from './EntityEditor.jsx';
import { Steps } from './Steps.jsx';
import { WarningModal } from './WarningModal.jsx';

import { MapEntityConsumer } from 'contexts/MapEntity';

import { Points } from './MapLayers/Points';

import './MapMaker.sass';

export class MapMaker extends React.Component {
	constructor(props) {
		super(props);

		this.configurations = {
			featureSensitivity: 1 // bbox
		};

		this.state = {
			hoveringEntity: false, // Triggered by hovering over an entity.
			// deletingEntity: false, // Handled by the URL routing state.
			// editingEntity: false, // Handled by the URL routing state.
			map: null
		};
	}

	hoverEntity = (id, ctx) => {
		id = id || false;
		if (id !== this.state.hoveringEntity) {
			console.log('Hovering:', id);
			this.setState({
				hoveringEntity: id || false
			});
		}
	}

	editEntity = (id, ctx) => {
		const { rootRouter: { history, match: { rootPath } } } = this.uiProps;

		if (ctx.getPointById(id)) {
			history.push(`${rootPath}/edit/${id}`);
		}
	}

	deleteEntity = (id, ctx) => {
		const { rootRouter: { history, match: { rootPath } } } = this.uiProps;

		if (ctx.getPointById(id)) {
			history.push(`${rootPath}/delete/${id}`);
		}
	}

	addStateDrivenProperties(features = []) {
		const { 
			entityState: {
				hoveringEntity,
				editingEntity
			} 
		} = this.uiProps;
		const entities = new Map(features.map(feature => [feature.properties?.id, feature]));
	
		if (hoveringEntity) {
			const entity = {...entities.get(hoveringEntity)};
			if (entity.type) {
				entity.properties = {
					...entity.properties,
					hovering: true
				};
				entities.set(hoveringEntity, entity);
			}
		}

		if (editingEntity) {
			const entity = {...entities.get(editingEntity)};
			if (entity.type) {
				entity.properties = {
					...entity.properties,
					editing: true
				};
				entities.set(editingEntity, entity);
			}
		}

		return [...entities.values()];
	}

	get entityState() {
		const { 
			router: { 
				match: { 
					params 
				} 
			} 
		} = this.props;

		return {
			deletingEntity: params.action == 'delete' ? params.id || false : false,
			editingEntity: params.action == 'edit' ? params.id || false : false,
		}
	}

	get uiProps() {
		const {
			router
		} = this.props;

		const {
			map
		} = this.state;

		const rootPath = (() => {
			const path = router?.match?.path;
			if (path) {
				const match = path.match(/(\/.+?)\//);
				return match && match.length > 1 ? match[1] : '/';
			} else {
				return '/';
			}
		})();

		return {
			map,
			rootRouter: {
				...router,
				match: {
					...router?.match,
					rootPath
				}
			},
			entityState: {
				hoveringEntity: this.state.hoveringEntity,
				...this.entityState
			}
		}
	}

	get mapProps() {
		const { hoveringEntity } = this.state;
		const that = this;

		return {
			width: '100%',
			height: '100%',
			center: [40.711414, -74.008958].reverse(),
			mapStyle: 'mapbox://styles/atlasunderscored/cjsb7jg8o0oxp1fp8dkk1hyr8',
			cursor: hoveringEntity ? 'url(/assets/pencil.svg) 0 48' : 'url(/assets/pin.svg) 14 39',
			images: [
				{
					name: 'pin',
					data: '/assets/pin.svg'
				},
				{
					name: 'pin-inactive',
					data: '/assets/pin-inactive.svg'
				},
				{
					name: 'pin-highlight',
					data: '/assets/pin-highlight.svg'
				},
				{
					name: 'pin-inactive-highlight',
					data: '/assets/pin-inactive-highlight.svg'
				},
				{
					name: 'pin-halo',
					data: '/assets/pin-halo.svg'
				},
				{
					name: 'pin-inactive-halo',
					data: '/assets/pin-inactive-halo.svg'
				},
			],
			sources: [
				ctx => {
					return {
						name: 'points',
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: that.addStateDrivenProperties(ctx.points ? [...ctx.points.values()] : [])
						}
					}
				},
				ctx => {
					return {
						name: 'garbage',
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: that.addStateDrivenProperties(ctx.garbage ? [...ctx.garbage.values()] : [])
						}
					}
				}
			],
			layers: [
				() => Points({
					id: 'points',
					source: 'points',
					'icon-image': [
						'case',
							['==', ['to-boolean', ['get', 'editing']], true], 'pin-halo',
							['==', ['to-boolean', ['get', 'hovering']], true], 'pin-highlight',
							'pin'
					]
				}),
				() => Points({
					id: 'garbage',
					source: 'garbage',
					'icon-image': [
						'case',
							['==', ['to-boolean', ['get', 'editing']], true], 'pin-inactive-halo',
							['==', ['to-boolean', ['get', 'hovering']], true], 'pin-inactive-highlight',
							'pin-inactive'
					]
				})
			],
			onInit: map => {
				that.setState({
					map
				});
			},
			interactivity: [
				{
					onClick(e, ctx) {
						const { hoveringEntity } = that.state;
						if (e.lngLat) {
							const point = {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: [e.lngLat.lng, e.lngLat.lat] 
								}
							};
							if (!hoveringEntity) {
								ctx.addPoints && ctx.addPoints(point, (updatedPoints = []) => {
									that.editEntity(updatedPoints[0].properties?.id, ctx);
								});	
							} else {
								that.editEntity(hoveringEntity, ctx);
							}						
						}			
					},
					once(mapbox) {
						this.map = mapbox.map;
						this.map.on('click', e => this.onClick(e, mapbox.ctx));
					},
					unbind() {
						this.map && this.map.off('click', this.onClick);
					}
				},
				{
					onHover(e, ctx) {
						const { featureSensitivity: sensitivity = 5 } = that.configurations;
						const bbox = [[e.point.x - sensitivity, e.point.y - sensitivity], [e.point.x + sensitivity, e.point.y + sensitivity]];
						const points = this.map.queryRenderedFeatures(bbox, { layers: ['points'] });
						const garbage = this.map.queryRenderedFeatures(bbox, { layers: ['garbage'] });
						const features = [...points, ...garbage].map(point => {
							return ctx.points.get(point.properties?.id) || ctx.garbage.get(point.properties?.id);
						}).filter(feat => !!feat);

						that.hoverEntity(features[0]?.properties?.id, ctx);
					},
					once(mapbox) {
						this.map = mapbox.map;
						this.map.on('mousemove', e => this.onHover(e, mapbox.ctx));
					},
					unbind() {
						this.map && this.map.off('mousemove', this.onHover);
					}
				},
				{
					onRightClick(e, ctx) {
						const { hoveringEntity } = that.state;
						if (hoveringEntity) {
							const feature = ctx.points?.get(hoveringEntity);
							that.deleteEntity(hoveringEntity, ctx);
						}
					},
					once(mapbox) {
						this.map = mapbox.map;
						this.map.on('contextmenu', e => this.onRightClick(e, mapbox.ctx));
					},
					unbind() {
						this.map && this.map.off('contextmenu', this.onRightClick);
					}
				},
			]
		};
	}

	render() {
		const { 
			mapProps,
			uiProps
		} = this;

		const { 
			map,
			rootRouter: { 
				history,
				match: { 
					rootPath 
				} 
			},
			entityState: {
				hoveringEntity,
				editingEntity,
				deletingEntity
			}
		} = uiProps;

		return (
			<MapEntityConsumer>
				{mapEntityCtx => {
					const ctx = {...mapEntityCtx.state, ...mapEntityCtx.actions};
					return (
						<div className="MapMaker">
							<Mapbox {...mapProps} ctx={ctx} uiProps={uiProps} />

							{
								map ?
									<div className="Panel unclickable">	
										<Switch>
											<Route path={`${rootPath}/edit/:id`} render={router => <EntityEditor ctx={ctx} router={router} uiProps={uiProps} /> } />
										</Switch>
									</div>
									:
									<div className="MapLoader vertical-align width-100">
										<Loader text="Please wait while we load the map." className="margin-center" />
									</div>
							}

							<Steps ctx={ctx} uiProps={uiProps} />
							<Route path={`${rootPath}/delete/:id`} render={() => {
								const point = ctx.getPointById(deletingEntity, 'points');
								if (point) {
									console.log('Deleting:', deletingEntity);
									return (<WarningModal 
										largeText="Deleting Pin"
										warningText="You will only be able to restore the data in this session only and it will be lost when you leave."
										negative="Cancel"
										onClose={() => history.push(rootPath)}
										affirmative="Delete"
										onAffirm={() => {
											ctx.removePoints(ctx.getPointById(deletingEntity), (toGarbage = []) => {
												this.hoverEntity(false, ctx);
												history.push(rootPath);
											});
										}}
									/>)
								} else {
									return <Redirect to={rootPath} />
								}
							}}/>

							{ctx.saving && <Loader text="Saving" className="StatusLoader" />}
						</div>
					)
				}}
			</MapEntityConsumer>
			
		)
	}
}
