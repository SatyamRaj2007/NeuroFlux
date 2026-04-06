import React, { useState, useRef, useEffect } from 'react';

export default function HelperBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { text: "Hi there! I'm your FirstPR guide. Ask me anything about finding issues or contributing!", isBot: true }
    ]);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');

        // Mock bot logic
        setTimeout(() => {
            let reply = "That's a great question! I'm just a demo bot right now, but a real AI could give you full PR tutorials.";
            const lower = userMsg.toLowerCase();
            if (lower.includes('bookmark') || lower.includes('save')) {
                reply = "To bookmark a repository, click the little ribbon icon in the top right corner of any issue card on the dashboard.";
            } else if (lower.includes('pr') || lower.includes('pull request')) {
                reply = "A Pull Request (PR) is how you submit your code changes to an open source project. You fork the repo, make a branch, commit your code, and then push it to propose your changes.";
            } else if (lower.includes('filter') || lower.includes('find') || lower.includes('easy')) {
                reply = "You can filter issues using the sidebar on the left. Try clicking 'JavaScript' or checking 'Good First Issue' to narrow down your results!";
            } else if (lower.includes('commit') || lower.includes('git')) {
                reply = "When you commit code, you're saving a snapshot of your changes. Use 'git commit -m \"your detailed message\"' in your terminal.";
            } else if (lower.includes('profile')) {
                reply = "To update your profile or delete your account, click the 'Profile' tag at the very top of your screen!";
            }

            setMessages(prev => [...prev, { text: reply, isBot: true }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-outline-variant/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    <div className="bg-[#006e2d] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-white">smart_toy</span>
                            <span className="font-bold">FirstPR Helper</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface md:bg-[#f0f4f3]/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] rounded-xl p-3 text-sm shadow-sm ${msg.isBot ? 'bg-white border border-outline-variant/10 text-on-surface rounded-tl-sm' : 'bg-[#006e2d] text-white rounded-tr-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-outline-variant/20 flex gap-2">
                        <input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-surface-container-lowest border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-[#006e2d]"
                            placeholder="Ask me anything..."
                        />
                        <button onClick={handleSend} className="bg-[#006e2d] text-white p-2 rounded-xl hover:bg-[#005c25] transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </div>
            )}
            
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-[#006e2d] text-white rounded-full shadow-2xl hover:bg-[#005c25] hover:scale-105 transition-all flex items-center justify-center relative group">
                    <span className="material-symbols-outlined text-3xl group-hover:hidden">forum</span>
                    <span className="material-symbols-outlined text-3xl hidden group-hover:block transition-all duration-300 transform rotate-12">smart_toy</span>
                </button>
            )}
        </div>
    );
}
