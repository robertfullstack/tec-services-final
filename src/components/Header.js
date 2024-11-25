import React, { useState, useEffect } from 'react';
import '../styles/Header.scss';
import { IoClose, IoMenu } from "react-icons/io5";
import { auth } from '../screens/firebase';
import ImageLogoSemFundo from "../images/image-logo-sem-fundo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/'; // Redireciona para a página inicial após logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/cadastrologin';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <a href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={ImageLogoSemFundo} width={170} style={{ marginRight: '-28px' }} />
            <h1 style={{ textShadow: '2px 2px 20px white' }}>TecServices</h1>
          </a>
        </div>
        <nav className={`navbar ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/Servico">Serviços</a></li>
            <li><a href="/">Sobre</a></li>
            <li><a href="/Contato">Contato</a></li>
            <li><a href="/Ecommerce">Ecommerce</a></li>
            {isLoggedIn && <li><a href="/Meu-perfil">Meu Perfil</a></li>} {/* Adiciona a opção Meu Perfil */}
          </ul>
          {isLoggedIn ? (
            <button className="contact-button" onClick={handleLogout}>Sair</button>
          ) : (
            <button className="contact-button" onClick={handleLoginRedirect}>Fale Conosco</button>
          )}
        </nav>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? (
            <IoClose size={50} />
          ) : (
            <IoMenu size={50} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
