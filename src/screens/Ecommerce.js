import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ecommerce.css';

export const Ecommerce = () => {
    const products = [
        {
            id: 1,
            name: 'Notebook Dell Inspiron',
            price: 4500,
            category: 'Computadores',
            img: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg'
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
        },
        {
            id: 10,
            name: 'Placa Mãe Gigabyte A520M S2H DDR4, AMD, AM4',
            price: 469,
            category: 'Placa Mãe',
            img: 'https://m.media-amazon.com/images/I/81o0aL-hQuL._AC_SX679_.jpg'
        },
        {
            id: 11,
            name: 'Placa Mae Gigabyte X670E Aorus Xtreme, DDR5, Socket AM5, E-ATX, Chipset AMD X670, X670E-AORUS-XTREME',
            price: 5999,
            category: 'Placa Mãe',
            img: 'https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/x/6/x670e-aorus-xtreme2.jpg'
        }
    ];

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(7000);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Eletrônicos', 'Computadores', 'Acessórios', 'HDs', 'Placa Mãe'];

    const navigate = useNavigate(); // Inicializa o hook para navegação

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handlePriceChange = (event) => {
        setPriceRange(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleBuyClick = (id) => {
        navigate(`/product/${id}`);
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length > 0
            ? selectedCategories.includes(product.category)
            : true;
        const matchesPrice = product.price <= priceRange;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesPrice && matchesSearch;
    });

    return (
        <div className="ecommerce-container">
            <header className="ecommerce-header">
                <h1>Loja Virtual</h1>
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </header>

            <div className="ecommerce-content">
                <aside className="ecommerce-filters">
                    <h3>Filtros</h3>
                    <div className="filter-section">
                        <h4>Categorias</h4>
                        {categories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <div className="filter-section">
                        <h4>Preço até: R$ {priceRange}</h4>
                        <input
                            type="range"
                            min="0"
                            max="7000"
                            value={priceRange}
                            onChange={handlePriceChange}
                            className="price-range" style={{ width: '80%' }}
                        />
                    </div>
                </aside>

                <main className="ecommerce-products">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.img} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p>R$ {product.price.toFixed(2)}</p>
                                <button
                                    className="btn-buy"
                                    onClick={() => handleBuyClick(product.id)}
                                >
                                    Comprar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum produto encontrado.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Ecommerce;
