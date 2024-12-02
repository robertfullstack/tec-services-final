import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, update, database } from '../screens/firebase';
import './EditarChamado.css';

const EditarChamado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chamado, setChamado] = useState({
        name: '',
        phone: '',
        serviceType: '',
        repairDetails: '',
    });

    useEffect(() => {
        const chamadoRef = ref(database, `Chamados/${id}`);
        get(chamadoRef).then(snapshot => {
            if (snapshot.exists()) {
                setChamado(snapshot.val());
            } else {
                console.error('Chamado não encontrado');
            }
        });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Se for o campo 'phone', aplicar a máscara
        if (name === 'phone') {
            const formattedPhone = formatPhone(value);
            setChamado({ ...chamado, [name]: formattedPhone });
        } else {
            setChamado({ ...chamado, [name]: value });
        }
    };

    const formatPhone = (phone) => {
        // Remove qualquer caracter não numérico
        const phoneDigits = phone.replace(/\D/g, '');

        // Aplica a máscara (XX) XXXXX-XXXX
        if (phoneDigits.length <= 2) {
            return `(${phoneDigits}`;
        } else if (phoneDigits.length <= 6) {
            return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2)}`;
        } else {
            return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 7)}-${phoneDigits.slice(7, 11)}`;
        }
    };

    const handleUpdateChamado = () => {
        const chamadoRef = ref(database, `Chamados/${id}`);
        update(chamadoRef, chamado)
            .then(() => {
                console.log('Chamado atualizado com sucesso');
                navigate('/');
            })
            .catch((error) => console.error('Erro ao atualizar chamado:', error));
    };

    return (
        <div className="edit-chamado-container">
            <h1>Editar Chamado</h1>
            <form>
                <div>
                    <label htmlFor="serviceType" >Nome:</label>

                    <input
                        type="text"
                        name="name"
                        value={chamado.name}
                        onChange={handleInputChange} style={{ width: '96%' }}
                        placeholder="Nome"
                    />
                </div>

                <div>
                    <label htmlFor="serviceType" >Número de Telefone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={chamado.phone}
                        onChange={handleInputChange}
                        placeholder="Telefone" style={{ width: '96%' }}
                    />
                </div>


                {/* Substituindo o input por um select */}
                <div className="form-group">
                    <label htmlFor="serviceType" style={{ width: '96%' }}>Tipo de Serviço:</label>
                    <select
                        id="serviceType"
                        name="serviceType"
                        value={chamado.serviceType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Selecione um serviço</option>
                        <option value="Reparo de Computadores">Reparo de Computadores</option>
                        <option value="Manutenção de Redes">Manutenção de Redes</option>
                        <option value="Instalação de Softwares">Instalação de Softwares</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="serviceType" style={{ width: '96%' }}>Detalhe seu Problema:</label>
                    <textarea
                        name="repairDetails"
                        value={chamado.repairDetails}
                        onChange={handleInputChange}
                        placeholder="Detalhes do Problema" style={{ width: '96%' }}
                    />
                </div>

                <button type="button" style={{ width: '100%' }} onClick={handleUpdateChamado}>
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default EditarChamado;
