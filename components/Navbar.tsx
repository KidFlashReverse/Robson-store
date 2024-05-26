import Image from "next/image";
import HomeIcon from '../public/buttonsIcons/homeIcon.png';
import NotficationsIcon from '../public/buttonsIcons/notficationIcon.png';
import StorageIcon from '../public/buttonsIcons/storageIcon.png';
import SellersIcon from '../public/buttonsIcons/sellersIcon.png';
import PendingRequestsIcon from '../public/buttonsIcons/pendingRequestIcon.png';
import RequestsSentIcon from '../public/buttonsIcons/requestSentIcon.png';
import RequestsCompletedIcon from '../public/buttonsIcons/checkIcon.png';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { defaultText } from "../ts/constants";
import Tooltip from "./Tooltip";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../service/firebase";

export default function Navbar(){
    const router = useRouter();
    const pathname = router.pathname;
    const [buttonHover, setButtonHover] = useState('');
    const [notifications, setNotfications] = useState(0);

    const getNotifications = () => {
        getDocs(collection(db, 'notificacoes')).then((query) => {
            const data = query.docs.map((doc) => {return doc.data()});
            let falseNumber = 0;

            data.map((doc) => {
                if(doc.view === false){
                    falseNumber += 1;
                }
            })

            setNotfications(falseNumber);
        }).catch((e) => console.log(e));
    };

    useEffect(() => {
        if(!notifications){
            getNotifications();
        }
    }, [notifications]);

    return (
        <div style={{
            width: '100%',
            backgroundColor: '#F0F0F0',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
        }}>
            <div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '60%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'dashboard' || pathname === '/' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('dashboard')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/')}
                >
                    <Image src={HomeIcon} width={30} alt="Página Principal" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'dashboard' ? 
                        <Tooltip 
                            nameButton="Home"
                        />
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '30%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'notificacoes' || pathname === '/notificacoes' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('notificacoes')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/notificacoes')}
                >
                    <Image src={NotficationsIcon} width={30} alt="Página de Notificações" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'notificacoes' ? 
                        <Tooltip 
                            nameButton="Notificações"
                        />
                    : <></>}
                    {notifications != 0 ? 
                        <div style={{
                            ...defaultText,
                            position: 'absolute',
                            width: '15px',
                            height: '15px',
                            marginLeft: '30px',
                            marginTop: '20px',
                            borderRadius: '100%',
                            backgroundColor: 'red',
                            color: 'white',
                            fontSize: '0.7em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {notifications}
                        </div>
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '30%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'estoque' || pathname === '/estoque' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('estoque')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/estoque')}
                >
                    <Image src={StorageIcon} width={30} alt="Página do Estoque" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'estoque' ? 
                        <Tooltip 
                            nameButton="Estoque"
                        />
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '30%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'vendedores' || pathname === '/vendedores' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('vendedores')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/vendedores')}
                >
                    <Image src={SellersIcon} width={30} alt="Página dos Vendedores" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'vendedores' ? 
                        <Tooltip 
                            nameButton="Vendedores"
                        />
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '30%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'pendentes' || pathname === '/pendentes' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('pendentes')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/pendentes')}   
                >
                    <Image src={PendingRequestsIcon} width={30} alt="Página dos Pedidos Pendentes" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'pendentes' ? 
                        <Tooltip 
                            nameButton="Pendentes"
                        />
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '30%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'enviados' || pathname === '/enviados' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('enviados')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/enviados')}
                >
                    <Image src={RequestsSentIcon} width={30} alt="Página dos Pedidos Enviados" />
                    {buttonHover === 'enviados' ? 
                        <Tooltip 
                            nameButton="Enviados"
                        />
                    : <></>}
                </div>
                <div 
                    style={{
                        width: '65px',
                        height: '65px',
                        marginTop: '130%',
                        borderRadius: '100%',
                        backgroundColor: buttonHover === 'concluidos' || pathname === '/concluidos' ? '#E5E5E5' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.5s all'
                    }}
                    onMouseEnter={() => setButtonHover('concluidos')}
                    onMouseLeave={() => setButtonHover('')}
                    onClick={() => window.location.replace('/concluidos')}
                >
                    <Image src={RequestsCompletedIcon} width={30} alt="Página dos Pedidos Concluídos" style={{filter: 'invert(15%)'}} />
                    {buttonHover === 'concluidos' ? 
                        <Tooltip 
                            nameButton="Concluídos"
                        />
                    : <></>}
                </div>
            </div>
        </div>
    );
}
