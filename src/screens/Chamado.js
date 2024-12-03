import React, { useState } from 'react';
import { database, ref, set } from '../screens/firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/Chamado.scss';

export const Chamado = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [desiredDate, setDesiredDate] = useState('');
    const [preferredTechnician, setPreferredTechnician] = useState('');
    const [image, setImage] = useState(null);
    const [repairDetails, setRepairDetails] = useState('');
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionImages, setSuggestionImages] = useState([]);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Para exibir uma pré-visualização local da imagem
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const chamadoData = {
            name,
            phone,
            serviceType,
            desiredDate,
            preferredTechnician,
            image: '', // Adicionado posteriormente
            repairDetails,
        };

        try {
            if (image) {
                const storage = getStorage();
                const imageRef = storageRef(storage, `images/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                const imageUrl = await getDownloadURL(imageRef);
                chamadoData.image = imageUrl; // Salvando a URL no objeto chamadoData
            }

            const newChamadoRef = ref(database, 'Chamados/' + Date.now());
            await set(newChamadoRef, chamadoData);
            console.log('Chamado salvo com sucesso!');

            setSubmissionSuccess(true);
        } catch (error) {
            console.error('Erro ao salvar chamado:', error);
        }

        // Resetando o formulário
        setName('');
        setPhone('');
        setServiceType('');
        setDesiredDate('');
        setPreferredTechnician('');
        setImage(null);
        setRepairDetails('');
        setImagePreview('');
    };

    const formatPhone = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.replace(/(\d{2})(\d{1})(\d{0,4})(\d{0,4})/, '($1) $2$3-$4').substring(0, 15);
    };

    const handlePhoneChange = (e) => {
        setPhone(formatPhone(e.target.value));
    };










    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        serviceType: '',
        desiredDate: '',
        preferredTechnician: '',
        repairDetails: '',
        image: null,
    });



    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };


    return (
        <div className="chamado-container">
            {!submissionSuccess ? (
                <div>
                    <h1>Formulário de Pedido</h1>
                    <form onSubmit={handleSubmit} className="chamado-form">
                        <div className="form-group">
                            <label htmlFor="name">Nome:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Número de Telefone:</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="serviceType">Tipo de Serviço:</label>
                            <select
                                id="serviceType"
                                value={serviceType}
                                onChange={(e) => {
                                    setServiceType(e.target.value);
                                    // Limpar detalhes de reparo ao mudar o tipo de serviço
                                    setRepairDetails('');
                                }}
                                required
                            >
                                <option value="">Selecione um serviço</option>
                                <option value="Reparo de Computadores">Reparo de Computadores</option>
                                <option value="Manutenção de Redes">Manutenção de Redes</option>
                                <option value="Instalação de Softwares">Instalação de Softwares</option>
                            </select>
                        </div>
                        {serviceType && (
                            <div className="form-group">
                                <label htmlFor="repairDetails">Detalhes do Problema:</label>
                                <select
                                    id="repairDetails"
                                    value={repairDetails}
                                    onChange={(e) => setRepairDetails(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um detalhe</option>
                                    {serviceType === 'Reparo de Computadores' && (
                                        <>
                                            <option value="HD não está funcionando">HD não está funcionando</option>
                                            <option value="Computador está lento">Computador está lento</option>
                                            <option value="Problemas de inicialização">Problemas de inicialização</option>
                                            <option value="Outro">Outro</option>
                                        </>
                                    )}
                                    {serviceType === 'Manutenção de Redes' && (
                                        <>
                                            <option value="Problemas de conexão">Problemas de conexão</option>
                                            <option value="Rede lenta">Rede lenta</option>
                                            <option value="Falha de hardware">Falha de hardware</option>
                                            <option value="Outro">Outro</option>
                                        </>
                                    )}
                                    {serviceType === 'Instalação de Softwares' && (
                                        <>
                                            <option value="Software não está funcionando">Software não está funcionando</option>
                                            <option value="Erro de instalação">Erro de instalação</option>
                                            <option value="Licença não válida">Licença não válida</option>
                                            <option value="Outro">Outro</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="desiredDate">Data Pretendida Para Resolução do Problema:</label>
                            <input
                                type="date"
                                id="desiredDate"
                                value={desiredDate}
                                onChange={(e) => setDesiredDate(e.target.value)}
                                min={getCurrentDate()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="preferredTechnician">Preferência Por Técnico (Não obrigatório):</label>
                            <input
                                type="text"
                                id="preferredTechnician"
                                value={preferredTechnician}
                                onChange={(e) => setPreferredTechnician(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Imagem:</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <button type="submit" style={{ background: '#ffcc00', color: 'black', fontWeight: '700' }} className="submit-button">Enviar</button>
                    </form>
                </div>
            ) : (
                <div style={{ width: '60%', margin: 'auto' }}>

                    <h1>Chamado Registrado com Sucesso!</h1>
                    {/* <p>Aqui estão os detalhes do seu chamado:</p> */}
                    {/* 
                    <div className="chamado-details">
                        <p><strong>Responsável:</strong> </p>
                        <p><strong>Número de Contato:</strong></p>
                        <p><strong>Tipo de Serviço:</strong> </p>
                        <p><strong>Detalhes do Problema:</strong> </p>
                        <p><strong>Data Pretendida:</strong> </p>
                        <p><strong>Preferência por Técnico:</strong> </p>
                        {image && <p><strong>Imagem:</strong> <a href={image} target="_blank" rel="noopener noreferrer">Visualizar Imagem</a></p>}
                    </div>
                

                 */}
                    {/* CODE ANTIGO: CASO EU PRECISA... ESSE ESTÁ SEM IMAGEM!! */}
                    {/* <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                            ))}
                            </ul> */}

                    <p style={{ marginBottom: '0px' }}>Temos algumas sugestões para você nesse momento:</p>
                    <ul className="suggestions-list" style={{ display: 'grid', gridTemplateColumns: '5fr 5fr', margin: 'auto', justifyContent: 'center' }}>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} style={{ margin: '0 20px' }}>
                                <p>{suggestion}</p>
                                {suggestionImages[index] && (
                                    <img src={suggestionImages[index]} alt={`Sugestão ${index + 1}`} className="suggestion-image" style={{ width: '60%', margin: 'auto', display: 'flex' }} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Chamado;
