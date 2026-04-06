import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExperienceLevel() {
    const navigate = useNavigate();
    const [level, setLevel] = useState('Intermediate');
    
    const handleNext = () => {
        // Save to local storage for the demo or just navigate
        localStorage.setItem('experienceLevel', level);
        navigate('/onboarding/skills');
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center">
            <main className="flex-grow flex items-center justify-center px-6 py-12 w-full relative">
                <div className="max-w-4xl w-full relative z-10">
                    {/* Progress bar removed as requested */}
                    
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">What's your experience?</h1>
                        <p className="text-on-surface-variant body-md max-w-md mx-auto">Help us tailor your FirstPR Pro feed by sharing your history with open source contributions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {/* Beginner Card */}
                        <button 
                            onClick={() => setLevel('Beginner')}
                            className={`group flex flex-col text-left p-8 rounded-xl transition-all duration-150 cloud-shadow focus:outline-none focus:ring-2 focus:ring-primary ${level === 'Beginner' ? 'bg-surface-container-low border-2 border-primary ring-offset-2 ring-2 ring-primary' : 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high'}`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${level === 'Beginner' ? 'bg-primary-container' : 'bg-tertiary-container'} flex items-center justify-center mb-6`}>
                                <span className="material-symbols-outlined text-on-tertiary-fixed">potted_plant</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface mb-2">Beginner</h3>
                            <p className="text-on-surface-variant body-md leading-relaxed">I'm new to open source and looking for my first repository to help.</p>
                            <div className={`mt-auto pt-6 flex items-center text-primary ${level === 'Beginner' ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                <span className="label-md font-semibold">{level === 'Beginner' ? 'Current Selection' : 'Select level'}</span>
                                <span className="material-symbols-outlined ml-2 text-sm">{level === 'Beginner' ? 'check_circle' : 'arrow_forward'}</span>
                            </div>
                        </button>

                        {/* Intermediate Card */}
                        <button 
                            onClick={() => setLevel('Intermediate')}
                            className={`group flex flex-col text-left p-8 rounded-xl transition-all duration-150 cloud-shadow focus:outline-none focus:ring-2 focus:ring-primary ${level === 'Intermediate' ? 'bg-surface-container-low border-2 border-primary ring-offset-2 ring-2 ring-primary' : 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high'}`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${level === 'Intermediate' ? 'bg-primary-container' : 'bg-primary-container'} flex items-center justify-center mb-6`}>
                                <span className="material-symbols-outlined text-on-primary-container">construction</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface mb-2">Intermediate</h3>
                            <p className="text-on-surface-variant body-md leading-relaxed">I've contributed a few times and understand the basic pull request workflow.</p>
                            <div className={`mt-auto pt-6 flex items-center text-primary ${level === 'Intermediate' ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                <span className="label-md font-semibold">{level === 'Intermediate' ? 'Current Selection' : 'Select level'}</span>
                                <span className="material-symbols-outlined ml-2 text-sm">{level === 'Intermediate' ? 'check_circle' : 'arrow_forward'}</span>
                            </div>
                        </button>

                        {/* Advanced Card */}
                        <button 
                            onClick={() => setLevel('Advanced')}
                            className={`group flex flex-col text-left p-8 rounded-xl transition-all duration-150 cloud-shadow focus:outline-none focus:ring-2 focus:ring-primary ${level === 'Advanced' ? 'bg-surface-container-low border-2 border-primary ring-offset-2 ring-2 ring-primary' : 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high'}`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${level === 'Advanced' ? 'bg-primary-container' : 'bg-secondary-container'} flex items-center justify-center mb-6`}>
                                <span className="material-symbols-outlined text-on-secondary-container">terminal</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface mb-2">Advanced</h3>
                            <p className="text-on-surface-variant body-md leading-relaxed">I'm an experienced contributor looking for high-impact architectural challenges.</p>
                            <div className={`mt-auto pt-6 flex items-center text-primary ${level === 'Advanced' ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                <span className="label-md font-semibold">{level === 'Advanced' ? 'Current Selection' : 'Select level'}</span>
                                <span className="material-symbols-outlined ml-2 text-sm">{level === 'Advanced' ? 'check_circle' : 'arrow_forward'}</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex justify-end border-t border-outline-variant/10 pt-8">
                        <button onClick={handleNext} className="px-8 py-3 rounded-md bg-primary text-on-tertiary font-bold hover:bg-primary-dim transition-all active:scale-95 shadow-sm flex items-center gap-2">
                            Next Step
                            <span className="material-symbols-outlined text-lg">trending_flat</span>
                        </button>
                    </div>
                </div>
            </main>
            
            {/* Footer removed as requested */}

            <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none">
                <div className="w-[600px] h-[600px] bg-gradient-to-bl from-primary-container to-transparent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="fixed bottom-0 left-0 -z-10 opacity-5 pointer-events-none">
                <div className="w-[400px] h-[400px] bg-gradient-to-tr from-secondary-container to-transparent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            </div>
        </div>
    );
}
