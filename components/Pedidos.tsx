import { collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../service/firebase";
import { Pedido, Produto, Usuario } from "../ts/interfaces";
import { Dispatch, SetStateAction, useEffect } from "react";
import { defaultText, defaultTitle } from "../ts/constants";
import { SelectedPedido } from "../pages/pendentes";
import dayjs from "dayjs";

export default function Pedidos({
    pedidos, 
    setPedidos,
    modal,
    setModal,
    produtos,
    usuarios,
    search,
    setSelectedPedido,
}: {
    pedidos: Pedido[] | undefined,
    setPedidos: Dispatch<SetStateAction<Pedido[] | undefined>>,
    modal: boolean,
    setModal: Dispatch<SetStateAction<boolean>>,
    produtos: Produto[] | undefined,
    usuarios: Usuario[] | undefined,
    search: string,
    setSelectedPedido: Dispatch<SetStateAction<SelectedPedido | undefined>>,
}){
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

    const setSelectedPedidoInfo = (pedido: Pedido) => {
        const produtosPedido = pedido.produtos.map((produtoPedido) => {
            const produtoInfos: Produto[] | undefined = produtos?.filter((produto) => produto.name === produtoPedido.nome);

            if(produtoInfos){
                const totalQuantity = produtoPedido.quantidade;
                const totalPrice = totalQuantity * parseInt(produtoInfos[0].price); 

                return {...produtoInfos[0], totalQuantity: totalQuantity, totalPrice: totalPrice};
            }
        });

        const nome = usuarios?.find((usuario) => usuario.id === pedido.id_usuario)?.nome;

        const totalPrice = produtosPedido.reduce((total, produtoPedido) => {return produtoPedido?.totalPrice ? total + produtoPedido?.totalPrice : 0}, 0);

        setSelectedPedido({
            id: pedido.id,
            nome: nome ? nome : '',
            date: pedido.data,
            dataEnvio: pedido.dataEnvio,
            produtos: produtosPedido,
            totalPrice: totalPrice,
        });
    }

    const totalItensOrder = (pedido: Pedido) => {
        const totalQuantity = pedido.produtos.reduce((total: number, produtoPedido: any) => {
            return total + produtoPedido.quantidade;
        }, 0);

        return totalQuantity > 1 ? totalQuantity + ' Itens' : totalQuantity + ' Item';
    }

    return (
        <div style={{
            position: 'relative',
            top: '60px',
            width: '98%',
            height: '80vh',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            overflowY: 'auto',
            filter: modal ? 'blur(3px)' : '',
            transition: '0.5s all'
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
                        <div 
                            key={pedido.id}
                            style={{
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
                            }}
                            onClick={() => { setModal(true); setSelectedPedidoInfo(pedido); }}
                        >
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
    );
}