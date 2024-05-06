import { Carousel } from 'react-responsive-carousel';
import { Product } from '../ts/interfaces';
import { Dispatch, SetStateAction } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CarouselProducts({
    productModalInfo,
} : {
    productModalInfo: Product | undefined,
}){
    return (
        <>
            <div style={{
                width: '60%',
                height: '100%',
                filter: 'invert(100%)'
            }}>
                <Carousel 
                    showArrows={true}
                    showIndicators={true}
                    infiniteLoop={true}
                    dynamicHeight={false}
                    showThumbs={false}    
                    showStatus={false}   
                    autoPlay={true}
                    transitionTime={600}       
                >
                    {productModalInfo?.images_urls.map((image, index) => (
                        <div style={{width: '100%', filter: 'invert(100%)', marginBottom: '35px'}}>
                            <img style={{height: '200px', width: '200px', objectFit: 'contain', mixBlendMode: 'multiply'}} src={image} alt="Produto Imagem" />
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
}