import { ReactElement, useEffect, useState } from "react"
import { defaultTitle, defaultText } from "../ts/constants";
import ViewIcon from '../public/buttonsIcons/viewIcon.png';
import NotViewIcon from '../public/buttonsIcons/notViewIcon.png';
import ErrorIcon from '../public/buttonsIcons/ErrorIcon.svg';
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../service/firebase";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";

export default function Login(){
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: '',
        input: '',
    });
    const [animation, setAnimation] = useState('0.8s linear errorAnimation');

    const handleSubmit = () => {
        if(formData.email === ''){
            setError({error: true, message: 'Digite o Email', input: 'email'});
            return;
        }
        if(!formData.email.includes('@') || !formData.email.includes('.com')){
            setError({error: true, message: 'Digite um Email Válido', input: 'email'});
            return;
        }
        if(formData.password === ''){
            setError({error: true, message: 'Digite sua Senha', input: 'password'});
            return;
        }
        if(formData.password.length < 6){
            setError({error: true, message: 'A senha deve ter pelo menos 6 dígitos', input: 'password'});
            return;
        }

        signInWithEmailAndPassword(auth, formData.email, formData.password).then(user => {
            const docRef = doc(db, 'users', user.user.uid);

            const docUser = getDoc(docRef).then(userInfo => {
                const data =  userInfo.data();

                if(data?.isAdm === true){
                    setCookie(null, 'uid', user.user.uid, {
                        maxAge: 30 * 24 * 60 * 60,
                        path: '/',
                    });

                    router.push('/');
                }else{
                    setError({error: true, message: 'Este Usuário não Tem permissão para Acessar o Sistema', input: ''});
                }
            });            
        }).catch(e => {
            if(e.code === 'auth/invalid-credential'){
                setError({error: true, message: 'Email ou Senha inválido', input: ''});
            }
        })
    }

    useEffect(() => {
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimationExit');
        }, 5000);
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimation');
            setError({error: false, message: '', input: ''});
        }, 5500)
    }, [error.error]);

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div style={{
                position: 'absolute',
                paddingLeft: '15px', 
                paddingRight: '15px',
                borderRadius: '15px 0px 0px 15px',
                width: 'auto',
                height: '40px',
                backgroundColor: '#f44336',
                display: error.error ? 'flex' : 'none',
                alignItems: 'center',
                right: 0,
                top: 30,
                animation: animation,
            }}>
                <Image src={ErrorIcon} width={25} height={25} alt='Error' />
                <p style={{...defaultText, marginLeft: '10px', color: 'black'}}>{error.message}</p>
            </div>
            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#e5e5e5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    width: '500px',
                    height: '250px',
                    borderRadius: '15px',
                    textAlign: 'center',
                }}> 
                    <h2 style={{...defaultTitle, marginTop: '10px'}}>Login</h2>

                    <div>
                        <input 
                            style={{
                                width: '70%', 
                                marginTop: '25px',
                                height: '40px',
                                paddingLeft: '15px',
                                borderRadius: '10px',
                                border: error.input === 'email' ? '0.5px solid red' : '0.5px solid #394B58',
                                fontSize: '1.1em'
                            }} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            type="email" 
                            placeholder="Email" 
                        />
                        <div style={{
                            width: '100%',
                            height: '40px', 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <input 
                                style={{
                                    width: '70%', 
                                    marginTop: '15px',
                                    height: '40px',
                                    paddingLeft: '15px',
                                    borderRadius: '10px',
                                    border: error.input === 'password' ? '0.5px solid red' : '0.5px solid #394B58',
                                    fontSize: '1.1em'
                                }} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Senha" 
                            />
                            <div style={{
                                position: 'absolute',
                                width: '350px',
                                marginTop: '15px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                pointerEvents: 'none',
                            }}>
                                <Image style={{cursor: 'pointer', pointerEvents: 'visible'}} src={showPassword ? NotViewIcon : ViewIcon} onClick={() => setShowPassword(!showPassword)} width={25} height={25} alt="Ver Senha" />
                            </div>
                        </div>
                        <button 
                            style={{
                                ...defaultText,
                                width: '150px',
                                height: '40px',
                                marginTop: '30px',
                                backgroundColor: '#dddddd',
                                borderRadius: '15px',
                                border: '0',
                                cursor: 'pointer',
                                fontSize: '1.1em',
                            }}
                            onClick={() => handleSubmit()}
                        >
                            Logar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

Login.getLayout = function getLayout(page: ReactElement) {
    return page;
}