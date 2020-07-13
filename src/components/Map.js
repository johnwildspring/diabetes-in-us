/** @jsx jsx */
import { jsx } from 'theme-ui';
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN
});

export const MapComponent = () => {
    return <Map
        // eslint-disable-next-line react/style-prop-object
        style='mapbox://styles/mapbox/light-v9'
        center={[-104.984, 51.558]}
        zoom={[2.35]}
        containerStyle={{
            height: '100vh',
            width: '100vw'
        }}
    >
        <Source id="diabetes-us" tileJsonSource={{
            type: 'vector',
            url: `mapbox://johnwildspring.diabetes-us`
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
    </Map>;
};