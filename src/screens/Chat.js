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
        if (email === userEmail) {
            alert("Você não pode conversar consigo mesmo.");
            return;
        }
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

        const messageData = {
            sender: userEmail,
            text: newMessage,
            timestamp: Date.now(),
        };

        const chatRef = ref(database, `chats/${roomId}`);
        push(chatRef, messageData);

        setNewMessage(""); // Clear the input field
        messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom
    };

    return (
        <div className="chat-container">
            <div className="user-list">
                <h2>Usuários</h2>
                {users.map((user) => (
                    <button
                        key={user.email}
                        onClick={() => handleStartChat(user.email)}
                    >
                        {user.name}
                    </button>
                ))}
            </div>

            {recipientEmail && (
                <div className="chat-box">
                    <h3>Chat com: {recipientEmail}</h3>
                    <div className="messages">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => {
                                // Encontre o nome do remetente na lista de usuários
                                const senderName = users.find(user => user.email === msg.sender)?.name || msg.sender;

                                return (
                                    <div
                                        key={index}
                                        className={msg.sender === userEmail ? "sent" : "received"}
                                    >
                                        <strong>{senderName}</strong>: {msg.text}
                                        <br />
                                        <small>{new Date(msg.timestamp).toLocaleString()}</small>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Nenhuma mensagem ainda.</p>
                        )}
                    </div>


                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem"
                        />
                        <button onClick={handleSendMessage}>Enviar</button>
                    </div>
                </div>
            )}

            <div ref={messageEndRef}></div>
        </div>
    );
};

export default Chat;
