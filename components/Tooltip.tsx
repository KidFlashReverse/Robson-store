import { defaultText } from "../ts/constants"

export default function Tooltip({nameButton}:{nameButton: string}){
    return (
        <div style={{
            ...defaultText,
            position: 'absolute',
            fontSize: '0.7em',
            marginLeft: '0px',
            marginBottom: '80px',
            backgroundColor: 'grey',
            color: 'white',
            opacity: '0',
            padding: '5px',
            borderRadius: '5px',
            animation: 'TooltipAnimation 0.2s forwards',
            animationDelay: '0.2s'
        }}>
            {nameButton}
        </div>
    );
}