/** @jsx jsx */
import { jsx } from 'theme-ui';

export const HoverValue = value => {
    return <div sx={{
        position: 'fixed',
        top: '10px',
        width: '100vw'
    }}>

        <div sx={{
            margin: '0 auto',
            width: '200px',
            background: 'white',
            borderRadius: '8px',
            display: 'flex',
            padding: '8px',
            flexDirection: 'column'
        }}>
            <p sx={{
                textAlign: 'center'
            }}>Hovered County</p>
            <div sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                {/* <span>{start}%</span>
                <div sx={{
                    background: 'linear-gradient(90deg, rgba(71,255,60,1) 0%, rgba(119,61,255,1) 100%)',
                    width: '100px',
                    flexGrow: 1,
                    marginX: '8px'
                }}></div>
                <span>{end}%</span> */}
            </div>
        </div>
    </div>
}