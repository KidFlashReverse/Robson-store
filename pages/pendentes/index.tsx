import { useEffect, useState } from "react";
import { defaultText, defaultTitle } from "../../ts/constants"
import { Pedido, Produto, Usuario } from "../../ts/interfaces";
import { Timestamp, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";
import getAllData from "../../service/getAllData";
import dayjs from "dayjs";
import Loading from "../../components/loading";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";

export default function PedidosPendentes({
    userName
}: InferGetServerSidePropsType<typeof getServerSideProps>){
    const [pedidos, setPedidos] = useState<Array<Pedido>>();
    const [produtos, setProdutos] = useState<Array<Produto>>();
    const [usuarios, setUsuarios] = useState<Array<Usuario>>();
    const [search, setSearch] = useState(userName || '');
    const [loading, setLoading] = useState(true);

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

            setPedidos(data.filter((doc: Pedido) => doc.estado === 'pendente'));
        }).catch(e => {console.log(e)})
    }

    const getUsuarios = () => {
        const dbRef = collectionGroup(db, 'users');

        getDocs(dbRef).then((query) => {
            const data: any = query.docs.map((doc) => {return {id: doc.id, ...doc.data()}})

            setUsuarios(data.filter((doc: Usuario) => !doc.isAdm));
        }).catch(e => {console.log(e)})
    }

    const totalItensOrder = (pedido: Pedido) => {
        const totalQuantity = pedido.produtos.reduce((total: number, produtoPedido: any) => {
            return total + produtoPedido.quantidade;
        }, 0);

        return totalQuantity > 1 ? totalQuantity + ' Itens' : totalQuantity + ' Item';
    }

    const totalPriceOrder = (pedido: Pedido) => {        
        const totalPrice = pedido.produtos.reduce((total: number, produtoPedido: any) => {
            const produtoA: any = produtos?.filter((produto) => produto.name === produtoPedido.nome);
            return total + (parseInt(produtoA[0].price) * produtoPedido.quantidade);
        }, 0);

        return totalPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    useEffect(() => {
        if(!pedidos && !produtos && !usuarios){
            getPedidos();
            getAllData('produtos', setProdutos);
            getUsuarios();
        }
        if(!pedidos && !produtos && !usuarios && loading){
            setLoading(false);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Pendentes</title>
            </Head>
            {!loading ?
                <>
                    <div style={{
                        width: '98%',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h1 style={{...defaultTitle}}>Pedidos Pendentes</h1>

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

                    <div style={{
                        position: 'relative',
                        top: '60px',
                        width: '98%',
                        height: '80vh',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        overflowY: 'auto',
                    }}>
                        {pedidos && produtos && pedidos?.map((pedido) => {
                            const nomeUsuario = usuarios?.find((usuario) => usuario.id === pedido.id_usuario)?.nome;

                            if(!nomeUsuario?.toLowerCase().normalize('NFD').includes(search.toLowerCase().normalize('NFD')) &&
                                !pedido.id.toLowerCase().includes(search.toLowerCase())
                            ){
                                return <></>
                            }

                            return (
                                <>
                                    <div style={{
                                        width: '80%',
                                        height: '100px',
                                        border: '5px solid #394B58',
                                        paddingTop: '25px',
                                        marginBottom: '20px',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        cursor: 'pointer'
                                    }}>
                                        <div style={{
                                            width: '50%',
                                        }}>
                                            <h2 style={{
                                                ...defaultTitle,
                                                color: '#394B58',
                                            }}>
                                                {nomeUsuario}
                                            </h2>
                                        </div>

                                        <div style={{
                                            width: '30%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}>
                                            <h2 style={{
                                                ...defaultTitle,
                                                color: '#394B58',
                                                fontWeight: '200',
                                                width: '50%'
                                            }}>
                                                {totalItensOrder(pedido)}
                                            </h2>

                                            <div style={{
                                                width: '50%',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                            }}>
                                                <h2 style={{
                                                    ...defaultTitle,
                                                    color: '#394B58',
                                                }}>
                                                    {totalPriceOrder(pedido)}
                                                </h2>
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            marginLeft: '50px',
                                            marginRight: '80px',
                                        }}>
                                            <p style={{...defaultText, fontSize: '0.7em', fontWeight: '100', marginRight: '100px'}}>ID: {pedido.id}</p>
                                            <p style={{...defaultText, fontSize: '0.7em', fontWeight: '100'}}>{dayjs(pedido.data.seconds * 1000).format('DD/MM/YYYY')}</p>
                                        </div>
                                    </div>  
                                </>
                            );
                        })}
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