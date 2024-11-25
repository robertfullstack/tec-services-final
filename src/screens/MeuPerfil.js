import React, { useState, useEffect } from 'react';
import { auth, database, ref, get } from './firebase'; // Certifique-se de importar as funções do Firebase
import './MeuPerfil.scss'; // Importa o arquivo SCSS

export const MeuPerfil = () => {
    const [userData, setUserData] = useState(null);  // Estado para armazenar os dados do usuário
    const [loading, setLoading] = useState(true);    // Estado para controle de loading

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    // Obtém os dados do usuário do Firebase Realtime Database
                    const userRef = ref(database, 'users/' + user.uid);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUserData(snapshot.val());  // Define os dados do usuário
                    } else {
                        setUserData(null);  // Caso não haja dados no banco de dados
                    }
                } catch (error) {
                    console.error('Erro ao obter dados do usuário:', error);
                    setUserData(null); // Em caso de erro, define null para os dados
                }
            } else {
                // Se o usuário não estiver autenticado
                setUserData(null);
            }

            setLoading(false);  // Define o estado de loading como false quando a verificação terminar
        });

        return () => unsubscribe();  // Limpeza do listener
    }, []);

    if (loading) {
        return <div className="loading-message">Carregando...</div>;
    }

    if (!userData) {
        return <div className="no-profile-message">Nenhum dado de perfil encontrado.</div>;
    }

    return (
        <div className="meu-perfil-container">
            <h1>Meu Perfil</h1>
            <div className="meu-perfil-info">
                <p><strong>Nome:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                {/* Aqui você pode adicionar outros campos se desejar */}
            </div>

            <div className="button-container">
                <button className="edit-button">Editar Perfil</button>
            </div>
        </div>
    );
};

export default MeuPerfil;
