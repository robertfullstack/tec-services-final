import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set } from './firebase';
import '../styles/Painel.scss';

const Painel = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        notifyError('O endereço de email está mal formatado.');
        break;
      case 'auth/user-disabled':
        notifyError('Esta conta foi desativada.');
        break;
      case 'auth/user-not-found':
        notifyError('Usuário não encontrado. Verifique o email e tente novamente.');
        break;
      case 'auth/wrong-password':
        notifyError('Senha incorreta. Tente novamente.');
        break;
      case 'auth/email-already-in-use':
        notifyError('O email já está em uso por outra conta.');
        break;
      case 'auth/weak-password':
        notifyError('A senha deve ter pelo menos 6 caracteres.');
        break;
      default:
        notifyError('Ocorreu um erro desconhecido: ' + error.message);
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifySuccess("Login bem-sucedido!");
      navigate('/servico');
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        name,
        email
      });

      notifySuccess("Registro bem-sucedido!");
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  return (
    <div className="painel-container" style={{ marginTop: '200px' }}>
      <div className="form-toggle">
        <button onClick={handleToggleForm} className={isLogin ? "active" : ""}>Login</button>
        <button onClick={handleToggleForm} className={!isLogin ? "active" : ""}>Registro</button>
      </div>

      {isLogin ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-submit">Entrar</button>
        </form>
      ) : (
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Registro</h2>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-submit">Registrar</button>
        </form>
      )}

      {/* Container para exibir os toasts */}
      <ToastContainer />
    </div>
  );
};

export default Painel;



/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, onValue } from './firebase';
import '../styles/Painel.scss';

const Painel = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  const sanitizeEmail = (email) => email.replace(/\./g, ',');

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        notifyError('O endereço de email está mal formatado.');
        break;
      case 'auth/user-disabled':
        notifyError('Esta conta foi desativada.');
        break;
      case 'auth/user-not-found':
        notifyError('Usuário não encontrado. Verifique o email e tente novamente.');
        break;
      case 'auth/wrong-password':
        notifyError('Senha incorreta. Tente novamente.');
        break;
      case 'auth/email-already-in-use':
        notifyError('O email já está em uso por outra conta.');
        break;
      case 'auth/weak-password':
        notifyError('A senha deve ter pelo menos 6 caracteres.');
        break;
      default:
        notifyError('Ocorreu um erro desconhecido: ' + error.message);
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      notifySuccess("Login bem-sucedido!");
      fetchMessages(userCredential.user.email);
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), { name, email });

      notifySuccess("Registro bem-sucedido!");
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const fetchMessages = (userEmail) => {
    const chatRef = ref(database, `messages/${sanitizeEmail(userEmail)}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Dados recebidos:', data); // Adicionando log aqui
      if (data) {
        setMessages(Object.values(data));
      } else {
        setMessages([]);
      }
    });
  };
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMessages(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="painel-container" style={{ marginTop: '200px' }}>
      <div className="form-toggle">
        <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>Login</button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>Registro</button>
      </div>

      {isLogin ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-submit">Entrar</button>
        </form>
      ) : (
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Registro</h2>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-submit">Registrar</button>
        </form>
      )}

      {user && (
        <div className="messages-container">
          <h3>Mensagens Recebidas</h3>
          <ul>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <li key={index}>
                  <strong>De:</strong> {msg.sender} <br />
                  <strong>Mensagem:</strong> {msg.text} <br />
                  <strong>Data:</strong> {new Date(msg.timestamp).toLocaleString()}
                </li>
              ))
            ) : (
              <p>Sem mensagens para exibir.</p>
            )}
          </ul>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Painel;

*/