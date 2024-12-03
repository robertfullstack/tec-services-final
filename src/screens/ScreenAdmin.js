import React, { useEffect, useState } from 'react';
import { database, ref, onValue, update, push } from '../screens/firebase';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';
import '../styles/ScreenAdmin.css';

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale);

const ScreenAdmin = () => {
    const [chamados, setChamados] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [viewOption, setViewOption] = useState('');
    const [openChamadosCount, setOpenChamadosCount] = useState(0);
    const [completedChamadosCount, setCompletedChamadosCount] = useState(0);
    const [desistenciasCount, setDesistenciasCount] = useState(0);

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === 'robert@gmail.com' && password === 'robert') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Email ou senha incorretos.');
        }
    };

    useEffect(() => {
        if (isAuthenticated && viewOption === 'chamados') {
            const chamadosRef = ref(database, 'Chamados');

            const unsubscribe = onValue(chamadosRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const chamadosArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setChamados(chamadosArray);

                    // Contando os chamados em aberto, Realizados e desistidos
                    const openCount = chamadosArray.filter((chamado) => chamado.status !== 'Realizado' && !chamado.deleted).length;
                    const completedCount = chamadosArray.filter((chamado) => chamado.status === 'Realizado').length;
                    const desistenciasCount = chamadosArray.filter((chamado) => chamado.status === 'desistido').length;

                    setOpenChamadosCount(openCount);
                    setCompletedChamadosCount(completedCount);
                    setDesistenciasCount(desistenciasCount);
                } else {
                    setChamados([]);
                    setOpenChamadosCount(0);
                    setCompletedChamadosCount(0);
                    setDesistenciasCount(0);
                }
            });

            return () => unsubscribe();
        }
    }, [isAuthenticated, viewOption]);

    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedImage, setZoomedImage] = useState('');


    const handleImageClick = (imageUrl) => {
        setZoomedImage(imageUrl);
        setIsZoomed(true);
    };

    const closeZoom = () => {
        setIsZoomed(false);
        setZoomedImage('');
    };


    const handleMarkAsCompleted = (chamadoId) => {
        const chamadoRef = ref(database, `Chamados/${chamadoId}`);

        update(chamadoRef, { status: 'Realizado' })
            .then(() => {
                console.log('Pedido marcado como Realizado!');
            })
            .catch((error) => {
                console.error('Erro ao marcar pedido como Realizado:', error);
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProductImage(reader.result); // Base64 da imagem
            reader.readAsDataURL(file);
        }
    };

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState(null);

    const handleProductSubmit = (e) => {
        e.preventDefault();

        if (!productName || !productDescription || !productPrice || !productImage) {
            alert('Preencha todos os campos!');
            return;
        }

        const productsRef = ref(database, 'Products');

        const newProduct = {
            name: productName,
            description: productDescription,
            price: parseFloat(productPrice),
            image: productImage,
        };

        push(productsRef, newProduct)
            .then(() => {
                alert('Produto adicionado com sucesso!');
                setProductName('');
                setProductDescription('');
                setProductPrice('');
                setProductImage('');
            })
            .catch((error) => {
                console.error('Erro ao adicionar produto:', error);
            });
    };

    // Dados para os gráficos
    const dataOpen = {
        labels: ['Chamados em Aberto'],
        datasets: [
            {
                label: 'Chamados em Aberto',
                data: [openChamadosCount],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dataCompleted = {
        labels: ['Chamados Realizados'],
        datasets: [
            {
                label: 'Chamados Realizados',
                data: [completedChamadosCount],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dataDesistencias = {
        labels: ['Chamados Desistidos'],
        datasets: [
            {
                label: 'Chamados Desistidos',
                data: [desistenciasCount],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Opções para os gráficos
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className="screen-admin">
            {!isAuthenticated ? (
                <div className="login-container">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="submit-button">Entrar</button>
                    </form>
                </div>
            ) : (
                <div>
                    {/* Exibindo opções após login */}
                    <h1>Bem-vindo!</h1>
                    <div>
                        <button onClick={() => setViewOption('dados')}>Visualizar dados</button>
                        <button onClick={() => setViewOption('chamados')}>Visualizar chamados abertos</button>
                        {/* <button onClick={() => setViewOption('eccomerce')}>Administrar Eccomerce</button> */}
                    </div>

                    {/* Condicional para mostrar os dados com base na opção escolhida */}
                    {viewOption === 'dados' && (
                        <div>
                            <h2>Dados do Administrador/Técnico</h2>
                            <p>Email: {email}</p>
                            {/* Exibindo os gráficos lado a lado */}
                            <div className="charts-container">
                                <div className="chart">
                                    <h3>Quantidade de Chamados em Aberto</h3>
                                    <Bar data={dataOpen} options={options} />
                                </div>
                                <div className="chart">
                                    <h3>Quantidade de Chamados Realizados</h3>
                                    <Bar data={dataCompleted} options={options} />
                                </div>
                                {/* <div className="chart">
                                    <h3>Quantidade de Chamados Desistidos</h3>
                                    <Bar data={dataDesistencias} options={options} />
                                </div> */}
                            </div>
                        </div>
                    )}

                    {viewOption === 'chamados' && (
                        <div>
                            <h1>Lista de Chamados</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Número de Telefone</th>
                                        <th>Tipo de Serviço</th>
                                        <th>Data Pretendida</th>
                                        <th>Técnico Preferencial</th>
                                        <th>Imagem</th>
                                        <th>Status</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((chamado) => (
                                        <tr key={chamado.id}>
                                            <td>{chamado.name}</td>
                                            <td>{chamado.phone}</td>
                                            <td>{chamado.serviceType}</td>
                                            <td>{chamado.desiredDate}</td>
                                            <td>{chamado.preferredTechnician}</td>
                                            <td>
                                                {chamado.image ? (
                                                    <img
                                                        src={chamado.image}
                                                        alt="Chamado"
                                                        width="100"
                                                        style={{ borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => handleImageClick(chamado.image)} // Evento de clique
                                                    />
                                                ) : (
                                                    'Sem imagem'
                                                )}
                                            </td>

                                            <td>{chamado.status}</td>
                                            <td>
                                                {chamado.status !== 'Realizado' && (
                                                    <button
                                                        onClick={() => handleMarkAsCompleted(chamado.id)}
                                                    >
                                                        Marcar como Realizado
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {viewOption === 'eccomerce' && (
                        <div>
                            <h2>Adicionar Produto</h2>
                            <form onSubmit={handleProductSubmit} className="product-form">
                                <div className="form-group">
                                    <label htmlFor="productName">Nome do Produto:</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="productDescription">Descrição:</label>
                                    <textarea
                                        id="productDescription"
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="productPrice">Preço (R$):</label>
                                    <input
                                        type="number"
                                        id="productPrice"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="productImage">Imagem:</label>
                                    <input
                                        type="file"
                                        id="productImage"
                                        onChange={handleImageUpload}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-button">Adicionar Produto</button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {isZoomed && (
                <div className="zoom-overlay" onClick={closeZoom}>
                    <img src={zoomedImage} alt="Zoomed" className="zoomed-image" />
                </div>
            )}
        </div>
    );
};

export default ScreenAdmin;
