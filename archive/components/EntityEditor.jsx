import React from 'react';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';

import { Button } from './Atoms/Button.jsx';
import { Tag } from './Atoms/Tag.jsx';
// import { Close } from './Atoms/Close.jsx';
import { Lock } from './Atoms/Lock.jsx';

import { WarningModal } from './WarningModal.jsx';

import './EntityEditor.sass';

class MapItemProperties {
	constructor(id, properties = {}) {
		this.id = id;
		this.properties = Object.keys(properties).map(key => { // need to add mongo validation
			return [key, properties[key]];
		});
	}
};

class FocusWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.el = React.createRef();
	}

	componentDidMount() {
		this.el?.current?.focus && this.el?.current?.focus();
	}

	render() {
		const { children } = this.props;
		return children(this.el);
	}
}

const dataTypes = Immutable.OrderedMap([
	['text', {
		display: 'Aa'
	}], // string
	['number', {
		display: '123'
	}], // float
	['list', {
		image: '/assets/list.svg'
	}], // array
	['images', {
		image: '/assets/image.svg'
	}], // array of image urls
	['files', {
		image: '/assets/file.svg'
	}], // a file, up to 2mb
	['link', {
		image: '/assets/link.svg'
	}] // string representing a url
]);

const PropertyNameInput = React.forwardRef((props, ref) => {
	const {
		name,
		setName
	} = props;

	return <input className="Input" value={name || ''} onChange={e => setName(e.target.value)} ref={ref} />	
});

const PropertyValueInput = React.forwardRef((props, ref) => {
	const {
		data,
		setData
	} = props;

	return <input className="Input" value={data.value || ''} onChange={e => setData({...data, value: e.target.value})} ref={ref} />;
});

const DataTypePicker = props => {
	const {
		data,
		setData
	} = props;

	return (
		<div className="DataTypePicker vertical-align">
			{props.children} {/* Eventually, this should be a dropdown and the plus should be within it. */}
			<select value={data.type || ''} onChange={e => setData({...data, type: e.target.value})}>
				<option value="" disabled>Select a data type</option>
				{[...dataTypes.keys()].map(type => <option key={type} value={type}>{type}</option>)}
			</select>
		</div>
	);
};

const PropertyEntry = props => {
	// A PropertyEntry row.
	// if !dataType, show DataTypePicker
	// if dataType, show PropertyNameInput and PropertyValueInput, with type changer

	const { 
		entry,
		entry: {
			name,
			data,
			validationErrors
		},
		deleteProperty,
		setProperty
	} = props;
	return (
		<div className="PropertyEntry spacer-bottom-1 vertical-align">
			{
				!data.type ?
					<React.Fragment>
						<DataTypePicker name={name} data={data} setData={data => setProperty(props.index, {...entry, data})}>
							<img src="/assets/plus.svg" />
						</DataTypePicker>
					</React.Fragment>
					:
					<FocusWrapper>
						{ref => (
							<React.Fragment>
								<img src="/assets/minus.svg" onClick={() => deleteProperty(props.index)}/>
								<PropertyNameInput ref={!name && ref} name={name} setName={name => setProperty(props.index, {...entry, name})} /><span className="spacer-left-1 spacer-right-1">:</span>
								<PropertyValueInput ref={name && !data.value && ref} name={name} data={data} setData={data => setProperty(props.index, {...entry, data})} />
								<DataTypePicker name={name} data={data} setData={data => setProperty(props.index, {...entry, data})} />
							</React.Fragment>
						)}
					</FocusWrapper>
				
			}
		</div>
	)
};

const PropertyList = props => {
	const { 
		properties,
		setProperty,
		deleteProperty
	} = props;

	return (
		<div className="PropertyList spacer-bottom-2">
			{properties.map((entry, index) => <PropertyEntry deleteProperty={deleteProperty} setProperty={setProperty} entry={entry} key={index} index={index} />)}
		</div>
	)
};

const CommonProperties = props => {
	const { 
		properties,
		setProperty
	} = props;

	const newProperty = properties[properties.length - 1];

	const list = [
		['name', 'text'],
		['description', 'text'],
		['price', 'number'],
		['images', 'images']
	];

	return (
		<div className="CommonProperties">
			{
				props.propertyExists ?
				<p className="spacer-bottom-2">Quick add:</p>
				:
				<h3 className="spacer-bottom-2">Or, here are some common properties you can choose from:</h3>
			}
			<div>
				{list.map(item => <Tag className="Property big spacer-bottom-1" key={item[0]} text={item[0]} onClick={() => {
					setProperty(properties.length-1, {
						...newProperty, 
						name: item[0],
						data: {
							...newProperty.data,
							type: item[1]
						}
					})
				}} />)}
			</div>
		</div>
	)
};

