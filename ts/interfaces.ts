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