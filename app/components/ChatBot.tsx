'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Function to parse basic markdown to HTML
function parseMarkdown(text: string): string {
    return text
        // Bold: **text** or __text__
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br/>');
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Haii Rynn! 🎉 Happy 17th Birthday! Selamat datang di usia sweet seventeen~ Semoga hari ini dan seterusnya selalu dipenuhi kebahagiaan ya! Oh iya, aku chatbot spesial yang dibuat sama Randy khusus buat kamu di hari istimewa ini. Mau ngobrol atau tanya-tanya soal Randy? Aku tau sedikit tentang dia! Aku siap nemenin! 🎂'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '😅 Maaf, ada sedikit masalah. Coba lagi ya!'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '😅 Oops! Koneksi terputus. Coba lagi ya!'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-toggle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    boxShadow: isOpen
                        ? '0 4px 20px rgba(236, 72, 153, 0.4)'
                        : '0 4px 30px rgba(236, 72, 153, 0.6)'
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="chatbot-icon"
                        >
                            ✕
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="chatbot-icon"
                        >
                            🎂
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="chatbot-window"
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div className="chatbot-header-content">
                                <span className="chatbot-header-icon">🎉</span>
                                <div>
                                    <h3 className="chatbot-title">Sweet 17 Bot</h3>
                                    <p className="chatbot-subtitle">Birthday Wish Assistant</p>
                                </div>
                            </div>
                            <motion.div
                                className="chatbot-sparkle"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            >
                                ✨
                            </motion.div>
                        </div>

                        {/* Messages */}
                        <div className="chatbot-messages">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`chatbot-message ${message.role}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="chatbot-avatar">💝</div>
                                    )}
                                    <div
                                        className={`chatbot-bubble ${message.role}`}
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                    />
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="chatbot-message assistant"
                                >
                                    <div className="chatbot-avatar">💝</div>
                                    <div className="chatbot-bubble assistant chatbot-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="chatbot-input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Tulis pesan..."
                                className="chatbot-input"
                                disabled={isLoading}
                            />
                            <motion.button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="chatbot-send"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                🚀
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
