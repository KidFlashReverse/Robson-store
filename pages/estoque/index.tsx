import { defaultTitle, defaultSubTitle, defaultText } from '../../ts/constants';
import AddIcon from '../../public/buttonsIcons/addIcon.png';
import ViewIcon from '../../public/buttonsIcons/viewIcon.png';
import NotViewIcon from '../../public/buttonsIcons/notViewIcon.png';
import DeleteIcon from '../../public/buttonsIcons/deleteIcon.png';
import SearchIcon from '../../public/buttonsIcons/searchIcon.png';
import NextImageIcon from '../../public/buttonsIcons/nextImageIcon.png';
import ErrorIcon from '../../public/buttonsIcons/ErrorIcon.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import getAllData from '../../service/getAllData';
import setData from '../../service/setData';
import { CircularProgress } from '@chakra-ui/progress';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../service/firebase';
import { Product } from '../../ts/interfaces';
import CarouselProducts from '../../components/carousel';
import Head from 'next/head';

interface Category {
    id: number,
    name: string,
}

interface Filter{
    category: string | undefined,
    quantity: string,
    name: string | undefined,
}

interface FormData{
    name: string,
    quantity: string,
    description: string,
    price: string,
    images?: FileList | never[],
    images_urls?: Array<string>,
    category: string,
}

