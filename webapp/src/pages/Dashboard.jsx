import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HelperBot from '../components/HelperBot';

export default function Dashboard() {
    const navigate = useNavigate();
    
    // States
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filter States
    const [languages, setLanguages] = useState(['JavaScript', 'Python', 'TypeScript']); // Fallbacks
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [difficulty, setDifficulty] = useState('good first issue');
    const [searchInput, setSearchInput] = useState('');
    
    // Engagement tracking
    const [bookmarks, setBookmarks] = useState([]);
    const [searchCount, setSearchCount] = useState(0);
    const [currentView, setCurrentView] = useState('discover');

    // Initialization
    useEffect(() => {
        try {
            const storedSkills = JSON.parse(localStorage.getItem('selectedSkills') || '[]');
            if (storedSkills.length > 0) {
                setLanguages(storedSkills);
                setSelectedLanguage(storedSkills[0]);
            } else {
                setSelectedLanguage('JavaScript');
            }
        } catch(e) {
            setSelectedLanguage('JavaScript');
        }
        
        try {
            const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            setBookmarks(storedBookmarks);
        } catch(e) {}
    }, []);

    // GitHub Fetch Logic (Debounced)
    useEffect(() => {
        if (!selectedLanguage) return;
        let isMounted = true;
        
        const fetchIssues = async () => {
            setLoading(true);
            setError(null);
            try {
                let q = `is:issue is:open`;
                if (difficulty) q += ` label:"${difficulty}"`;
                if (selectedLanguage) q += ` language:"${selectedLanguage}"`;
                if (searchInput) q += ` ${searchInput}`;

                const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=updated&per_page=12`);
                
                if (response.status === 403) {
                    throw new Error('GitHub API Rate Limit Exceeded! Try again in a minute.');
                }
                if (!response.ok) throw new Error('Failed to fetch from GitHub');
                
                const data = await response.json();
                if (isMounted) {
                    setIssues(data.items || []);
                    setSearchCount(c => c + 1);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
                setIssues([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timeout = setTimeout(fetchIssues, 800);
        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [selectedLanguage, difficulty, searchInput]);

    // Handlers
    const toggleBookmark = (issue) => {
        let newBookmarks;
        if (isBookmarked(issue.id)) {
            newBookmarks = bookmarks.filter(b => b.id !== issue.id);
        } else {
            newBookmarks = [...bookmarks, {
                id: issue.id,
                title: issue.title,
                html_url: issue.html_url,
                repo: issue.repository_url ? issue.repository_url.split('/').slice(-2).join('/') : 'unknown'
            }];
        }
        setBookmarks(newBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    };

    const isBookmarked = (id) => bookmarks.some(b => String(b.id) === String(id));
    const progressLevel = 1 + Math.floor(searchCount / 5) + Math.floor(bookmarks.length / 2);

    return (
        <div className="font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen bg-surface">
            <nav className="bg-emerald-50 dark:bg-[#1a1c1b] fixed top-0 w-full z-50">
                <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-2 shrink-0">
                            <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                            <span className="text-xl font-bold tracking-tight text-[#2a3434] dark:text-emerald-50">FirstPR Pro</span>
                        </div>
                        <div className="hidden md:flex flex-1 max-w-xl">
                            <div className="relative w-full group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                                <input 
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-primary rounded-xl py-2 pl-10 pr-4 text-body-md transition-all" 
                                    placeholder="Search issues, repositories, or topics" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-on-surface-variant font-['Inter'] body-md tracking-tight">
                            <span 
                                onClick={() => setCurrentView('discover')} 
                                className={`cursor-pointer ${currentView === 'discover' ? 'text-[#006e2d] dark:text-emerald-400 font-semibold border-b-2 border-[#006e2d] pb-1' : 'text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2'}`}>
                                Discover
                            </span>
                            <span 
                                onClick={() => setCurrentView('bookmarks')} 
                                className={`cursor-pointer ${currentView === 'bookmarks' ? 'text-[#006e2d] dark:text-emerald-400 font-semibold border-b-2 border-[#006e2d] pb-1' : 'text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2'}`}>
                                Bookmarks <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full ml-1">{bookmarks.length}</span>
                            </span>
                            <span onClick={() => navigate('/leaderboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2 cursor-pointer">Leaderboard</span>
                            <span onClick={() => navigate('/onboarding/profile')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2 cursor-pointer">Profile</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-20 px-6 max-w-[1440px] mx-auto flex gap-6">
                <aside className="h-full w-64 hidden lg:flex flex-col sticky top-20 gap-4 p-4 bg-[#f0f4f3] dark:bg-[#1a1c1b] rounded-xl">
                    <div className="flex flex-col gap-1 mb-4">
                        <h2 className="text-lg font-bold text-[#2a3434]">Project Filter</h2>
                        <p className="text-on-surface-variant text-xs">Refine your search</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-[#006e2d]">
                                <span className="material-symbols-outlined text-lg">tune</span>
                                <span className="font-medium text-sm">Difficulty</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        checked={difficulty === 'good first issue'} 
                                        onChange={() => setDifficulty('good first issue')}
                                        name="difficulty"
                                        className="text-primary focus:ring-primary w-4 h-4" type="radio" />
                                    <span className="text-sm text-on-surface">Easy (Good First Issue)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        checked={difficulty === 'help wanted'} 
                                        onChange={() => setDifficulty('help wanted')}
                                        name="difficulty"
                                        className="text-primary focus:ring-primary w-4 h-4" type="radio" />
                                    <span className="text-sm text-on-surface">Medium (Help Wanted)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        checked={difficulty === 'bug'} 
                                        onChange={() => setDifficulty('bug')}
                                        name="difficulty"
                                        className="text-primary focus:ring-primary w-4 h-4" type="radio" />
                                    <span className="text-sm text-on-surface">Hard (Bugs)</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-[#006e2d]">
                                <span className="material-symbols-outlined text-lg">code</span>
                                <span className="font-medium text-sm">Language</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {languages.map(lang => (
                                    <span 
                                        key={lang}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className={`px-3 py-1 rounded-md text-xs border shadow-sm cursor-pointer transition-colors ${selectedLanguage === lang ? 'bg-white text-[#006e2d] font-medium border-transparent' : 'text-[#576160] border-outline-variant/20 hover:bg-[#e1eae9]'}`}>
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="flex-1 pb-12">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">{currentView === 'discover' ? 'Discover Opportunities' : 'Your Bookmarks'}</h1>
                            <p className="text-on-surface-variant body-md">{currentView === 'discover' ? 'Live from GitHub based on your selected skills.' : 'Saved issues you are planning to contribute to.'}</p>
                        </div>
                    </header>

                    {currentView === 'discover' ? (
                        <>
                            {error && (
                                <div className="p-4 bg-error-container text-on-error-container rounded-lg mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined">error</span>
                                    {error}
                                </div>
                            )}

                            {loading && !error && (
                                <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-primary">
                                    <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                                    <span className="font-medium">Fetching open source issues...</span>
                                </div>
                            )}

                            {!loading && !error && issues.length === 0 && (
                                <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-5xl opacity-50">search_off</span>
                                    <span className="font-medium">No issues found. Try widening your search.</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {!loading && issues.map(issue => {
                                    const repoName = issue.repository_url ? issue.repository_url.split('/').slice(-2).join('/') : 'repository';
                                    return (
                                        <article key={issue.id} className="bg-surface-container-lowest p-6 rounded-xl relative group ring-1 ring-outline-variant/10 hover:ring-primary/20 transition-all flex flex-col">
                                            <div 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleBookmark(issue);
                                                }}
                                                className={`absolute top-4 right-4 p-1.5 rounded-full cursor-pointer transition-colors z-20 ${isBookmarked(issue.id) ? 'text-primary bg-primary-container' : 'text-outline hover:bg-surface-container-high'}`}>
                                                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: isBookmarked(issue.id) ? "'FILL' 1" : "'FILL' 0"}}>bookmark</span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2 pr-8">
                                                <span className="text-xs font-medium text-on-surface-variant/70">{repoName}</span>
                                            </div>
                                            <a href={issue.html_url} target="_blank" rel="noreferrer" className="text-lg font-bold text-on-surface leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {issue.title}
                                            </a>
                                            <div className="flex-1"></div>
                                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                                {issue.labels && issue.labels.slice(0, 3).map(label => (
                                                    <span key={label.id} className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-sm uppercase tracking-wider max-w-[120px] truncate" title={label.name}>
                                                        {label.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {bookmarks.length === 0 ? (
                                <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-5xl opacity-50">bookmark_border</span>
                                    <span className="font-medium">You haven't saved any issues yet.</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {bookmarks.map(issue => (
                                        <article key={issue.id} className="bg-surface-container-lowest p-6 rounded-xl relative group ring-1 ring-outline-variant/10 hover:ring-primary/20 transition-all flex flex-col">
                                            <div 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleBookmark(issue);
                                                }}
                                                className={`absolute top-4 right-4 p-1.5 rounded-full cursor-pointer transition-colors z-20 ${isBookmarked(issue.id) ? 'text-primary bg-primary-container' : 'text-outline hover:bg-surface-container-high'}`}>
                                                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: isBookmarked(issue.id) ? "'FILL' 1" : "'FILL' 0"}}>bookmark</span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2 pr-8">
                                                <span className="text-xs font-medium text-on-surface-variant/70">{issue.repo}</span>
                                            </div>
                                            <a href={issue.html_url} target="_blank" rel="noreferrer" className="text-lg font-bold text-on-surface leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {issue.title}
                                            </a>
                                            <div className="flex-1"></div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>

                <aside className="w-80 hidden xl:flex flex-col gap-6 sticky top-20 h-fit">
                    <div className="bg-surface-container-low rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-on-surface">Your Progress</h2>
                            <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-1 rounded">Lv. {progressLevel}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-none shadow-sm">
                                <span className="text-sm font-medium">Profile Setup Complete</span>
                                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-none shadow-sm">
                                <span className="text-sm font-medium">Exploration Score</span>
                                <span className="text-primary font-bold">{searchCount * 10} pts</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-none shadow-sm">
                                <span className="text-sm font-medium">Bookmarks Saved</span>
                                <span className="text-primary font-bold">{bookmarks.length}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
            {currentView === 'discover' && <HelperBot />}
        </div>
    );
}
