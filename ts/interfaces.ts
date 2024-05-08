export interface Image{
    id: number,
    url: string,
}

export interface Product {
    id: number,
    name: string,
    quantity: string,
    description: string,
    price: string,
    images_urls: Array<string>,
    category: string,
}

export interface User {
    id: string,
    avatarURL: string,
    nome: string,
    telefone: string,
    isAdm?: boolean,
}

export interface Client {
    userId: string,
    nome: string,
    cpf: string,
    email: string,
    endereco: string,
    telefone: string,
}