export default function Estoque(){
    const [products, setProducts] = useState<Array<Product>>();
    const [categories, setCategories] = useState<Array<Category>>(); 

    const defineProductsQuantities = () => {
        const quantities: Array<any> = [];

        products?.map((value: any) => {
            if(!quantities.find((element) => element === value.quantity)){
                return quantities.push(value.quantity);
            }
        });

        quantities.sort((a, b) => {
            if(parseInt(a) > parseInt(b)) return 1;
            if(parseInt(a) < parseInt(b)) return -1;

            return 0;
        });

        return quantities;
    }

    const [productsQuantities, setProductsQuantities] = useState(defineProductsQuantities());
    const [maxQuantity, setMaxQuantity] = useState(productsQuantities[(productsQuantities.length - 1)]);
    const [filter, setFilter] = useState<Filter>({
        category: undefined,
        quantity: maxQuantity,
        name: undefined,
    });
    const [addEditProductModal, setAddEditProductModal] = useState(false);
    const [isEditScreen, setIsEditScreen] = useState(false);
    const [productModal, setProductModal] = useState(false);
    const [productModalInfo, setProductModalInfo] = useState<Product>();

    const defaultFormData: FormData = {
        name: '',
        quantity: '',
        description: '',
        price: '',
        category: '',
    };

    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [imagesUrls, setImagesUrls] = useState<any>();
    const [newCategory, setNewCategory] = useState(false);
    const [indexImage, setIndexImage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: '',
    });
    const [animation, setAnimation] = useState('0.8s linear errorAnimation');
    const [deleteProduct, setDeleteProduct] = useState(false);
 
    const handleSubmit = async() => {
        if(formData.name === ''){
            setError({error: true, message: 'Defina o Nome do Produto'});
            return;
        }
        if(formData.quantity === ''){
            setError({error: true, message: 'Defina a Quantidade do Produto'});
            return;
        }
        if(formData.price === ''){
            setError({error: true, message: 'Defina o Preço do Produto'});
            return;
        }
        if(formData.description === ''){
            setError({error: true, message: 'Escreva uma Descrição para o Produto'});
            return;
        }
        if(formData.category === ''){
            setError({error: true, message: 'Defina uma Categoria para o Produto'});
            return;
        }
        if(!formData.images && !formData.images_urls){
            setError({error: true, message: 'Defina Imagens para o Produto'});
            return;
        }

        setAddEditProductModal(false);
        setLoading(true);

        const images = formData.images;
        let array: Array<string> = [];

        const handleSetImages = () => {
            setImagesUrls(array);
        }

        if(newCategory){
           setData('categorias', {name: formData.category});
        }

        if(isEditScreen && !images){
            const docRef = doc(db, 'produtos', `${productModalInfo?.id}`);

            await updateDoc(docRef, {...formData});

            return updateProducts();
        }

        if(images){
            delete formData.images_urls; 
            let index = 1;
            for(let image of images){
                const storageRef = ref(storage, `imagensProdutos/${formData.name}/${index}`);

                uploadBytes(storageRef, image).then((snapshot) => {
                    getDownloadURL(storageRef).then((url) => {
                        array.push(url);
                        if(array.length === images.length){
                            handleSetImages();
                        }
                    });
                });

                index += 1;
            }
        }   
        delete formData.images;
    };

    const handleEditProduct = () => {
        if(productModalInfo){
            setFormData({
                name: productModalInfo.name,
                description: productModalInfo.description,
                price: productModalInfo.price,
                quantity: productModalInfo.quantity,
                category: productModalInfo.category,
                images_urls: productModalInfo.images_urls,
            });
        }

        setProductModal(false);
        setIsEditScreen(true);
        setAddEditProductModal(true);
    }

    const handleDeleteProduct = async() => {
        setDeleteProduct(false);
        setProductModal(false);
        setLoading(true);

        productModalInfo?.images_urls.map(async(value, index) => {
            const imageRef = ref(storage, `imagensProdutos/${productModalInfo?.name}/${index + 1}`);

            await deleteObject(imageRef);
        });

        await deleteDoc(doc(db, 'produtos', `${productModalInfo?.id}`));

        return updateProducts();
    }

    const updateProducts = () => {
        getAllData('produtos', setProducts);

        return setLoading(false);
    }

    useEffect(() => {
        if(loading){
            if(isEditScreen){
                const docRef = doc(db, 'produtos', `${productModalInfo?.id}`);

                if(imagesUrls){
                    updateDoc(docRef, {
                        ...formData, images_urls: imagesUrls
                    }).then(() => {
                        'success';
                    });
                }else{
                    updateDoc(docRef, {
                        ...formData
                    }).then(() => {
                        'success';
                    });
                }
                
                
                getAllData('produtos', setProducts);
                getAllData('categorias', setCategories);
                setFormData(defaultFormData);
                setLoading(false);
                setIsEditScreen(false);

                return;
            }

            setData('produtos', {...formData, images_urls: imagesUrls});

            getAllData('produtos', setProducts);
            getAllData('categorias', setCategories);
            setFormData(defaultFormData);
            setLoading(false);
        }
    }, [imagesUrls]);

    useEffect(() => {
        if(products){
            setProductsQuantities(defineProductsQuantities());
        }
    }, [products, filter]);

    useEffect(() => {
        if(productsQuantities){
            setMaxQuantity(productsQuantities[(productsQuantities.length - 1)]);
        }
    }, [productsQuantities]);

    useEffect(() => {
        getAllData('produtos', setProducts);
        getAllData('categorias', setCategories);
    }, []);

    useEffect(() => {
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimationExit');
        }, 5000);
        setTimeout(function() {
            setAnimation('0.8s linear errorAnimation');
            setError({error: false, message: ''});
        }, 5500)
    }, [error.error]);

    return (
        <>
            <Head>
                <title>Estoque</title>
            </Head>
            <div style={{
                filter: addEditProductModal || productModal ? 'blur(3px)' : undefined,
                transition: 'all 0.5s',
            }}>
                <h1 style={defaultTitle}>Estoque</h1>
            </div>
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
                marginTop: '40px',
                width: '80vw',
                display: 'flex',
                filter: addEditProductModal || productModal ? 'blur(3px) brightness(0.7)' : undefined,
                transition: 'all 0.5s',
            }}>
                <div style={{
                    width: '20%',
                    marginRight: '5%',
                }}>
                    <div style={{
                        marginBottom: '10px',
                        textAlign: 'center',
                    }}>
                        <h2 style={defaultSubTitle}>Categorias</h2>
                    </div>
                    <div style={{
                        height: '45vh',
                        width: '140%',
                        position: 'relative',
                        right: '30%',
                        overflow: 'auto',
                    }}> 
                        {categories?.map((value: any) => {
                            return (
                                <>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{
                                            marginTop: '15px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            marginRight: '16%',
                                        }}>
                                            <Image src={DeleteIcon} width={20} alt="Filtrar" />
                                        </div>
                                        <div style={{
                                            width: '100px',
                                            height: '40px',
                                            display: 'flex',
                                            backgroundColor: '#F0F0F0',
                                            marginTop: '15px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: '15px',
                                        }}>
                                            <p style={defaultText}>{value.name}</p>
                                        </div>
                                        <div 
                                            style={{
                                                marginTop: '15px',
                                                position: 'relative',
                                                left: '30px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => value.name === filter.category ? setFilter({...filter, category: undefined}) : setFilter({...filter, category: value.name})}
                                        >
                                            <Image src={value.name === filter.category ? NotViewIcon :  ViewIcon} width={20} alt="Filtrar" />
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <div style={{
                        width: '100%',
                        marginTop: '15%',
                        textAlign: 'center',
                        ...defaultText,
                    }}>
                        <h3 style={{marginBottom: '5%'}}>Quantidade</h3>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            marginBottom: '2%',
                        }}>
                            <p style={{fontSize: '0.7em', marginRight: '5px'}}>{productsQuantities[0]}</p>
                            <input 
                                style={{
                                    width: '100%',
                                    marginRight: '5px',
                                }} 
                                type="range" 
                                name="quantity" 
                                id="quantity" 
                                max={maxQuantity}
                                min={productsQuantities[0]}
                                defaultValue={maxQuantity}
                                onChange={(e) => {
                                    if(productsQuantities.includes(e.target.value)){
                                        setFilter({...filter, quantity: e.target.value});
                                    }
                                }}
                            />
                            <p style={{fontSize: '0.7em'}}>{maxQuantity}</p>
                        </div>
                        <h4>{filter.quantity}</h4>
                    </div>
                </div>
                <div style={{
                    width: '75%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{
                        width: '100%',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            width: '60%',
                            justifyContent: 'flex-end',
                        }}>
                            <div>
                                <h2 style={defaultSubTitle}>Produtos</h2>
                            </div>
                            <div 
                                style={{
                                    display: 'block',
                                    marginLeft: '15px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setAddEditProductModal(true)}
                            >
                                <Image src={AddIcon} width={30} alt="Adicionar Produto" style={{filter: 'invert(15%)'}} />
                            </div>
                        </div>
                        <div style={{
                            position: 'relative',
                            width: '40%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                            <input 
                                style={{
                                    backgroundColor: '#F0F0F0',
                                    border: 0,
                                    width: '70%',
                                    height: '35px',
                                    borderRadius: '10px',
                                    paddingLeft: '12px',
                                }}
                                type="text" 
                                placeholder='Buscar'
                                onChange={(e) => {
                                    if(e.target.value != ''){
                                        setFilter({...filter, name: e.target.value});
                                    }else{
                                        setFilter({...filter, name: undefined});
                                    }
                                }}
                            />
                            <Image style={{position: 'relative', right: '10%'}} src={SearchIcon} width={20} alt="Pesquisar Produto" />
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: '#F0F0F0',
                        width: '90%',
                        height: '60vh',
                        borderRadius: '20px',
                        padding: '3%',
                        paddingLeft: '7%',
                        paddingRight: '7%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        overflow: 'auto',
                    }}>
                        {!loading ? products?.map((value, index) => {
                            if(
                                (filter.name != undefined && !value.name.toLocaleLowerCase().includes(filter.name.toLocaleLowerCase())) ||
                                (filter.category != undefined && value.category != filter.category) ||
                                (parseInt(filter.quantity) < parseInt(value.quantity))
                            ){
                                return (
                                    <></>
                                );
                            }

                            return (
                                <>
                                    <div 
                                        style={{
                                            backgroundColor: '#F7F7F7',
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '15px',
                                            marginTop: '20px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => { setProductModal(true); setProductModalInfo(products[index]) }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '70%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <img src={value.images_urls[0]} style={{height: '80%', mixBlendMode: 'multiply'}} />
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '30%',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <p style={defaultText}>{value.name}</p>
                                            <p style={{...defaultText, fontSize: '0.7em', width: '100%', textAlign: 'center'}}>Quantidade: {value.quantity}</p>
                                        </div>
                                    </div>
                                </>
                            );  
                        }): (
                            <>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <CircularProgress left='16%' size='40%' thickness='5px' isIndeterminate />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}

            {/* Product Modal */}
            <div style={{
                position: 'absolute',   
                display: productModal ? 'flex' : 'none',
                width: '100vw',
                height: '100vh',
                top: '0',
                left: '0',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    backgroundColor: '#F0F0F0',
                    width: '40%',
                    height: '90%',
                    borderRadius: '10px',
                }}>
                    <div style={{
                        height: '40%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fffafa',
                        flexWrap: 'wrap',
                        borderRadius: '10px'
                    }}>
                        <div 
                            style={{
                                width: '97%',
                                marginTop: '5px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                position: 'relative',
                                zIndex: '4',
                            }}
                        >
                            <p onClick={() => { setProductModal(false); setProductModalInfo(undefined); }} style={{...defaultText, cursor: 'pointer'}}>X</p>
                        </div>
                        
                        <CarouselProducts 
                            productModalInfo={productModalInfo}
                        />
                    </div>
                    <div style={{
                        height: '40%',
                        width: '100%',
                        marginTop: '15px',
                        flexWrap: 'wrap',
                    }}>
                        <h2 style={{...defaultTitle, textAlign: 'center'}}>{productModalInfo?.name}</h2>

                        <div style={{
                            display: 'flex',
                            marginTop: '20px',
                            marginLeft: '20px',
                            width: '100%',
                            height: '40%',
                        }}>
                            <p style={{...defaultText, fontWeight: 'bold', width: '17%'}}>Descrição:</p>
                            <p style={{...defaultText, width: '75%', maxHeight: '100%', overflowY: 'auto'}}>{productModalInfo?.description}</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            marginTop: '20px',
                            marginLeft: '20px',
                            width: '100%',
                        }}>
                            <p style={{...defaultText, fontWeight: 'bold', width: '17%'}}>Categoria:</p>
                            <p style={{...defaultText, width: '80%'}}>{productModalInfo?.category}</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            marginTop: '20px',
                            marginLeft: '20px',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'flex',
                                width: '50%',
                            }}>
                                <p style={{...defaultText, fontWeight: 'bold'}}>Quantidade:</p>
                                <p style={{...defaultText, marginLeft: '10px'}}>{productModalInfo?.quantity}</p>
                            </div>
                            <div style={{
                                display: 'flex',
                                width: '50%',
                            }}>
                                <p style={{...defaultText, fontWeight: 'bold'}}>Preço:</p>
                                <p style={{...defaultText, marginLeft: '10px'}}>R${productModalInfo?.price}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        height: '20%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <button onClick={() => handleEditProduct()} style={{width: '100px', height: '40px', border: '0px', backgroundColor: 'cyan', borderRadius: '10px', fontSize: '1.3em', ...defaultText, cursor: 'pointer', color: 'black'}}>Editar</button>
                        <button onClick={() => setDeleteProduct(true)} style={{width: '100px', height: '40px', border: '0px', backgroundColor: 'red', borderRadius: '10px', fontSize: '1.3em', ...defaultText, cursor: 'pointer', color: 'black'}}>Excluir</button>
                    </div>
                </div>
            </div>

            {/* Delete Product Modal */}

            <div style={{
                position: 'absolute',   
                display: deleteProduct ? 'flex' : 'none',
                width: '100vw',
                height: '100vh',
                top: '0',
                left: '0',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    backgroundColor: '#F0F0F0',
                    width: '30%',
                    height: '20%',
                    borderRadius: '10px',
                    boxShadow: '-2px -2px 20px black',
                    textAlign: 'center',
                }}>
                    <h2 style={{...defaultTitle, marginTop: '10px'}}>Tem certeza que deseja excluir este produto?</h2>
                    <div style={{
                        position: 'relative',
                        top: '15%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                        <button onClick={() => handleDeleteProduct()} style={{width: '100px', height: '30px', border: '0', fontSize: '1.2em', ...defaultText, backgroundColor: 'greenyellow', borderRadius: '15px', color: 'black', cursor: 'pointer'}}>SIM</button>
                        <button onClick={() => setDeleteProduct(false)} style={{width: '100px', height: '30px', border: '0', fontSize: '1.2em', ...defaultText, backgroundColor: 'red', borderRadius: '15px', color: 'black', cursor: 'pointer'}}>NÃO</button>
                    </div>
                </div>
            </div>
                    
            {/* Add and Edit Product Modal */}
            <div
                style={{
                    position: 'absolute',   
                    display: addEditProductModal ? 'flex' : 'none',
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{
                    backgroundColor: '#F0F0F0',
                    width: '40%',
                    height: '50%',
                    borderRadius: '10px',
                }}>
                    <div 
                        style={{
                            width: '97%',
                            marginTop: '5px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                        onClick={() => { setAddEditProductModal(false); setFormData(defaultFormData); setNewCategory(false); setIsEditScreen(false) }}
                    >
                        <p style={{...defaultText, cursor: 'pointer'}}>X</p>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                    }}>
                        <div style={{
                            width: '60%',
                            marginTop: '5%',
                        }}>
                            <div>
                                <input 
                                    style={{
                                        border: 0,
                                        width: '86.5%',
                                        marginLeft: '25px',
                                        marginBottom: '10px',
                                        height: '35px',
                                        borderRadius: '10px',
                                        paddingLeft: '12px',
                                    }}
                                    type="text" 
                                    placeholder="Nome do Produto" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                                <input 
                                    style={{
                                        border: 0,
                                        width: '40%',
                                        marginLeft: '25px',
                                        height: '35px',
                                        borderRadius: '10px',
                                        paddingLeft: '12px',
                                    }}
                                    placeholder='Quantidade'
                                    type="number" 
                                    name="quantity" 
                                    id="quantity" 
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                />
                                <input 
                                    style={{
                                        border: 0,
                                        width: '40%',
                                        marginLeft: '2.5%',
                                        height: '35px',
                                        borderRadius: '10px',
                                        paddingLeft: '12px',
                                    }}
                                    placeholder='Preço'
                                    type="number" 
                                    name="price" 
                                    id="price" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                                <textarea 
                                    style={{
                                        border: 0,
                                        width: '86.5%',
                                        marginLeft: '25px',
                                        marginTop: '10px',
                                        height: '35px',
                                        borderRadius: '10px',
                                        paddingLeft: '12px',
                                        paddingTop: '8px',
                                        resize: 'none',
                                    }}
                                    name="description" 
                                    id="description" 
                                    cols={30} 
                                    rows={10} 
                                    placeholder='Descrição'
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                                <select 
                                    style={{
                                        border: 0,
                                        width: '90%',
                                        marginLeft: '25px',
                                        marginTop: '10px',
                                        height: '35px',
                                        borderRadius: '10px',
                                        paddingLeft: '12px',
                                    }}
                                    name="categories" 
                                    id="categories"
                                    value={newCategory ? 'Nova Categoria' : formData.category}
                                    onChange={(e) => { if(e.target.value === 'other'){ setFormData({...formData, category: ''}); setNewCategory(true) }else{ setFormData({...formData, category: e.target.value}); setNewCategory(false) }}}
                                >
                                    <option disabled hidden value="">Categoria</option>
                                    <option value='other'>Nova Categoria</option>
                                    {categories?.map((value: any) => {
                                        return (
                                            <option value={value.name}>{value.name}</option>
                                        );
                                    })}
                                </select>
                                {newCategory ? 
                                    <>
                                        <input 
                                            style={{
                                                border: 0,
                                                width: '86.5%',
                                                marginLeft: '25px',
                                                marginTop: '5px',
                                                height: '35px',
                                                borderRadius: '10px',
                                                paddingLeft: '12px',
                                            }}
                                            type="text" 
                                            placeholder="Nova Categoria" 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        />
                                    </>
                                : <></>}
                                <input 
                                    style={{
                                        border: 0,
                                        width: '86.5%',
                                        marginLeft: '25px',
                                        marginTop: '15px',
                                        height: '35px',
                                    }}
                                    type="file" 
                                    name="images" 
                                    id="images" 
                                    onChange={(e) => {
                                        if(e.target.files && e.target.files[0]){
                                            setFormData({...formData, images: e.target.files})
                                        }
                                    }}
                                    accept='.jpeg, .png, .jpg'
                                    multiple
                                />
                                <button 
                                    style={{
                                        width: '150px',
                                        height: '30px',
                                        backgroundColor: 'white',
                                        border: '0',
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        left: '60%',
                                    }}
                                    onClick={handleSubmit}
                                >
                                    {isEditScreen ? 'Editar' : 'Adicionar'}
                                </button>
                            </div>
                        </div>
                        {formData.images ?
                            <>
                                <div style={{
                                    width: '40%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: '7%',
                                }}>
                                    {indexImage != 0 ? 
                                        <>
                                            <div 
                                                style={{
                                                    position: 'relative',
                                                    right: '3px',
                                                    cursor: 'pointer',
                                                    rotate: '180deg',
                                                    top: '-5px',
                                                    width: '5%',
                                                }}
                                                onClick={() => setIndexImage(indexImage - 1)}
                                            >
                                                <Image src={NextImageIcon} width={20} alt='Imagem Anterior' />
                                            </div>
                                        </>
                                    : 
                                        <>
                                            <div style={{width: '5%'}}></div>
                                        </>
                                    }
                                    <div style={{
                                        width: '50%',
                                        height: '60%',
                                        overflow: 'hidden',
                                        objectFit: 'cover',
                                    }}>
                                        <img 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            src={URL.createObjectURL(formData.images[indexImage])} 
                                            alt="Imagem do Produto" 
                                        />
                                    </div>
                                    {indexImage != (formData.images.length - 1) ? 
                                        <>
                                            <div 
                                                style={{
                                                    position: 'relative',
                                                    left: '3px',
                                                    cursor: 'pointer',
                                                    width: '5%',
                                                }}
                                                onClick={() => setIndexImage(indexImage + 1)}
                                            >
                                                <Image src={NextImageIcon} width={20} alt='Próxima Imagem' />
                                            </div>
                                        </>
                                    : 
                                        <>
                                            <div style={{width: '5%'}}></div>
                                        </>
                                    }
                                </div>
                            </>
                        : formData.images_urls ?
                            <>
                                <div style={{
                                    width: '40%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: '7%',
                                }}>
                                    {indexImage != 0 ? 
                                        <>
                                            <div 
                                                style={{
                                                    position: 'relative',
                                                    right: '3px',
                                                    cursor: 'pointer',
                                                    rotate: '180deg',
                                                    top: '-5px',
                                                    width: '5%',
                                                }}
                                                onClick={() => setIndexImage(indexImage - 1)}
                                            >
                                                <Image src={NextImageIcon} width={20} alt='Imagem Anterior' />
                                            </div>
                                        </>
                                    : 
                                        <>
                                            <div style={{width: '5%'}}></div>
                                        </>
                                    }
                                    <div style={{
                                        width: '50%',
                                        height: '60%',
                                        overflow: 'hidden',
                                        objectFit: 'cover',
                                    }}>
                                        <img 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            src={formData.images_urls[indexImage]} 
                                            alt="Imagem do Produto" 
                                        />
                                    </div>
                                    {indexImage != (formData.images_urls.length - 1) ? 
                                        <>
                                            <div 
                                                style={{
                                                    position: 'relative',
                                                    left: '3px',
                                                    cursor: 'pointer',
                                                    width: '5%',
                                                }}
                                                onClick={() => setIndexImage(indexImage + 1)}
                                            >
                                                <Image src={NextImageIcon} width={20} alt='Próxima Imagem' />
                                            </div>
                                        </>
                                    : 
                                        <>
                                            <div style={{width: '5%'}}></div>
                                        </>
                                    }
                                </div>
                            </>
                        : <></>}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                body {
                    background: ${addEditProductModal || productModal ? "#B2B2B2" : "#F7F7F7"};
                    transition: all 1s;
                }
            `}</style>
        </>
    );
}