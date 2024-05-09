import { useEffect, useState } from "react";
import { defaultText, defaultTitle } from "../../ts/constants"
import { Pedido, Produto, Usuario } from "../../ts/interfaces";
import { Timestamp, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";
import getAllData from "../../service/getAllData";
import dayjs from "dayjs";

export default function PedidosPendentes(){
    const [pedidos, setPedidos] = useState<Array<Pedido>>();
    const [produtos, setProdutos] = useState<Array<Produto>>();
    const [usuarios, setUsuarios] = useState<Array<Usuario>>();

    const getPedidos = () => {
        const dbRef = collectionGroup(db, 'pedidos');

        getDocs(dbRef).then((query) => {
            const data: any = query.docs.map((doc) => {return {id: doc.id, ...doc.data()}})

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

    const totalPriceOrder = (pedido: Pedido) => {
        const totalPrice = pedido.produtos.reduce((total: number, produtoPedido: any) => {
            const produtoA: any = produtos?.filter((produto) => produto.name === produtoPedido.nome);

            return total + parseInt(produtoA[0].price);
        }, 0);

        return totalPrice;
    }

    useEffect(() => {
        if(!pedidos && !produtos && !usuarios){
            getPedidos();
            getAllData('produtos', setProdutos);
            getUsuarios();
        }
    }, []);

    return (
        <>
            <div>
                <title>Pendentes</title>
                <h1 style={{...defaultTitle}}>Pedidos Pendentes</h1>
            </div>

            <div style={{
                position: 'relative',
                top: '60px',
                width: '98%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {pedidos?.map((pedido) => {
                    return (
                        <>
                            <div style={{
                                width: '80%',
                                height: '100px',
                                border: '7px solid #394B58',
                                paddingTop: '25px',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{
                                    width: '50%',
                                }}>
                                    <h2 style={{
                                        ...defaultTitle,
                                        color: '#394B58',
                                    }}>
                                        {usuarios?.map((usuario) => { if(usuario.id === pedido.id_usuario) return usuario.nome})}
                                    </h2>
                                </div>

                                <div style={{
                                    width: '30%',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                }}>
                                    <h2 style={{
                                        ...defaultTitle,
                                        color: '#394B58',
                                        fontWeight: '200'
                                    }}>
                                        {pedido.produtos.length > 1 ? pedido.produtos.length + ' Itens' : pedido.produtos.length + ' Item'}
                                    </h2>

                                    <h2 style={{
                                        ...defaultTitle,
                                        color: '#394B58',
                                    }}>
                                        R$ {totalPriceOrder(pedido)}
                                    </h2>
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
    )
}