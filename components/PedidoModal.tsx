import dayjs from "dayjs";
import { ProdutoPedido, SelectedPedido } from "../pages/pendentes";
import { defaultText, defaultTitle, fullDate } from "../ts/constants";
import { Dispatch, SetStateAction } from "react";

export default function PedidoModal({
    selectedPedido,
    setModal,
    handleUpdateState,
    estado,
}: {
    selectedPedido: SelectedPedido | undefined,
    setModal: Dispatch<SetStateAction<boolean>>,
    handleUpdateState?: () => void,
    estado: string,
}){
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                width: '600px',
                height: '65%',
                backgroundColor: '#F0F0F0',
                borderRadius: '10px',
            }}> 
                <div style={{
                    width: '98%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    position: 'relative',
                    top: '5px',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    marginTop: '5px'
                }}>
                    <div style={{
                        width: '100%'
                    }}>
                        <h3 style={{...defaultTitle}}>Pedido {selectedPedido?.id}</h3>
                    </div>
                    <button 
                        style={{
                            ...defaultText,
                            border: 0,
                            backgroundColor: '#F0F0F0',
                            fontSize: '1.2em',
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setModal(false)
                        }}
                    >X</button>
                </div>

                <div style={{
                    ...defaultText,
                    position: 'relative',
                    top: '10%',
                    left: '5%'
                }}>
                    <p>Nome: {selectedPedido?.nome}</p>
                    <p style={{marginTop: '10px'}}>Data do pedido: {fullDate(selectedPedido?.date)}</p>

                    {estado != 'pendente' ? 
                        <p style={{marginTop: '10px'}}>Data do envio: {fullDate(selectedPedido?.dataEnvio)}</p>
                    : <></>}

                    {estado === 'concluido' ? 
                        <p style={{marginTop: '10px'}}>Data que foi concluído: {dayjs(selectedPedido?.dataConclusao?.toDate()).format('DD/MM/YYYY')}</p>
                    :<></>}

                    <p style={{marginTop: '10px'}}>Produtos: </p>

                    <div style={{
                        width: '90%',
                        height: '150px',
                        overflowY: 'auto'
                    }}>
                        {selectedPedido?.produtos.map((produto: ProdutoPedido) => {
                            return (
                                <div style={{
                                    width: '90%',
                                    height: '100px',
                                    borderRadius: '10px',
                                    border: '1px black solid',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    marginBottom: '10px'
                                }}>
                                    <img style={{height: '90%'}} src={produto.images_urls[0]} alt="" />

                                    <div>
                                        <p>{produto.name}</p>
                                        <p>{parseInt(produto.price).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
                                        <p>Comissão de {produto.commission}%</p>
                                    </div>

                                    <div>
                                        <p>Quantidade Total: {produto.totalQuantity}</p>
                                        <p>Valor Total: {produto.totalPrice.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p style={{marginTop: '10px'}}>Total da Compra: {selectedPedido?.totalPrice.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
                
                    <div style={{
                        height: '100px',
                        width: '90%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        {handleUpdateState ?
                            <button 
                                style={{
                                    width: '150px',
                                    height: '45px',
                                    ...defaultText,
                                    border: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    fontSize: '1.2em',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleUpdateState()}
                            >
                                Pedido {estado === 'pendente' ? 'Enviado' : 'Concluído'}                            
                            </button>
                        :<></>}
{/* 
                        {estado != 'concluido' ? 
                            <button style={{
                                width: '150px',
                                height: '45px',
                                ...defaultText,
                                border: 0,
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                fontSize: '1.2em'
                            }}>
                                Cancelar Pedido
                            </button>
                        : <></>} */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}