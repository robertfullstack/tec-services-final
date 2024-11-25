import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import '../styles/Servico.scss';
import React, { useEffect, useState } from 'react';
import { database, ref, onValue, remove } from '../screens/firebase';

export const Servico = ({ userId }) => {
    const [selected, setSelected] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [chamados, setChamados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggle = (i) => {
        if (selected === i) {
            return setSelected(null);
        }
        setSelected(i);
    };

    const handleSolicitarServico = () => {
        if (user) {
            console.log("Serviço solicitado!");
            navigate('/abrirChamado');
        } else {
            navigate('/cadastrologin');
        }
    };

    useEffect(() => {
        const chamadosRef = ref(database, 'Chamados');
        onValue(chamadosRef, (snapshot) => {
            const data = snapshot.val();
            const chamadosList = [];

            for (let id in data) {
                if (data[id].userId === userId) { 
                    chamadosList.push({ id, ...data[id] });
                }
            }

            setChamados(chamadosList);
        });
    }, [userId]);

    const handleDeleteChamado = (chamadoId) => {
        const chamadoRef = ref(database, `Chamados/${chamadoId}`);
        remove(chamadoRef)
            .then(() => {
                console.log('Chamado excluído com sucesso');
                setChamados(chamados.filter(chamado => chamado.id !== chamadoId));
            })
            .catch((error) => {
                console.error('Erro ao excluir chamado:', error);
            });
    };



    return (
        <div className="servico-container">
            <div id='chamados-feito-por-mim'>
                <h1>Chamados Abertos:</h1>
                <div>
                    <h1>Meus Chamados</h1>
                    {chamados.length > 0 ? (
                        chamados.map(chamado => (
                            <div key={chamado.id}>
                                <h2>{chamado.serviceType}</h2>
                                <p>Nome: {chamado.name}</p>
                                <p>Telefone: {chamado.phone}</p>
                                <p>Detalhes: {chamado.repairDetails}</p>
                                {chamado.image && <img src={chamado.image} alt="Chamado" />}
                                <button
                                    className="delete-chamado-btn"
                                    onClick={() => handleDeleteChamado(chamado.id)}
                                >
                                    Excluir
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum chamado encontrado.</p>
                    )}
                </div>
            </div>

            <h1 className="servico-title">Nossos Serviços</h1>

            {user && <p>Olá, {user.email}</p>} 

            <div className="servico-list">
                <div className="servico-item">
                    <h2>Reparo de Computadores</h2>
                    <p>Diagnóstico e reparo para computadores desktop e laptops.</p>
                    <button className="solicitar-servico-btn" onClick={handleSolicitarServico}>Solicitar Serviço</button>
                </div>
                <div className="servico-item">
                    <h2>Manutenção de Redes</h2>
                    <p>Configuração e manutenção de redes para empresas e residências.</p>
                    <button className="solicitar-servico-btn" onClick={handleSolicitarServico}>Solicitar Serviço</button>
                </div>
                <div className="servico-item">
                    <h2>Instalação de Softwares</h2>
                    <p>Instalação e configuração de sistemas operacionais e softwares.</p>
                    <button className="solicitar-servico-btn" onClick={handleSolicitarServico}>Solicitar Serviço</button>
                </div>
            </div>

            <h1 className="produto-title">Nossos Produtos</h1>
            <div className="produto-list">
                <div className="produto-item">
                    <h2>Computadores</h2>
                    <p>Computadores desktop e laptops de alta performance.</p>
                    <button className="ver-produto-btn">Ver Produto</button>
                </div>
                <div className="produto-item">
                    <h2>Roteadores</h2>
                    <p>Roteadores de última geração para melhor conectividade.</p>
                    <button className="ver-produto-btn">Ver Produto</button>
                </div>
                <div className="produto-item">
                    <h2>Softwares</h2>
                    <p>Softwares originais e licenciados para diversas necessidades.</p>
                    <button className="ver-produto-btn">Ver Produto</button>
                </div>
            </div>


        </div>
    );
}

export default Servico;
