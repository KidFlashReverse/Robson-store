import Image from "next/image";
import ErrorIcon from '../public/buttonsIcons/ErrorIcon.svg';
import { defaultText } from "../ts/constants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Alert({
    alertBoolean,
    setAlertBoolean,
    alertMessage,
    isError,
}: {
    alertBoolean: boolean,
    setAlertBoolean: Dispatch<SetStateAction<boolean>>,
    alertMessage: string,
    isError: boolean,
}){
    const [animation, setAnimation] = useState('0.8s linear errorAnimation');

    useEffect(() => {
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimationExit');
        }, 5000);
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimation');
            setAlertBoolean(false);
        }, 5500)
    }, [alertBoolean]);

    return (
        <div style={{
            position: 'absolute',
            paddingLeft: '15px', 
            paddingRight: '15px',
            borderRadius: '15px 0px 0px 15px',
            width: 'auto',
            height: '40px',
            backgroundColor: '#f44336',
            display: alertBoolean ? 'flex' : 'none',
            alignItems: 'center',
            right: 0,
            top: 30,
            animation: animation,
        }}> 
            {isError ? 
                <Image src={ErrorIcon} width={25} height={25} alt='Error' />
            : <></>}
            <p style={{...defaultText, marginLeft: '10px', color: 'black'}}>{alertMessage}</p>
        </div>
    );
}