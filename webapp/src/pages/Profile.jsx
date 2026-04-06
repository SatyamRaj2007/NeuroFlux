import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('Alex Rivera');
    const [email, setEmail] = useState('alex.rivera@firstpr.pro');
    const [bio, setBio] = useState('Passionate about building scalable web applications and improving documentation for emerging open-source projects.');
    const [experience, setExperience] = useState('Contributor');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    // GitHub Integration States
    const [githubUsername, setGithubUsername] = useState('');
    const [linkedGithubData, setLinkedGithubData] = useState(null);
    const [compareUser1, setCompareUser1] = useState('');
    const [compareUser2, setCompareUser2] = useState('');
    const [compareResults, setCompareResults] = useState(null);
    const [comparing, setComparing] = useState(false);

    useEffect(() => {
        const gh = localStorage.getItem('githubUsername');
        if (gh) {
            setGithubUsername(gh);
            fetchGithubProfile(gh).then(setLinkedGithubData);
        }
    }, []);

    const linkAccount = async () => {
        if (!githubUsername) return;
        setLoading(true);
        localStorage.setItem('githubUsername', githubUsername);
        const data = await fetchGithubProfile(githubUsername);
        setLinkedGithubData(data);
        setLoading(false);
    };

    const fetchGithubProfile = async (username) => {
        try {
            const res = await fetch(`https://api.github.com/users/${username}`);
            if (res.ok) return await res.json();
            return null;
        } catch (e) {
            return null;
        }
    };

    const runComparison = async () => {
        if (!compareUser1 || !compareUser2) return;
        setComparing(true);
        setCompareResults(null);
        const [d1, d2] = await Promise.all([
            fetchGithubProfile(compareUser1),
            fetchGithubProfile(compareUser2)
        ]);
        setCompareResults({ user1: d1, user2: d2 });
        setComparing(false);
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
        } catch (error) {
            alert('Error uploading avatar! Ensure the avatars bucket is created and public in Supabase.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .single();
                
                if (data) {
                    if (data.full_name) setName(data.full_name);
                    if (data.bio) setBio(data.bio);
                    if (data.experience_level) setExperience(data.experience_level);
                    if (data.avatar_url) setAvatarUrl(data.avatar_url);
                }
            } catch (err) {
                console.error("Error fetching profile on load", err);
            }
        };

        fetchProfile();

        const storedLevel = localStorage.getItem('experienceLevel');
        if (storedLevel && !avatarUrl) {
            setExperience(storedLevel === 'Beginner' ? 'Contributor' : (storedLevel === 'Intermediate' ? 'Maintainer' : 'Architect'));
        }
    }, [email]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Attempt to save to Supabase
            const { error } = await supabase
                .from('profiles')
                .upsert({ email, full_name: name, bio, experience_level: experience, avatar_url: avatarUrl }, { onConflict: 'email' });
            
            if (error) {
                console.warn("Supabase save error (might need table setup):", error);
                // Proceed anyway for demo
            }
        } catch (err) {
            console.error("Error saving profile", err);
        } finally {
            setLoading(false);
            navigate('/dashboard');
        }
    };

    const handleDeleteUser = async () => {
        if (!window.confirm("Are you sure you want to delete your profile? This action will permanently erase your data and cannot be undone.")) return;
        
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').delete().eq('email', email);
            if (error) throw error;
            
            localStorage.removeItem('selectedSkills');
            localStorage.removeItem('experienceLevel');
            localStorage.removeItem('bookmarks');
            
            navigate('/');
        } catch (err) {
            console.error("Error deleting profile", err);
            alert("Failed to delete profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
            <header className="fixed top-0 w-full z-50 bg-emerald-50 dark:bg-[#1a1c1b]">
                <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                            <span className="text-xl font-bold tracking-tight text-[#2a3434] dark:text-emerald-50">FirstPR Pro</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6 font-['Inter'] body-md tracking-tight">
                            <span onClick={() => navigate('/dashboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] transition-colors cursor-pointer">Discover</span>
                            <span onClick={() => navigate('/dashboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] transition-colors cursor-pointer">Bookmarks</span>
                            <span onClick={() => navigate('/leaderboard')} className="text-[#576160] dark:text-gray-400 hover:text-[#2a3434] transition-colors cursor-pointer">Leaderboard</span>
                            <span className="text-[#006e2d] dark:text-emerald-400 font-semibold border-b-2 border-[#006e2d] pb-1 cursor-default">Profile</span>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="relative group mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden cloud-shadow border-4 border-surface-container-lowest bg-surface-container-highest flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => setAvatarUrl(null)} />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-outline-variant">person</span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-on-primary rounded-full cloud-shadow active:scale-90 transition-transform cursor-pointer hover:bg-primary-dim">
                            <span className="material-symbols-outlined text-sm">{uploading ? 'hourglass_empty' : 'edit'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface">{name}</h1>
                    <p className="text-on-surface-variant font-['Inter'] body-md mt-1">Full-stack Developer • Open Source Contributor</p>
                </div>

                <div className="space-y-6">
                    <section className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                            <h2 className="font-bold text-lg tracking-tight">User Info</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md" type="text" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md" type="email" />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bio</label>
                                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md resize-none" rows="3"></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>military_tech</span>
                            <h2 className="font-bold text-lg tracking-tight">Experience Level</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="relative flex items-center p-4 rounded-lg bg-surface-container-low border-2 border-transparent cursor-pointer has-[:checked]:border-primary transition-all">
                                <input checked={experience === 'Contributor'} onChange={() => setExperience('Contributor')} className="hidden" name="exp" type="radio" />
                                <div className="flex flex-col">
                                    <span className="font-semibold body-md">Contributor</span>
                                    <span className="text-xs text-on-surface-variant">0-5 Merged PRs</span>
                                </div>
                                {experience === 'Contributor' && <span className="material-symbols-outlined ml-auto text-primary">check_circle</span>}
                            </label>
                            <label className="relative flex items-center p-4 rounded-lg bg-surface-container-low border-2 border-transparent cursor-pointer has-[:checked]:border-primary transition-all">
                                <input checked={experience === 'Maintainer'} onChange={() => setExperience('Maintainer')} className="hidden" name="exp" type="radio" />
                                <div className="flex flex-col">
                                    <span className="font-semibold body-md">Maintainer</span>
                                    <span className="text-xs text-on-surface-variant">5-50 Merged PRs</span>
                                </div>
                                {experience === 'Maintainer' && <span className="material-symbols-outlined ml-auto text-primary">check_circle</span>}
                            </label>
                            <label className="relative flex items-center p-4 rounded-lg bg-surface-container-low border-2 border-transparent cursor-pointer has-[:checked]:border-primary transition-all">
                                <input checked={experience === 'Architect'} onChange={() => setExperience('Architect')} className="hidden" name="exp" type="radio" />
                                <div className="flex flex-col">
                                    <span className="font-semibold body-md">Architect</span>
                                    <span className="text-xs text-on-surface-variant">50+ Merged PRs</span>
                                </div>
                                {experience === 'Architect' && <span className="material-symbols-outlined ml-auto text-primary">check_circle</span>}
                            </label>
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>link</span>
                            <h2 className="font-bold text-lg tracking-tight">Connected Accounts</h2>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            {!linkedGithubData ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input 
                                        value={githubUsername} 
                                        onChange={e => setGithubUsername(e.target.value)} 
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md" 
                                        placeholder="Enter your GitHub username" 
                                        type="text" 
                                    />
                                    <button onClick={linkAccount} className="px-6 py-2.5 bg-[#24292e] text-white rounded-lg font-semibold hover:bg-[#1b1f23] transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">code_blocks</span> Link GitHub
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl bg-surface-container-low">
                                    <div className="flex items-center gap-4">
                                        <img src={linkedGithubData.avatar_url} alt="GitHub Avatar" className="w-12 h-12 rounded-full border border-outline-variant/20" />
                                        <div>
                                            <h3 className="font-bold text-on-surface leading-tight">{linkedGithubData.name || linkedGithubData.login}</h3>
                                            <a href={linkedGithubData.html_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">@{linkedGithubData.login}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hidden sm:flex">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Connected
                                        </span>
                                        <button onClick={() => { localStorage.removeItem('githubUsername'); setLinkedGithubData(null); setGithubUsername(''); }} className="p-2 text-on-surface-variant hover:text-[#ba1a1a] transition-colors" title="Disconnect">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>compare_arrows</span>
                            <h2 className="font-bold text-lg tracking-tight">Compare Contributors</h2>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <input 
                                value={compareUser1} 
                                onChange={e => setCompareUser1(e.target.value)} 
                                className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md" 
                                placeholder="Username 1 (e.g. torvalds)" 
                                type="text" 
                            />
                            <div className="hidden md:flex items-center justify-center text-on-surface-variant font-bold px-2">VS</div>
                            <input 
                                value={compareUser2} 
                                onChange={e => setCompareUser2(e.target.value)} 
                                className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-0 transition-colors body-md" 
                                placeholder="Username 2 (e.g. gaearon)" 
                                type="text" 
                            />
                            <button onClick={runComparison} disabled={comparing || !compareUser1 || !compareUser2} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {comparing ? 'Checking...' : 'Run'}
                                <span className="material-symbols-outlined text-sm">equalizer</span>
                            </button>
                        </div>

                        {compareResults && (
                            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6">
                                {[compareResults.user1, compareResults.user2].map((user, idx) => (
                                    <div key={idx} className={`flex flex-col gap-4 p-4 rounded-xl ${user ? 'bg-surface-container-low' : 'bg-[#ffdad6]/20 text-[#ba1a1a]'}`}>
                                        {user ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar_url} className="w-10 h-10 rounded-full cloud-shadow border border-white" alt="avatar" />
                                                    <div className="font-bold truncate text-on-surface">{user.login}</div>
                                                </div>
                                                <div className="flex flex-col gap-2 text-sm mt-2">
                                                    <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                                                        <span className="text-on-surface-variant">Public Repos</span>
                                                        <span className="font-extrabold text-primary">{user.public_repos}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                                                        <span className="text-on-surface-variant">Followers</span>
                                                        <span className="font-extrabold text-primary">{user.followers}</span>
                                                    </div>
                                                    <div className="flex justify-between pb-1">
                                                        <span className="text-on-surface-variant">Public Gists</span>
                                                        <span className="font-extrabold text-primary">{user.public_gists}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex items-center justify-center font-semibold text-center text-sm">
                                                User {idx === 0 ? compareUser1 : compareUser2} not found.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-outline-variant/10">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={handleSave} disabled={loading} className="w-full md:w-auto px-8 py-3 bg-primary text-on-primary rounded-xl font-bold body-md cloud-shadow hover:bg-primary-dim transition-colors active:scale-95">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                    <button onClick={handleDeleteUser} disabled={loading} className="w-full md:w-auto px-6 py-2.5 border-2 border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-semibold body-md hover:bg-[#ffdad6]/50 transition-colors active:scale-95">
                        Delete Profile
                    </button>
                </div>
            </main>
        </div>
    );
}
