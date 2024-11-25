import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, set, push, off } from "firebase/database";
import { auth, database } from "./firebase";
import "../styles/Chat.scss";

const Chat = () => {
    const [userEmail, setUserEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const messageEndRef = useRef(null); // Ref for scrolling to the bottom

    const sanitizeEmailForFirebase = (email) => {
        return email.replace(/\./g, ",");
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

    useEffect(() => {
        const usersRef = ref(database, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map((uid) => ({
                    email: data[uid].email,
                    name: data[uid].name,
                }));
                setUsers(userList);
            }
        });

        // Cleanup listener when component is unmounted
        return () => {
            off(ref(database, "users"));
        };
    }, []);

    const handleStartChat = (email) => {
        setRecipientEmail(email);
        loadMessages(email);
    };

    const loadMessages = (email) => {
        const sanitizedUserEmail = sanitizeEmailForFirebase(userEmail);
        const sanitizedRecipientEmail = sanitizeEmailForFirebase(email);

        const roomId = [sanitizedUserEmail, sanitizedRecipientEmail].sort().join("_");

        const chatRef = ref(database, `chats/${roomId}`);
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatMessages = Object.values(data);
                setMessages(chatMessages);
            } else {
                setMessages([]);
            }
        });

        // Cleanup listener when component is unmounted or chat is switched
        return () => {
            off(chatRef);
            unsubscribe();
        };
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const sanitizedUserEmail = sanitizeEmailForFirebase(userEmail);
        const sanitizedRecipientEmail = sanitizeEmailForFirebase(recipientEmail);

        const roomId = [sanitizedUserEmail, sanitizedRecipientEmail].sort().join("_");
        const chatRef = ref(database, `chats/${roomId}`);
        const newMessageRef = push(chatRef);

        set(newMessageRef, {
            text: newMessage,
            sender: userEmail,
            timestamp: Date.now(),
        });

        setNewMessage("");
    };

    useEffect(() => {
        // Scroll to bottom when new message is sent or received
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="user-list">
                <h3>Usuários</h3>
                {users.map((user) => (
                    <button
                        key={user.email}
                        onClick={() => handleStartChat(user.email)}
                        className={recipientEmail === user.email ? "active" : ""}
                    >
                        {user.name}
                    </button>
                ))}
            </div>

            <div className="chat-window">
                {recipientEmail ? (
                    <>
                        <h3>Conversa com {recipientEmail}</h3>
                        <div className="message-list">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.sender === userEmail ? "sent" : "received"}`}
                                >
                                    <strong>{msg.sender === userEmail ? "Você" : recipientEmail}</strong>
                                    <p>{msg.text}</p>
                                </div>
                            ))}
                            <div ref={messageEndRef}></div> {/* Scroll target */}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Digite sua mensagem"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Enviar</button>
                        </div>
                    </>
                ) : (
                    <h3>Selecione um usuário para começar a conversar</h3>
                )}
            </div>
        </div>
    );
};

export default Chat;
