import Head from "next/head";
import { defaultSubTitle, defaultText, defaultTitle } from "../../ts/constants";
import { useEffect, useState } from "react";
import getAllData from "../../service/getAllData";
import { Client, User } from "../../ts/interfaces";
import SearchIcon from '../../public/buttonsIcons/searchIcon.png';
import NextImageIcon from '../../public/buttonsIcons/nextImageIcon.png';
import Image from "next/image";
import { DocumentData, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../service/firebase";

export default function Vendedores(){
    const [users, setUsers] = useState<Array<User>>();
    const [search, setSearch] = useState('');
    const [userSelected, setUserSelected] = useState<User>();
    const [userModal, setUserModal] = useState(false);
    const [userClients, setUserClients] = useState<Array<Client | DocumentData>>([]);
    const [userClientsModal, setUserClientsModal] = useState(false);
    const [showClientInformations, setShowClientInformations] = useState('');
    const [clientFilter, setClientFilter] = useState('');

    const getUsers = () => {
        getAllData('users', setUsers);
    };

    const getClients = () => {
        const dbRef = collectionGroup(db, 'clientes');

        getDocs(dbRef).then((query) => {
            const data = query.docs.map((doc) => { return doc.data() });
            const arrayClients: Array<DocumentData> = [];

            data.map((doc) => {
                if(doc.userId === userSelected?.id){
                    arrayClients.push(doc);
                }
            });

            setUserClients(arrayClients);
            setUserClientsModal(true);
        });
    }

    const usersBox = (user: User) => {
        return (
            <div 
                style={{
                    width: '280px',
                    height: '200px',
                    backgroundColor: '#F0F0F0',
                    marginRight: '40px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                }}
                onClick={() => { setUserSelected(user); setUserModal(true); }}
            >
                <div style={{
                    position: 'relative',
                    height: '70%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img 
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '100%',
                            objectFit: 'cover',
                        }} 
                        src={user.avatarURL} 
                        alt="Foto do Usuário" 
                    />
                </div>
                <div style={{
                    position: 'relative',
                    height: '30%',
                    textAlign: 'center',
                }}>
                    <p style={defaultText}>{user.nome}</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if(!users){
            getUsers();
        }   

        if(users !== undefined && users.filter((user) => user.hasOwnProperty('isAdm')).length > 0){
            setUsers(users.filter((user) => !user.hasOwnProperty('isAdm')));
            return;
        }
    }, [users]);

    return(
        <>
            <Head>
                <title>Vendedores</title>
            </Head>

            <div style={{
                transition: 'all 0.5s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                filter: userModal ? 'blur(3px) brightness(0.7)' : '',
            }}>
                <h1 style={defaultTitle}>Vendedores</h1>

                <div style={{
                    position: 'relative',
                    right: '30px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <input 
                        style={{
                          width: '350px', 
                          height: '35px', 
                          border: '0',
                          backgroundColor: '#F0F0F0',
                          borderRadius: '5px',
                          paddingLeft: '15px',
                          fontSize: '1.3em',
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar"
                        type="text" 
                    />

                    <Image 
                        style={{
                            position: 'relative',
                            right: '30px',
                        }}
                        src={SearchIcon} 
                        width={20} 
                        alt="Icone Lupa" 
                    />
                </div>
            </div>

            <div style={{
                height: 'auto',
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingRight: '50px',
                paddingBottom: '20px',
                filter: userModal ? 'blur(3px) brightness(0.7)' : '',
                transition: '0.5s all'
            }}>
                <div style={{
                    position: 'relative',
                    top: '50px',
                    height: 'auto',
                    display: 'block',
                }}>
                    <div style={{
                        display: 'flex',
                        height: '250px'
                    }}>
                        {users?.map((user, index) => {
                            if(search != '' && !user.nome.toLowerCase().includes(search.toLowerCase())){
                                return <></>
                            }

                            if(users.length > 4 && (index + 1 <= Math.round(users.length / 2))){
                                return (
                                    <>
                                        {usersBox(user)}
                                    </>
                                );
                            }

                            if(users.length <= 4){
                                return (
                                    <>
                                        {usersBox(user)}
                                    </>
                                );
                            }
                        })}
                    </div>
                    {users && users.length > 4 ? 
                        <div style={{
                            display: 'flex',
                            height: '250px'
                        }}>
                            {users.map((user, index) => {
                                if(search != '' && !user.nome.toLowerCase().includes(search.toLowerCase())){
                                    return <></>
                                }

                                if(index + 1 > Math.round(users.length / 2)){
                                    return (
                                        <>
                                            {usersBox(user)}
                                        </>
                                    );
                                }
                            })}
                        </div>
                    : <></>}
                </div>
            </div>

            {/* Modals */}

            {/* User Modal */}

            {userModal ?
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    filter: userClientsModal ? 'blur(3px) brightness(0.7)' : '',
                    transition: '0.6s all'
                }}>
                    <div style={{
                        width: '700px',
                        height: '50%',
                        backgroundColor: '#F0F0F0',
                        borderRadius: '15px',
                    }}>
                        <div style={{
                            width: '98%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            position: 'relative',
                            top: '5px',
                            pointerEvents: 'none',
                        }}>
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
                                    setUserModal(false);
                                    setUserSelected(undefined);
                                }}
                            >X</button>
                        </div>

                        <div style={{
                            display: 'flex',
                            height: '60%',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '50%',
                                marginLeft: '20px',
                                top: '10%',
                            }}> 
                                <h3 style={defaultSubTitle}>Telefone: <span style={{...defaultText, fontSize: '0.8em'}}>{userSelected?.telefone}</span></h3>
                                <h3 style={{...defaultSubTitle, marginTop: '10px'}}>Email: <span style={{...defaultText, fontSize: '0.8em'}}>teste@test.com</span></h3>
                                <h3 style={{...defaultSubTitle, marginTop: '10px'}}>Endereço: <span style={{...defaultText, fontSize: '0.8em'}}> Rua Churubengos, 666. Bairro Churubangus - Cidade de Deus/RJ</span></h3>
                                <button 
                                    style={{
                                        ...defaultText,
                                        marginTop: '30px',
                                        border: 0,
                                        backgroundColor: 'white',
                                        width: '80%',
                                        height: '30px',
                                        borderRadius: '10px',
                                        fontSize: '1.2em',
                                        cursor: 'pointer',
                                    }}
                                    onClick={getClients}
                                >
                                    Clientes
                                </button>
                            </div>
                            <div style={{
                                position: 'relative',
                                top: '10%',
                                width: '50%',
                                height: '70%',
                                textAlign: 'center',
                            }}>
                                <img 
                                    style={{
                                        width: '80%',
                                        height: '90%',
                                        objectFit: 'contain'
                                    }}
                                    src={userSelected?.avatarURL} 
                                    alt="" 
                                />
                                <h3 style={{...defaultSubTitle, marginTop: '10px'}}>{userSelected?.nome}</h3>
                                <h5 style={{...defaultText, marginTop: '5px'}}>Apelido: </h5>
                            </div>
                        </div>

                        <div style={{
                            width: '100%',
                            height: '30%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: '50%',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <button style={{
                                    ...defaultText,
                                    color: 'black',
                                    marginTop: '30px',
                                    border: 0,
                                    backgroundColor: 'cyan',
                                    width: '140px',
                                    height: '30px',
                                    borderRadius: '10px',
                                    fontSize: '1.2em',
                                    cursor: 'pointer',
                                }}>
                                    Editar
                                </button>
                                <button style={{
                                    ...defaultText,
                                    color: 'black',
                                    marginTop: '30px',
                                    border: 0,
                                    backgroundColor: 'red',
                                    width: '140px',
                                    height: '30px',
                                    borderRadius: '10px',
                                    fontSize: '1.2em',
                                    cursor: 'pointer',
                                }}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            : <></>}

            {/* User Client Modal */}
            
            {userClientsModal ?
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
                        width: '300px',
                        height: '40%',
                        backgroundColor: '#F0F0F0',
                        borderRadius: '10px',
                    }}>
                        <div style={{
                            width: '98%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            position: 'relative',
                            top: '5px',
                            backgroundColor: '#F0F0F0',
                            pointerEvents: 'none',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: '67%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <h2 style={{...defaultTitle}}>Clientes</h2>
                            </div>
                            <div style={{
                                width: '33%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
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
                                        setUserClientsModal(false);
                                        setUserClients([]);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        </div>

                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            top: '15px',
                        }}>
                            <input 
                                style={{
                                    width: '80%',
                                    height: '20px',
                                    padding: '5px',
                                    border: 0,
                                    borderRadius: '10px',
                                }} 
                                onChange={(e) => setClientFilter(e.target.value)}
                                type="text" 
                                placeholder="Pesquisar por Nome, CPF, Telefone, etc." 
                            />
                        </div>

                        <div style={{
                            position: 'relative',
                            top: '10%',
                            height: '65%',
                            width: '100%',
                            overflowY: 'auto',
                        }}>
                            {userClients?.map((client) => {
                                if(
                                    clientFilter != '' &&
                                    (!client.nome.toLowerCase().includes(clientFilter.toLowerCase()) &&
                                    !client.cpf.toLowerCase().replace('.', '').includes(clientFilter.toLowerCase().replace('.', '')) &&
                                    !client.telefone.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').includes(clientFilter.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')) &&  
                                    !client.email.toLowerCase().includes(clientFilter.toLowerCase()) &&  
                                    !client.endereco.toLowerCase().includes(clientFilter.toLowerCase()))
                                ){
                                    return <></>
                                }

                                return (
                                    <div>
                                        <div 
                                            style={{
                                                width: '100%',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid black',
                                                textAlign: 'center',
                                                maxHeight: 'auto',
                                                transition: 'all 0.5s',
                                                display: 'flex'
                                            }}
                                            onClick={() => showClientInformations === client.nome ? setShowClientInformations('') : setShowClientInformations(client.nome) }
                                        >
                                            <div style={{
                                                width: '60%',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                                <p style={{...defaultText, position: 'relative', height: '35px', zIndex: 3, backgroundColor: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{client.nome}</p>
                                            </div>
                                            <div style={{
                                                width: '40%',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                position: 'relative',
                                                top: '10px',
                                                right: '10px',
                                            }}>
                                                <Image style={{rotate: showClientInformations === client.nome ? '-90deg' : '90deg', transition: '0.6s all' }} src={NextImageIcon} width={20} alt="" />
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            position: 'relative',
                                            height: 'auto',
                                            backgroundColor: 'white',
                                            textAlign: 'left',
                                            paddingLeft: '15px',
                                            borderBottom: '1px solid black',
                                            maxHeight: showClientInformations === client.nome ? '100px' : '0',
                                            zIndex: 2,
                                            transition: '0.8s all',
                                            overflow: 'hidden'
                                        }}>
                                                <p style={{...defaultText, fontSize: '0.8em'}}>CPF: {client.cpf}</p>
                                                <p style={{...defaultText, fontSize: '0.8em'}}>Telefone: {client.telefone}</p>
                                                <p style={{...defaultText, fontSize: '0.8em'}}>Email: {client.email}</p>
                                                <p style={{...defaultText, fontSize: '0.8em'}}>Endereço: {client.endereco}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {userClients.length === 0 ?
                                <p style={{
                                    ...defaultText,
                                    textAlign: 'center'
                                }}>
                                    Sem Clientes
                                </p>
                            : <></>}
                        </div>
                    </div>
                </div>
            : <></>}

            <style jsx global>{`
                body {
                    background: ${userModal ? "#B2B2B2" : "#F7F7F7"};
                    transition: all 1s;
                }
            `}</style>
        </>
    );
}