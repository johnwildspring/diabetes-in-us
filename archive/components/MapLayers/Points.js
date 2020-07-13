export const Points = config => ({
	'id': config.id,
	'type': 'symbol',
	'source': config.source,
	'layout': {
		'icon-image': config['icon-image'],
		'icon-size': 1,
		'icon-allow-overlap': true,
		'icon-anchor': 'bottom',
	}
})