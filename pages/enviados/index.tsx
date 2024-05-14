import { useEffect, useState } from "react";
import { defaultText, defaultTitle } from "../../ts/constants"
import { Pedido, Produto, Usuario } from "../../ts/interfaces";
import { Timestamp, collectionGroup, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebase";
import getAllData from "../../service/getAllData";
import dayjs from "dayjs";
import Loading from "../../components/Loading";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import Pedidos from "../../components/Pedidos";
import PedidoModal from "../../components/PedidoModal";
import Alert from "../../components/Alert";

export interface ProdutoPedido extends Produto{
    totalQuantity: number,
    totalPrice: number
}
export interface SelectedPedido {
    id: string,
    nome: string,
    date: Timestamp,
    produtos: any,
    totalPrice: number,
}

export default function PedidosEnviados({
    userName
}: InferGetServerSidePropsType<typeof getServerSideProps>){
    const date = new Date();
    const [pedidos, setPedidos] = useState<Array<Pedido>>();
    const [produtos, setProdutos] = useState<Array<Produto>>();
    const [usuarios, setUsuarios] = useState<Array<Usuario>>();
    const [search, setSearch] = useState(userName || '');
    const [loading, setLoading] = useState(false);
    const [pedidoModal, setPedidoModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<SelectedPedido>();
    const [alertBoolean, setAlertBoolean] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const getUsuarios = () => {
        const dbRef = collectionGroup(db, 'users');

        getDocs(dbRef).then((query) => {
            const data: any = query.docs.map((doc) => {return {id: doc.id, ...doc.data()}})

            setUsuarios(data.filter((doc: Usuario) => !doc.isAdm));
        }).catch(e => {console.log(e)})
    }

    const getPedidos = () => {
        const dbRef = collectionGroup(db, 'pedidos');

        getDocs(dbRef).then((query) => {
            const data: any = query.docs.map((doc) => {return {id: doc.id, ...doc.data()}})

            data.sort((doc1: Pedido, doc2: Pedido) => {
                if(doc2.data.seconds > doc1.data.seconds){
                    return 1;
                }
                if(doc2.data.seconds < doc1.data.seconds){
                    return -1;
                }
                
                return 0;
            });

            setPedidos(data.filter((doc: Pedido) => doc.estado === 'enviado'));
            setLoading(false);
        }).catch(e => {console.log(e)})
    }

    const handleUpdateState = () => {
        setPedidoModal(false);
        setLoading(true);
        const dbRef = doc(db, 'pedidos', `${selectedPedido?.id}`);

        updateDoc(dbRef, {
            estado: 'concluido',
            dataConclusao: Timestamp.fromDate(date),
        }).then(() => {
            setAlertMessage('Estado do Pedido alterado para Concluído');
            setAlertBoolean(true);
            getPedidos();
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        if(!pedidos && !produtos && !usuarios){
            getPedidos();
            getAllData('produtos', setProdutos);
            getUsuarios();
            setLoading(true);
        }
        if(pedidos && produtos && usuarios && loading){
            setLoading(false);
        }
    }, [pedidos, produtos, usuarios]);

    return (
        <>
            <Head>
                <title>Enviados</title>
            </Head>

            <div>
                <Alert 
                    alertBoolean={alertBoolean}
                    setAlertBoolean={setAlertBoolean}
                    alertMessage={alertMessage}
                    isError={false}
                />
            </div>

            {!loading ?
                <>
                    <div style={{
                        width: '98%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        filter: pedidoModal ? 'blur(3px)' : '',
                        transition: '0.5s all'
                    }}>
                        <h1 style={{...defaultTitle}}>Pedidos Enviados</h1>

                        <input 
                            style={{
                            width: '350px', 
                            height: '35px', 
                            border: '0',
                            backgroundColor: '#F0F0F0',
                            borderRadius: '5px',
                            paddingLeft: '15px',
                            fontSize: '1em',
                            }}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por Nome ou Código do Pedido"
                            type="text" 
                            defaultValue={userName || ''}
                        />
                    </div>

                    <div>
                        <Pedidos 
                            pedidos={pedidos}
                            setPedidos={setPedidos}
                            modal={pedidoModal}
                            setModal={setPedidoModal}
                            produtos={produtos}
                            usuarios={usuarios}
                            search={search}
                            setSelectedPedido={setSelectedPedido}
                        />
                    </div>
                </>
            : 
                <div style={{
                    width: '100%', 
                    height: '80vh', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}>
                    <Loading  
                        isFullScreen={true}
                    />
                </div>
            }

            {pedidoModal ? 
                <PedidoModal 
                    selectedPedido={selectedPedido}
                    setModal={setPedidoModal}
                    handleUpdateState={handleUpdateState}
                    estado="enviado"
                />
            : <></>}
        </>
    )
}

export const getServerSideProps = (async({query}) => {
    const userName = Array.isArray(query.name) ? '' : query.name != undefined ? query.name : '';

    return {
        props: {
            userName
        }
    }

}) satisfies GetServerSideProps<{userName: string}>