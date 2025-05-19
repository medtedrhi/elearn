import React, { useState, useEffect, useRef } from 'react';

function Chatbot({ content, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const messagesEndRef = useRef(null);

    const API_KEY = "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";
    const MODEL = "mistralai/mistral-7b-instruct:free";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to get AI response
    const getAIResponse = async (prompt, conversationHistory = []) => {
        try {
            const conversation = [
                { 
                    role: "system", 
                    content: "You are a helpful assistant that summarizes and explains content. Always stay focused on the provided content and answer questions based on it. If a question is not related to the content, politely inform the user that you can only answer questions about the provided content."
                },
                ...conversationHistory,
                { role: "user", content: prompt }
            ];

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'E-Learn Assistant'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: conversation
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    };

    // Get initial summary when component mounts
    useEffect(() => {
        const getInitialSummary = async () => {
            setIsLoading(true);
            try {
                const summaryPrompt = `Please provide a clear and concise summary of the following content. Focus on the main points and key concepts:\n\n${content}`;
                const summary = await getAIResponse(summaryPrompt);
                setMessages([{ role: 'assistant', content: summary }]);
            } catch (error) {
                setToastMessage('Failed to generate summary. Please try again.');
                setShowToast(true);
            } finally {
                setIsLoading(false);
            }
        };

        getInitialSummary();
    }, [content]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const questionPrompt = `Based on this content: ${content}\n\nUser question: ${userMessage}\n\nPlease provide a detailed answer that directly relates to the content. If the question is not related to the content, politely inform the user that you can only answer questions about the provided content.`;
            const reply = await getAIResponse(questionPrompt, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            setToastMessage('Failed to get response from AI. Please try again.');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold">Content Assistant</h3>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-100 ml-auto'
                                : 'bg-gray-100'
                        } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    >
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <div className="animate-bounce">●</div>
                        <div className="animate-bounce delay-100">●</div>
                        <div className="animate-bounce delay-200">●</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about the content..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </form>

            {showToast && (
                <div className="absolute bottom-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {toastMessage}
                    <button
                        onClick={() => setShowToast(false)}
                        className="float-right font-bold"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
