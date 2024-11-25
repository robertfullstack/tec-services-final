import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams(); 

    const products = [
        {
            id: 1,
            name: 'Notebook Dell Inspiron',
            price: 4500,
            category: 'Computadores',
            img: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg'
        },
        {
            id: 2,
            name: 'Smartphone Samsung Galaxy S21',
            price: 3500,
            category: 'Eletrônicos',
            img: 'https://m.media-amazon.com/images/I/91BGp6ONuFL._AC_SL1500_.jpg'
        },
        {
            id: 3,
            name: 'Fone de Ouvido JBL',
            price: 350,
            category: 'Acessórios',
            img: 'https://m.media-amazon.com/images/I/51CBWEMsExL._AC_SL1000_.jpg'
        },
        {
            id: 4,
            name: 'Smart TV Samsung 55"',
            price: 2800,
            category: 'Eletrônicos',
            img: 'https://m.media-amazon.com/images/I/91KvULvWXML._AC_SL1500_.jpg'
        },
        {
            id: 5,
            name: 'Cadeira Gamer',
            price: 799,
            category: 'Acessórios',
            img: 'https://m.media-amazon.com/images/I/61ldLDKjR+L._AC_SL1500_.jpg'
        },
        {
            id: 6,
            name: 'Relógio Smartwatch Xiaomi Mi Band 6',
            price: 280,
            category: 'Eletrônicos',
            img: 'https://m.media-amazon.com/images/I/61X7X-KzJuL._AC_SL1500_.jpg'
        },
        {
            id: 7,
            name: 'Hd Interno 1000gb Seagate Barracuda St1000dm010',
            price: 280,
            category: 'HDs',
            img: 'https://http2.mlstatic.com/D_NQ_NP_2X_863965-MLA79443368912_102024-F.webp'
        },
        {
            id: 8,
            name: 'Hd 1tb P/Desktop Seagate 3.5 Sata3 (ST1000VM002',
            price: 195,
            category: 'HDs',
            img: 'https://m.media-amazon.com/images/I/61FLUSJEDUL._AC_SX679_.jpg'
        },
        {
            id: 9,
            name: 'HD Interno Seagate - EXOS X20 - 18TB - SAS 12Gb/s - 7200 RPM - 256 MB - MPN: ST18000NM000D',
            price: 4674,
            category: 'HDs',
            img: 'https://pontobr.jetassets.com.br/produto/20240917154850_7636992364_D.jpg'
        }
    ];

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return <p>Produto não encontrado!</p>;
    }

    return (
        <div className="product-detail-container">
            <img src={product.img} alt={product.name} />
            <h1>{product.name}</h1>
            <p>R$ {product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <button>Finalizar Compra</button>
        </div>
    );
};

export default ProductDetail;
