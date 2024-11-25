import React from 'react';
import '../styles/Contato.css';
import IconeLocalizacao from "../icons/icone-localizacao.png";
import IconeTelefone from "../icons/icone-telefone.png";
import IconeEmail from "../icons/icone-email.svg";
import IconeInsta from "../icons/icone-insta.png";

export const Contato = () => {
    return (
        <div className="contato-container" style={{ width: '80%', margin: '30px auto' }}>
            <div className="info-section">
                <div className="info-box">
                    <i className="fas fa-map-marker-alt"></i>
                    <img src={IconeLocalizacao} width={50} style={{ marginTop: '20px' }} />
                    <h3>Nosso Escritório Principal</h3>
                    <p>Soho 94 Broadway St<br />New York, NY 1001</p>
                </div>
                <div className="info-box">
                    <i className="fas fa-phone-alt"></i>
                    <img src={IconeTelefone} width={50} style={{ marginTop: '20px' }} />
                    <h3>Número de Telefone</h3>
                    <p>11 98106-1393<br />11 94547-3326 (ligação gratuita)</p>
                </div>
                <div className="info-box">
                    <i className="fas fa-envelope"></i>
                    <img src={IconeEmail} width={50} style={{ marginTop: '20px' }} />
                    <h3>O Email</h3>
                    <p>tecservices@gmail.com</p>
                </div>
                <div className="info-box">
                    <i className="fas fa-fax"></i>
                    <img src={IconeInsta} width={50} style={{ marginTop: '20px' }} />
                    <h3>Instagram</h3>
                    <p>@tecservices</p>
                </div>
            </div>

            <div className="form-section">
                <h2>Entre em contato conosco</h2>
                <form className="contact-form">
                    <input type="text" placeholder="Nome" required />
                    <input type="email" placeholder="Email" required />
                    <textarea placeholder="Sua mensagem" required></textarea>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Contato;
