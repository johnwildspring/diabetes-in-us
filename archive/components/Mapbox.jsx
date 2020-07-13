import React from 'react';
import MapboxGL from 'mapbox-gl';
 
MapboxGL.accessToken = 'pk.eyJ1Ijoiam9obndpbGRzcHJpbmciLCJhIjoiY2syYzVsMmtzMXNuZjNjbHNuZms0ajFubiJ9.hz1DXsYyRpM0kMzARKtXpg';

export const accessToken = MapboxGL.accessToken;

export const mapbox = MapboxGL;

class Mapbox extends React.Component {
	constructor(props) {
		super(props);
		this.className = props.className || '';
		this.sources = new Proxy({}, {
			set: (obj, prop, value) => {
				if (value.name && value.type && value.data) {
					obj[prop] = value;
					const name = value.name;
					delete value.name;
					const source = this.map.getSource(name);
					try {
						if (source) {
							source.setData(value.data)
						} else {
							this.map.addSource(name, value);
						}
					} catch(e) {
						console.warn('Issue adding source', e);
					}
				} else if (value.type === 'vector' && value.url) {
					const input = {
						type: 'vector',
						url: value.url,
					};

					const source = this.map.getSource(name);
					try {
						this.map.addSource(name, input);
					} catch(e) {
						console.warn('Issue adding source', e);
					}
				} else {
					console.warn('Cannot add source, missing properties.', value);
				}
				return true;
			}
		});
		this.sourceFunctions = Array.isArray(props.sources) ? props.sources : [];
		this.layerFunctions = Array.isArray(props.layers) ? props.layers : [];
		this.views = Array.isArray(props.views) ? props.views : [];
		this.viewInstances = new Map();
		this.images = Array.isArray(props.images) ? props.images : [];
		this.interactivity = Array.isArray(props.interactivity) ? props.interactivity : [];
		this.controllers = Array.isArray(props.controllers) ? props.controllers : [];

		this.standardCoord = props.standardCoord || false;

		this.container = React.createRef();

		this.state = {
			mapSetup: false
		};
	}

	get style() {
		return {
			width: this.props.width || '100%',
			height: this.props.height || '300px',
			cursor: this.props.cursor ? `${this.props.cursor}, auto` : 'auto'
		};
	}

	get ctx() {
		return this.props.ctx;
	}

	setupSources() {
		// this.sourceFunctions is an array of functions that define each source
		// each function, returns a source type object, with an additional name attr.
		/*
		{
			name: String,
			type: String,
			data: Object
		}
		*/
		// setupSources iterates each function, and takes its output and updates this.sources
		// this.sources is a Proxy with setter method to update the map sources

		const add = (sourcesObj, source) => {
			if (Array.isArray(source)) {
				return source.reduce((sourcesObj, source) => {
					return add(sourcesObj, source);
				}, sourcesObj);
			} else if (source) {
				this.sources[source.name] = source;
				return this.sources;
			}
		}
		
		[...this.sourceFunctions].filter(source => typeof source == 'function').map(source => source(this.ctx)).reduce((sourcesObj, source) => {
			return add(sourcesObj, source);
		}, this.sources);
	}

	setupLayers() {
		const add = (map, layer) => {
			if (Array.isArray(layer)) {
				return layer.reduce((map, layer) => {
					return add(map, layer);
				}, map)
			} else {
				if (!map.get(layer.id)) {
					this.map.addLayer(layer);
					map.set(layer.id, {...this.map.getLayer(layer.id), properties: {...layer.properties}});
				}
				return map;
			}
		}
		
		const layers = [...this.layerFunctions].filter(layer => typeof layer == 'function').map(layer => layer(this.ctx)).reduce((map, layer) => {
			return add(map, layer);
		}, this.layers || new Map());
		this.layers = layers;
	}

	setupViews() {
		const views = [...this.views].reduce((map, View) => {
			const instance = new View(this.map);
			instance.init && instance.init();
			map.set(instance.name, instance);
			return map;
		}, new Map());
		this.viewInstances = views;
	}

	setupImages() {
		const addImg = image => {
			return new Promise((resolve, reject) => {
				if (!image.added) {
					const img = document.createElement('img');
					img.src = image.data;
					img.onload = () => {
						resolve(image);
						this.map.addImage(image.name, img);
					};
					img.onerror = () => {
						resolve(image);
					};
					image.added = true;
				} else {
					resolve(image);
				}
			});	
		}

		return Promise.all(this.images.map(image => {
			return addImg(image);
		}))
			.then(images => {
				this.images = images;
			});
	}

	instantiateMap() {
		console.log(this, this.container);
		const config = {
			container: this.container.current,
			style: this.props.mapStyle || 'mapbox://styles/atlasunderscored/cjpumg0he0hct2srttri0k8tz',
			center: this.center || this.props.center || [0,0],
			maxZoom: 20,
			minZoom: 0,
			zoom: 15,
			pitch: 60,
			bearing: 0
		};
		if (this.standardCoord && Array.isArray(config.center)) {
			config.center = config.center.reverse(); 
		}
		this.map = new MapboxGL.Map(config);

		if (this.props['disable-zoom']) {
			this.map.scrollZoom.disable();
		}

		this.map.on('load', () => {
			if (!this.state.mapSetup) this.setupMap();
		});

		this.props.onInit && this.props.onInit(this.map);
	}

	setupMap() {
		this.setState({
			mapSetup: true
		});

		// Setup images.
		this.setupImages()
			.then(() => {
				// Setup sources.
				this.setupSources();

				// Setup layers.
				this.setupLayers();
			});

		// Setup views.
		this.setupViews();

		// Setup controllers.
		this.controllers.forEach(controller => {
			this.map.addControl(controller, controller.props && controller.props.position || 'top-right');
		});

		// Setup interactivity.
		this.interactivity.forEach(func => {
			// let init = func.bindTo || func.once;
			// init && init(this.map, this.ctx)
			return func.bindTo ? func.bindTo(this.map, this.ctx) : (func.once ? func.once(this) : null)
		});

		this.props.onSetup && this.props.onSetup(this.map);
	}

	updateMap() {
		if (this.state.mapSetup) {
			// Remove interactivity.
			this.interactivity.forEach(func => func.unbind && func.unbind());
			// Update sources.
			this.setupSources();
			// Add layers that are not existing. (Run setupLayers());
			this.setupLayers();
			// Re-add all interactivity.
			this.interactivity.forEach(func => func.bindTo && func.bindTo(this));
			// Re-init views.
			this.viewInstances.forEach(view => view.init && view.init());
			// Update view controller.
			const lastView = [...this.viewInstances.values()][0]
			lastView && lastView.controller && lastView.controller.currentView && lastView.controller.switchTo(lastView.controller.currentView);
			
			this.props.onUpdate && this.props.onUpdate(this.map);
		}
	}

	componentDidMount() {
		this.instantiateMap();
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.state.mapSetup && this.map.loaded()) {
			this.setupMap();
		} else if (this.state.mapSetup) {
			this.updateMap();
		}

		this.map.resize();
	}

	componentWillUnmount() {
		clearTimeout(this.delayedLoaderToggleTimeout);
		
		// Remove controllers.
		this.controllers.forEach(controller => {
			this.map.removeControl(controller);
		});

		// Remove interactivity.
		this.interactivity.forEach(func => func.unbind && func.unbind());

		this.map.remove();
	}

	render() {
		return (
			<div className={this.className} ref={this.container} style={this.style}>{this.props.children}</div>
		);
	}
}

export default Mapbox;