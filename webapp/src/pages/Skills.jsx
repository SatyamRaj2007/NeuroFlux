import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Skills() {
    const navigate = useNavigate();
    const [selectedSkills, setSelectedSkills] = useState(['JavaScript', 'Python', 'C++']);
    const [inputValue, setInputValue] = useState('');

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            if (!selectedSkills.includes(inputValue.trim())) {
                setSelectedSkills([...selectedSkills, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const handleNext = () => {
        if (selectedSkills.length === 0) return;
        localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
        navigate('/onboarding/profile');
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <header className="w-full px-6 py-8 flex justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-surface text-xl" style={{fontVariationSettings: "'FILL' 1"}}>code</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-[12px] shadow-sm transform scale-110" />
                        <span className="text-xl font-bold tracking-tight text-on-surface">FirstPR Pro</span>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow flex items-center justify-center px-4 pb-20 relative z-10">
                <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl p-8 md:p-12 border border-outline-variant/20 shadow-[0_12px_32px_-4px_rgba(42,52,52,0.04)]">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <div className="h-1 w-12 bg-surface-container-high rounded-full"></div>
                        <div className="h-1 w-12 bg-surface-container-high rounded-full"></div>
                        <span className="ml-4 text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Step 3 of 4</span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Select your skills</h1>
                    <p className="text-on-surface-variant body-md mb-10">We'll use these to suggest the best first issues and pull requests for you to tackle.</p>

                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-outline">search</span>
                            </div>
                            <input 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline transition-all duration-200 outline-none relative z-20" 
                                placeholder="Search skills (e.g. React, Rust, Documentation)... press Enter to add" type="text" />
                                
                            {inputValue.trim().length > 0 && (
                                <ul className="absolute z-50 w-full bg-white mt-1 border border-outline-variant/20 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {['React', 'Rust', 'Documentation', 'TypeScript', 'Node.js', 'Go', 'Java', 'Ruby', 'PHP', 'HTML', 'CSS', 'Vue', 'Angular', 'Docker', 'Kubernetes', 'C#', 'Swift', 'Kotlin', 'Rust', 'GraphQL']
                                        .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()) && !selectedSkills.includes(s))
                                        .map(suggestion => (
                                            <li 
                                                key={suggestion}
                                                onClick={() => {
                                                    toggleSkill(suggestion);
                                                    setInputValue('');
                                                }}
                                                className="px-4 py-3 hover:bg-surface-container-high cursor-pointer text-on-surface border-b border-outline-variant/10 last:border-0"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Your Selection</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedSkills.map(skill => (
                                    <div key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-lg border border-tertiary-container/50 transition-all hover:bg-tertiary-container/80 cursor-default">
                                        <span className="label-md font-medium">{skill}</span>
                                        <button onClick={() => toggleSkill(skill)} className="flex items-center justify-center hover:bg-on-tertiary-container/10 rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                                {selectedSkills.length === 0 && <span className="text-sm text-on-surface-variant italic">No skills selected</span>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/10">
                            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Popular for first-timers</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <button onClick={() => toggleSkill('Bash')} className={`flex items-center justify-center gap-2 px-4 py-3 border ${selectedSkills.includes('Bash') ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/20 text-on-surface hover:bg-surface-container-high'} rounded-xl transition-colors`}>
                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
                                    <span className="label-md">Bash</span>
                                </button>
                                <button onClick={() => toggleSkill('Docs')} className={`flex items-center justify-center gap-2 px-4 py-3 border ${selectedSkills.includes('Docs') ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/20 text-on-surface hover:bg-surface-container-high'} rounded-xl transition-colors`}>
                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                                    <span className="label-md">Docs</span>
                                </button>
                                <button onClick={() => toggleSkill('SQL')} className={`flex items-center justify-center gap-2 px-4 py-3 border ${selectedSkills.includes('SQL') ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/20 text-on-surface hover:bg-surface-container-high'} rounded-xl transition-colors`}>
                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>database</span>
                                    <span className="label-md">SQL</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <button onClick={() => navigate('/onboarding/experience')} className="text-on-surface-variant font-semibold px-4 py-2 hover:text-on-surface transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">chevron_left</span> Back
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={selectedSkills.length === 0}
                            className={`px-8 py-3 rounded-xl font-bold transition-all transform flex items-center gap-2 ${selectedSkills.length === 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50' : 'bg-[#16A34A] hover:bg-[#15803d] text-white active:scale-95'}`}>
                            Next Step
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 -z-10 pointer-events-none opacity-40 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-tertiary/20 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
