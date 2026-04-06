import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const MOCK_LEADERS = [
    { id: 'm1', full_name: 'Linus Torvalds', experience_level: 'Architect', avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4', contributions: 8942 },
    { id: 'm2', full_name: 'Dan Abramov', experience_level: 'Architect', avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4', contributions: 5210 },
    { id: 'm3', full_name: 'Evan You', experience_level: 'Architect', avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4', contributions: 4105 },
    { id: 'm4', full_name: 'Sarah Drasner', experience_level: 'Maintainer', avatar_url: 'https://avatars.githubusercontent.com/u/2281088?v=4', contributions: 3102 },
    { id: 'm5', full_name: 'Guillermo Rauch', experience_level: 'Maintainer', avatar_url: 'https://avatars.githubusercontent.com/u/13041?v=4', contributions: 2750 },
    { id: 'm6', full_name: 'Addy Osmani', experience_level: 'Maintainer', avatar_url: 'https://avatars.githubusercontent.com/u/110953?v=4', contributions: 2140 },
    { id: 'm7', full_name: 'Cassidy Williams', experience_level: 'Maintainer', avatar_url: 'https://avatars.githubusercontent.com/u/1480753?v=4', contributions: 1850 },
];

export default function Leaderboard() {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserEmail = 'alex.rivera@firstpr.pro'; // Match the mock email used across the app

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const { data: realProfiles, error } = await supabase.from('profiles').select('*');
                let realUsers = [];
                if (!error && realProfiles) {
                    realUsers = realProfiles.map(p => ({
                        ...p,
                        // Assign a mocked score based on experience level
                        contributions: p.experience_level === 'Architect' ? Math.floor(Math.random() * 500) + 1000 : 
                                     p.experience_level === 'Maintainer' ? Math.floor(Math.random() * 300) + 200 : 
                                     Math.floor(Math.random() * 50) + 10,
                        isReal: true
                    }));
                }

                const combined = [...MOCK_LEADERS, ...realUsers].sort((a, b) => b.contributions - a.contributions);
                setLeaders(combined);
            } catch (err) {
                console.error("Error fetching leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    const topThree = leaders.slice(0, 3);
    const rest = leaders.slice(3);
    const myRankIndex = leaders.findIndex(l => l.email === currentUserEmail);
    const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 'N/A';
    const myProfile = myRankIndex !== -1 ? leaders[myRankIndex] : null;

    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen pb-24">
            <header className="fixed top-0 w-full z-50 bg-emerald-50 dark:bg-[#1a1c1b]">
                <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                            <span className="text-xl font-bold tracking-tight text-[#2a3434] dark:text-emerald-50">FirstPR Pro</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6 font-['Inter'] body-md tracking-tight">
                            <span onClick={() => navigate('/dashboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2 cursor-pointer">Discover</span>
                            <span onClick={() => navigate('/dashboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2 cursor-pointer">Bookmarks</span>
                            <span className="text-[#006e2d] dark:text-emerald-400 font-semibold border-b-2 border-[#006e2d] pb-1 cursor-default">Leaderboard</span>
                            <span onClick={() => navigate('/onboarding/profile')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] hover:bg-[#e1eae9] transition-colors duration-150 rounded px-2 cursor-pointer">Profile</span>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="pt-24 px-4 max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Global Leaderboard</h1>
                    <p className="text-on-surface-variant body-md">Ranked by total open-source contributions.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 h-64">
                            {/* Silver - Rank 2 */}
                            {topThree[1] && (
                                <div className="flex flex-col items-center animate-in slide-in-from-bottom flex-1 max-w-[200px]">
                                    <div className="relative mb-4">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#C0C0C0] text-black font-extrabold rounded-full flex items-center justify-center z-10 text-sm shadow-lg ring-2 ring-white">2</div>
                                        <img src={topThree[1].avatar_url} className="w-20 h-20 rounded-full border-4 border-[#C0C0C0] shadow-xl object-cover" alt="avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + topThree[1].full_name; }} />
                                    </div>
                                    <h3 className="font-bold text-center truncate w-full px-2" title={topThree[1].full_name}>{topThree[1].full_name || topThree[1].email}</h3>
                                    <span className="font-extrabold text-primary">{topThree[1].contributions.toLocaleString()}</span>
                                    <div className="w-full h-32 bg-gradient-to-t from-surface-container-high to-transparent mt-4 rounded-t-2xl border-t-4 border-[#C0C0C0]"></div>
                                </div>
                            )}

                            {/* Gold - Rank 1 */}
                            {topThree[0] && (
                                <div className="flex flex-col items-center animate-in slide-in-from-bottom flex-1 max-w-[200px] -mt-12">
                                    <div className="relative mb-4">
                                        <div className="absolute -top-4 -right-3 w-10 h-10 bg-[#FFD700] text-black font-extrabold rounded-full flex items-center justify-center z-10 text-lg shadow-lg ring-4 ring-white">1</div>
                                        <img src={topThree[0].avatar_url} className="w-28 h-28 rounded-full border-4 border-[#FFD700] shadow-2xl object-cover" alt="avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + topThree[0].full_name; }} />
                                        <span className="material-symbols-outlined absolute -bottom-2 right-10 text-[#FFD700] text-3xl drop-shadow-md" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                                    </div>
                                    <h3 className="font-extrabold text-lg text-center truncate w-full px-2" title={topThree[0].full_name}>{topThree[0].full_name || topThree[0].email}</h3>
                                    <span className="font-extrabold text-[#006e2d] text-xl">{topThree[0].contributions.toLocaleString()}</span>
                                    <div className="w-full h-44 bg-gradient-to-t from-[#FFD700]/20 to-transparent mt-4 rounded-t-2xl border-t-4 border-[#FFD700]"></div>
                                </div>
                            )}

                            {/* Bronze - Rank 3 */}
                            {topThree[2] && (
                                <div className="flex flex-col items-center animate-in slide-in-from-bottom flex-1 max-w-[200px]">
                                    <div className="relative mb-4">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#CD7F32] text-white font-extrabold rounded-full flex items-center justify-center z-10 text-sm shadow-lg ring-2 ring-white">3</div>
                                        <img src={topThree[2].avatar_url} className="w-20 h-20 rounded-full border-4 border-[#CD7F32] shadow-xl object-cover" alt="avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + topThree[2].full_name; }} />
                                    </div>
                                    <h3 className="font-bold text-center truncate w-full px-2" title={topThree[2].full_name}>{topThree[2].full_name || topThree[2].email}</h3>
                                    <span className="font-extrabold text-primary">{topThree[2].contributions.toLocaleString()}</span>
                                    <div className="w-full h-24 bg-gradient-to-t from-surface-container-high to-transparent mt-4 rounded-t-2xl border-t-4 border-[#CD7F32]"></div>
                                </div>
                            )}
                        </div>

                        {/* List ranking */}
                        <div className="flex flex-col gap-3">
                            {rest.map((user, idx) => {
                                const rank = idx + 4;
                                const isMe = user.email === currentUserEmail;
                                return (
                                    <div key={user.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-transform hover:scale-[1.01] ${isMe ? 'bg-primary-container ring-2 ring-primary cloud-shadow' : 'bg-surface-container-lowest ring-1 ring-outline-variant/10'}`}>
                                        <div className="w-12 text-center font-bold text-on-surface-variant text-lg">#{rank}</div>
                                        <img src={user.avatar_url} className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-container-highest" alt="avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + user.full_name; }} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-bold truncate ${isMe ? 'text-on-primary-container' : 'text-on-surface'}`}>
                                                {user.full_name || user.email} {isMe && <span className="ml-2 text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full">YOU</span>}
                                            </h4>
                                            <span className="text-xs text-on-surface-variant">{user.experience_level || 'Contributor'}</span>
                                        </div>
                                        <div className="font-extrabold text-on-surface text-right">
                                            {user.contributions.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant ml-1 hidden sm:inline">PRs</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </main>

            {myProfile && (
                <div className="fixed bottom-0 left-0 w-full bg-surface-container-highest border-t border-outline-variant/20 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 hidden md:block animate-in slide-in-from-bottom">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold">
                                #{myRank}
                            </div>
                            <div>
                                <div className="font-bold">Your Ranking</div>
                                <div className="text-sm text-on-surface-variant">Keep contributing to climb the leaderboard!</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-extrabold text-2xl text-primary">{myProfile.contributions}</div>
                            <div className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Contributions</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
