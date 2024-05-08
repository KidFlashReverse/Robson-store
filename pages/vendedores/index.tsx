import Head from "next/head";
import { defaultText, defaultTitle } from "../../ts/constants";
import { useEffect, useState } from "react";
import getAllData from "../../service/getAllData";
import { User } from "../../ts/interfaces";
import SearchIcon from '../../public/buttonsIcons/searchIcon.png';
import Image from "next/image";

export default function Vendedores(){
    const [users, setUsers] = useState<Array<User>>();
    const [usersToScreen, setUsersToScreen] = useState<Array<User>>();

    const getUsers = () => {
        getAllData('users', setUsers);
    };

    const usersBox = (user: User) => {
        return (
            <div style={{
                width: '280px',
                height: '200px',
                backgroundColor: '#F0F0F0',
                marginRight: '40px',
                borderRadius: '15px',
                cursor: 'pointer',
            }}>
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

        if(!usersToScreen){
            setUsersToScreen(users);
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
                        onChange={(e) => setUsersToScreen(users?.filter(user => user.nome.toLowerCase().includes(e.target.value.toLowerCase())))}
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
                        {usersToScreen?.map((user, index) => {
                            if(usersToScreen.length > 4 && (index + 1 <= Math.round(usersToScreen.length / 2))){
                                return (
                                    <>
                                        {usersBox(user)}
                                    </>
                                );
                            }

                            if(usersToScreen.length <= 4){
                                return (
                                    <>
                                        {usersBox(user)}
                                    </>
                                );
                            }
                        })}
                    </div>
                    {usersToScreen && usersToScreen.length > 4 ? 
                        <div style={{
                            display: 'flex',
                            height: '250px'
                        }}>
                            {usersToScreen.map((user, index) => {
                                if(index + 1 > Math.round(usersToScreen.length / 2)){
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
        </>
    );
}