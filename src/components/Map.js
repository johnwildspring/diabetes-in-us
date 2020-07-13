/** @jsx jsx */
import { useState } from 'react';
import { jsx } from 'theme-ui';
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN
});

export const MapComponent = ({ hovered, setHover }) => {
    const [ center ] = useState([-104.984, 51.558]);
    const [ zoom ] = useState([2.35]);

    const changeHover = (map, event) => {
        const { point } = (event || {});

        const [ feature ] = map
            .queryRenderedFeatures(point, { layers: ['diabetes-us'] });

        if (feature?.properties?.CountyFIPS !== hovered?.properties?.CountyFIPS) {
            setHover(feature || null);
        }
    };

    return <Map
        // eslint-disable-next-line react/style-prop-object
        style='mapbox://styles/mapbox/light-v9'
        center={center}
        zoom={zoom}
        containerStyle={{
            height: '100vh',
            width: '100vw'
        }}
        onMouseMove={changeHover}
        onSourceData={(map) => {
            const { layers } = map.getStyle();
            // console.log(layers);
            const firstSymbol = layers.find(({ type }) => type === 'symbol');
            const allOurLayers = [
                'diabetes-us',
                'hovered-outline',
                'hovered-shadow'
            ].map(ea => layers.find(({id}) => id === ea));
            if (allOurLayers.every(ea => !!ea)) {
                allOurLayers.forEach(ea => {
                    map.moveLayer(ea.id, firstSymbol.id);
                });
            }    
        }}
    >
        <Source id="diabetes-us" tileJsonSource={{
            type: 'vector',
            url: `mapbox://johnwildspring.diabetes-us`
        }} />
        <Source id="hovered" geoJsonSource={{
            type: 'geojson',
            data: hovered
        }} />
        <Layer type="fill" id="diabetes-us" paint={{
            'fill-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false], 'black',
                ['==', ['get', 'percentage'], null], 'black',
                ['interpolate', ['linear'], ['get', 'percentage'], 0, 'rgb(71,255,60)', 33, 'rgb(119,61,255)'],
            ],
            'fill-opacity': [
                'case',
                // ...(this.args.show_null === undefined ? [['!', ['has', 'percentage']], 0] : []),
                ['boolean', ['feature-state', 'hover'], false], 1,
                0.7,
            ]              
        }} sourceId="diabetes-us" sourceLayer="diabetes-us" />
        <Layer
            id="hovered-outline"
            sourceId="hovered"
            type="line"
            paint={{
                "line-color": "#FFFFFF",
                "line-width": 2
            }}
        />
        <Layer 
            id="hovered-shadow"
            sourceId="hovered"
            type="line"
            paint={{
                "line-color": "#FFFFFF",
                "line-width": 10,
                "line-blur": 10,
                "line-opacity": 1
            }}
        />
    </Map>;
};