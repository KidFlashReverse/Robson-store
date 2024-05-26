import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import getAllData from '../service/getAllData';
import { defaultTitle, defaultSubTitle, defaultText } from '../ts/constants'
import { Produto } from '../ts/interfaces';
import Head from 'next/head';

export default function DashBoard(){
    const user = useAuth();

    const [products, setProducts] = useState<Array<Produto>>();
    
    const productsSelled = [
        {name: 'Product 1', sells: 50, storage: 10},
        {name: 'Product 2', sells: 43, storage: 20},
        {name: 'Product 3', sells: 62, storage: 5},
        {name: 'Product 4', sells: 10, storage: 1},
        {name: 'Product 5', sells: 27, storage: 33},
    ];

    const bestSellers = [
        {name: 'Seller 1', sells: 50},
        {name: 'Seller 2', sells: 30},
        {name: 'Seller 3', sells: 10},
        {name: 'Seller 4', sells: 20},
        {name: 'Seller 5', sells: 100},
    ]

    const orderProductsBySells = () => {
        productsSelled.sort((a, b) => {
            if (a.sells < b.sells){
                return 1;
            }
            if (a.sells > b.sells){
                return -1;
            }
            return 0;
        })
        return true;
    };

    const orderProductsByStorage = () => {
        products?.sort((a, b) => {
            if (parseInt(a.quantity) < parseInt(b.quantity)){
                return -1;
            }
            if (parseInt(a.quantity) > parseInt(b.quantity)){
                return 1;
            }
            return 0;
        })
        return true;
    };

    const orderSellersBySells = () => {
        bestSellers.sort((a, b) => {
            if (a.sells < b.sells){
                return 1;
            }
            if (a.sells > b.sells){
                return -1;
            }
            return 0;
        })
        return true;
    };

    useEffect(() => {
        getAllData('produtos', setProducts);
    }, []);

    return(
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div>
                <h1 style={{...defaultTitle}}>Home</h1>
            </div>
            <div style={{
                width: '83vw',
                marginTop: '30px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}>
                <div>
                    <h2 style={{...defaultSubTitle}}>Produtos mais Vendidos de Hoje</h2>
                    <div style={{
                        width: '450px',
                        marginTop: '20px',
                        borderRadius: '15px',
                        backgroundColor: '#F0F0F0',
                        paddingTop: '5%',
                        padding: '5%',
                    }}> 
                        {orderProductsBySells()}
                        {productsSelled.map((value, index) => {
                            return (
                                <>
                                    <div key={index + 1} style={{
                                        width: '100%',
                                        marginTop: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        ...defaultText,
                                    }}>
                                        <p>{value.name}</p>
                                        <p>{value.sells}</p>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h2 style={{...defaultSubTitle, width: '500px', textAlign: 'center'}}>Estoque Baixo</h2>
                    <div style={{
                        width: '450px',
                        marginTop: '20px',
                        borderRadius: '15px',
                        backgroundColor: '#F0F0F0',
                        paddingTop: '5%',
                        padding: '5%',
                    }}> 
                        {orderProductsByStorage()}
                        {products?.map((value, index) => {
                            if(index > 4) return null;
                            
                            return (
                                <>
                                    <div key={value.id} style={{
                                        width: '100%',
                                        marginTop: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        ...defaultText,
                                    }}>
                                        <p>{value.name}</p>
                                        <p>{value.quantity}</p>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
                <div style={{marginTop: '20px'}}>
                    <h2 style={{...defaultSubTitle}}>Melhores Vendedores de Hoje</h2>
                    <div style={{
                        width: '450px',
                        marginTop: '20px',
                        borderRadius: '15px',
                        backgroundColor: '#F0F0F0',
                        paddingTop: '5%',
                        padding: '5%',
                    }}> 
                        {orderSellersBySells()}
                        {bestSellers.map((value, index) => {
                            return (
                                <>
                                    <div key={index + 1} style={{
                                        width: '100%',
                                        marginTop: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        ...defaultText,
                                    }}>
                                        <p>{value.name}</p>
                                        <p>{value.sells}</p>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}