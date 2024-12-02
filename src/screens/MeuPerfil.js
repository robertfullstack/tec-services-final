import React, { useState, useEffect } from 'react';
import { auth, database, ref, get, update, sendPasswordResetEmail } from './firebase'; // Certifique-se de importar corretamente
import './MeuPerfil.scss';

export const MeuPerfil = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const [showResetButton, setShowResetButton] = useState(false); // Estado para controlar a exibição do botão
    const [isEditing, setIsEditing] = useState(false); // Controla se o usuário está editando
    const [newName, setNewName] = useState(''); // Para armazenar o novo nome
    const [newEmail, setNewEmail] = useState(''); // Para armazenar o novo e-mail

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userRef = ref(database, 'users/' + user.uid);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUserData(snapshot.val());
                        setNewName(snapshot.val().name);
                        setNewEmail(snapshot.val().email);
                    } else {
                        setUserData(null);
                    }
                } catch (error) {
                    console.error('Erro ao obter dados do usuário:', error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handlePasswordReset = async () => {
        if (!userData || !userData.email) {
            alert('Não foi possível obter o e-mail do usuário.');
            return;
        }

        try {
            // Enviar o e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, userData.email);
            setResetPasswordSuccess(true);
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição de senha:', error);
            alert('Erro ao enviar e-mail de redefinição de senha.');
        }
    };


    const handleEditProfile = async () => {
        if (!newName || !newEmail) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const user = auth.currentUser;

        if (user) {
            try {
                const userRef = ref(database, 'users/' + user.uid);
                await update(userRef, {
                    name: newName,
                    email: newEmail,
                });

                // Atualiza o estado local com os novos valores
                setUserData({ ...userData, name: newName, email: newEmail });
                setIsEditing(false); // Desativa o modo de edição
            } catch (error) {
                console.error('Erro ao atualizar perfil:', error);
                alert('Erro ao atualizar perfil.');
            }
        }
    };

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
            </div>

            <div className="button-container">
                <button
                    className="edit-button"
                    onClick={() => setIsEditing(true)} // Ativa o modo de edição
                >
                    Editar Perfil
                </button>
            </div>

            {isEditing && (
                <div className="edit-profile-form">
                    <input
                        type="text"
                        placeholder="Novo nome"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Novo e-mail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button
                        className="save-button"
                        onClick={handleEditProfile}
                    >
                        Salvar Alterações
                    </button>
                    <button
                        className="cancel-button"
                        onClick={() => setIsEditing(false)} // Cancela a edição
                    >
                        Cancelar
                    </button>
                </div>
            )}

            <div className="forgot-password-container">
                <button
                    className="forgot-password-button"
                    onClick={() => setShowResetButton(true)} // Exibe o botão de redefinição
                >
                    Esqueci a senha
                </button>

                {resetPasswordSuccess ? (
                    <div className="success-message">
                        Um e-mail para redefinição de senha foi enviado! Verifique sua caixa de entrada.
                    </div>
                ) : (
                    showResetButton && ( // Só mostra o botão se o estado showResetButton for true
                        <div className="password-reset-form">
                            <button
                                className="reset-button"
                                onClick={handlePasswordReset}
                            >
                                Enviar link de redefinição
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MeuPerfil;
