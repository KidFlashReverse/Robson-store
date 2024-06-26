import Head from "next/head";
import { defaultText, defaultTitle, fullDate } from "../../ts/constants";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebase";
import getAllData from "../../service/getAllData";
import { Notifications, Pedido, Usuario } from "../../ts/interfaces";

export default function Notificacoes(){
    const [notifications, setNotifications] = useState<Array<Notifications>>();
    const [pedidos, setPedidos] = useState<Array<Pedido>>();
    const [usuarios, setUsuarios] = useState<Array<Usuario>>();
    const [loading, setLoading] = useState(false);

    const getUserFromPedido = (notification: Notifications) => {
        const pedido = pedidos?.find((value) => value.id === notification.codigoPedido); 

        return usuarios?.find((value) => value.id === pedido?.id_usuario)?.nome;
    }

    const replaceForState = (id: string) => {
        const pedido = pedidos?.find((value) => value.id === id);
        
        window.location.replace(`/${pedido?.estado}s?id=${id}`);
    }

    useEffect(() => {
        if(!notifications && !pedidos && !usuarios){
            getAllData('notificacoes', setNotifications);
            getAllData('users', setUsuarios);
            getAllData('pedidos', setPedidos);
        }
        if(notifications){
            notifications.map((value) => {
                if(value.view === false){
                    const docRef = doc(db, 'notificacoes', value.id);
    
                    updateDoc(docRef, {
                        view: true,
                    });
                }
            });
            
            notifications.sort((a, b) => {
                if(a.timestamp.seconds > b.timestamp.seconds){
                    return 1;
                }
                if(a.timestamp.seconds < b.timestamp.seconds){
                    return -1;
                }

                return 0;
            });
        }
    }, [notifications]);
    return (
        <>
            <Head>
                <title>Notificações</title>
            </Head>

            <div style={{
                width: '98%',
                display: 'flex',
                justifyContent: 'space-between',
                transition: '0.5s all'
            }}>
                <h1 style={{...defaultTitle}}>Notificações</h1>
            </div>

            <div style={{
                position: 'relative',
                top: '40px',
                width: '98%',
                height: '80%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                overflowY: 'auto',
            }}>
                {notifications?.map((value) => {
                    return (
                        <>
                            <div 
                                key={value.id}
                                style={{
                                    height: '60px',
                                    width: '50%',
                                    borderRadius: '15px',
                                    backgroundColor: '#F0F0F0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '1.2em',
                                    paddingLeft: '5%',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {replaceForState(value.codigoPedido)}}
                            >
                                {value.view === false ? 
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        position: 'absolute',
                                        ...defaultText,
                                        fontSize: '1em',
                                        color: 'white',
                                        backgroundColor: 'red',
                                        borderRadius: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        left: '18%',
                                        cursor: 'default',
                                    }}>
                                        !
                                    </div>
                                : <></>}

                                <p style={{...defaultText}}>Nova compra de <b>{getUserFromPedido(value)}</b></p>
                                <p style={{...defaultText, fontSize: '0.5em', marginRight: '15px', marginTop: '30px'}}>{fullDate(value.timestamp)}</p>
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    );
}