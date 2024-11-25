import React, { useEffect, useState } from 'react';
import { database, ref, onValue, update } from '../screens/firebase';
import '../styles/ScreenAdmin.css';

const ScreenAdmin = () => {
    const [chamados, setChamados] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

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
        if (isAuthenticated) {
            const chamadosRef = ref(database, 'Chamados');

            const unsubscribe = onValue(chamadosRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const chamadosArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setChamados(chamadosArray);
                } else {
                    setChamados([]);
                }
            });

            return () => unsubscribe();
        }
    }, [isAuthenticated]);

    const handleMarkAsCompleted = (chamadoId) => {
        const chamadoRef = ref(database, `Chamados/${chamadoId}`);

        update(chamadoRef, { status: 'realizado' })
            .then(() => {
                console.log('Pedido marcado como realizado!');
            })
            .catch((error) => {
                console.error('Erro ao marcar pedido como realizado:', error);
            });
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
                                                src={URL.createObjectURL(
                                                    new Blob([chamado.image], { type: 'image/jpeg' })
                                                )}
                                                alt="Chamado"
                                                width="100"
                                            />
                                        ) : (
                                            'Sem Imagem'
                                        )}
                                    </td>
                                    <td>{chamado.status || 'Pendente'}</td>
                                    <td>
                                        {chamado.status === 'realizado' ? (
                                            <button disabled>Pedido já realizado</button>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkAsCompleted(chamado.id)}
                                            >
                                                Marcar como realizado
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScreenAdmin;