export class EntityEditor extends React.Component {
	constructor(props) {
		super(props);

		const properties = (() => {
			const keys = Object.keys(props.properties || {});
			const propertyList = keys.reduce((arr, key) => {
				const propertyEntry = {
					name: key,
					data: props.property[key],
					validationErrors: []
				};
				arr.push(propertyEntry);
				return arr;
			}, []);
			if (propertyList.length == 0) {
				propertyList.push(this.emptyProperty);
			}
			return propertyList;
		})();

		this.state = {
			properties,
			locked: properties.length > 1 || properties[0]?.data?.type,
			warning: null
		}
	}

	get propertyExists() {
		const { properties } = this.state;
		return properties.length > 1 || properties[0]?.data?.type;
	}

	get emptyProperty() {
		return {
			name: null,
			data: {
				type: null,
				value: null
			},
			validationErrors: []
		};
	}

	toggleLock = () => {
		this.setState({
			locked: !this.state.locked
		});
	}

	setPoint(prevProps) {
		const {
			ctx,
			ctx: {
				getPointById
			},
			uiProps: {
				map,
				rootRouter: {
					history,
					match: {
						rootPath
					}
				}
			}
		} = this.props;

		const id = this.props.router?.match?.params?.id;
		if (prevProps) {
			const lastId = prevProps.router?.match?.params?.id;
			if (lastId == id) {
				return false;
			}
		}
		const point = getPointById.call(ctx, id);
		if (point) {
			this.setState({
				point
			}, () => {
				console.log('Editing:', point);
				const coordinates = point.geometry?.coordinates;
				coordinates && map.panTo({
					lng: coordinates[0],
					lat: coordinates[1]
				});
			});
		} else {
			history.push(rootPath);
		}
	}

	componentDidMount() {
		this.setPoint();
	}

	componentDidUpdate(prevProps) {
		this.setPoint(prevProps);
	}

	deleteProperty = index => {
		const properties = [...this.state.properties];
		properties.splice(index, 1);
		this.setState({
			properties
		});
	}

	setProperty = (index, property) => {
		const properties = [...this.state.properties]; 
		const currentProperty = {...properties[index]};
 
		if (index == this.state.properties.length-1) {
			properties.push(this.emptyProperty);
		}

		if (property.data?.value && property.data?.type !== currentProperty.data?.type) {
			// Data type has changed so set the property with an empty data value
			properties[index] = {...currentProperty, ...{
				...property, 
				data: {
				...property.data,
				value: null
			}}};
			const warning = <WarningModal 
				largeText={`Changing data type to: ${property.data?.type}`}
				warningText="You'll lose the current value of this data property if you change types."
				negative="Cancel"
				onClose={() => this.setState({warning: null})}
				affirmative="Change"
				onAffirm={() => this.setState({
					warning: null,
					properties
				}, () => {
					console.log(this.state);
				})}
			/>;
			this.setState({
				warning
			});
		} else {
			// Set the property with new attributes
			properties[index] = {...currentProperty, ...property};
			this.setState({
				properties
			}, () => {
				console.log(this.state);
			});
		}


		return property;
	}

	render() {
		const { 
			router: {
				history
			},
			uiProps: { 
				rootRouter: {
					match: {
						rootPath
					}
				}
			} 
		} = this.props;

		const { 
			properties,
			locked,
			warning
		} = this.state;

		const {
			propertyExists,
			setProperty,
			deleteProperty,
			toggleLock
		} = this;

		const propsForChildren = {
			properties,
			propertyExists,
			locked,
			deleteProperty,
			setProperty
		};

		return (
			<div className="EntityEditor clickable">
				<div className="distribute spacer-bottom-2">
					{/* <Lock locked={locked} onClick={toggleLock} /> */}
					{/* <Close onClick={() => history.push(rootPath)} /> */}
				</div>
				<h2>{propertyExists ? `Data Properties:` : `Let's add some data:`}</h2>
				<PropertyList {...propsForChildren} />
				<CommonProperties {...propsForChildren} />
				<div className="spacer-top-1">
					<Button onClick={() => history.push(rootPath)}>Cancel</Button>
					<Button className="Primary" onClick={() => history.push(rootPath)}>Save</Button>
				</div>
				{warning}
			</div>
		)
	}
}