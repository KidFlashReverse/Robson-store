import { Timestamp } from "firebase/firestore"

export interface Image{
    id: number,
    url: string,
}

export interface Produto {
    id: number,
    name: string,
    quantity: string,
    description: string,
    price: string,
    images_urls: Array<string>,
    category: string,
    commission: string,
}

export interface Usuario {
    id: string,
    avatarURL: string,
    nome: string,
    telefone: string,
    isAdm?: boolean,
    endereco: string,
    cpf: string, 
}

export interface Cliente {
    userId: string,
    nome: string,
    cpf: string,
    email: string,
    endereco: string,
    telefone: string,
}

export interface Pedido {
    id: string,
    id_usuario: string,
    produtos: [
        {nome: string, quantidade: number}
    ]
    estado: string,
    data: Timestamp,
    dataEnvio?: Timestamp,
    dataConclusao?: Timestamp,
}

export interface Notifications {
    id: string,
    codigoPedido: string,
    view: boolean,
    timestamp: Timestamp,
}