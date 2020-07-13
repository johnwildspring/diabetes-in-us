/** @jsx jsx */
import { jsx } from 'theme-ui';

export const HoverValue = ({ value }) => {
    console.log(value, value?.properties);
    return <div sx={{
        position: 'fixed',
        top: '10px',
        width: '100vw'
    }}>
        {value && value.properties && <div sx={{
            margin: '0 auto',
            width: '200px',
            background: 'white',
            borderRadius: '8px',
            display: 'flex',
            padding: '8px',
            flexDirection: 'column'
        }}>
            <p sx={{
                marginTop: 0,
                textAlign: 'center'
            }}>{value.properties.County}</p>
            <span sx={{
                textAlign: 'center'
            }}><b>Percentage:</b> {value.properties.percentage}%</span>
        </div>}
    </div>
}