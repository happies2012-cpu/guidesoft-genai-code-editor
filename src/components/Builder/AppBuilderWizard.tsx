import React, { useState } from 'react';
import { Smartphone, Code, Play, Layers, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '../../services/workflows/WorkflowEngine';

export const AppBuilderWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [platform, setPlatform] = useState<'react-native' | 'flutter'>('react-native');
    const [prompt, setPrompt] = useState('');
    const { startWorkflow, activeWorkflows } = useWorkflowStore();
    const [buildId, setBuildId] = useState<string | null>(null);

    const handleBuild = () => {
        const id = Math.random().toString(36).substring(7);
        setBuildId(id);
        startWorkflow({
            id,
            name: `Build ${platform} App`,
            description: prompt,
            status: 'idle',
            steps: [
                { id: '1', type: 'prompt', name: 'Analyze Requirements', params: { prompt } },
                { id: '2', type: 'code', name: 'Generate Scaffolding', params: { platform } },
                { id: '3', type: 'terminal', name: 'Install Dependencies', params: {} },
                { id: '4', type: 'review', name: 'Verify Build', params: {} }
            ]
        });
        setStep(3);
    };

    return (
        <div className="flex h-full bg-[#050505] text-white p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/20">
                        <Smartphone size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Mobile App Builder AI</h1>
                    <p className="text-gray-400 text-lg">Generate native iOS and Android apps from natural language.</p>
                </div>

                {step === 1 && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers size={20} className="text-blue-500"/> Choose Stack</h2>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <button 
                                onClick={() => setPlatform('react-native')}
                                className={`p-6 rounded-xl border-2 transition-all text-left ${platform === 'react-native' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 hover:border-white/10 bg-white/5'}`}
                            >
                                <div className="font-bold text-lg mb-2">React Native</div>
                                <p className="text-sm text-gray-400">Best for JS/React developers. Cross-platform excellence.</p>
                            </button>
                            <button 
                                onClick={() => setPlatform('flutter')}
                                className={`p-6 rounded-xl border-2 transition-all text-left ${platform === 'flutter' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 hover:border-white/10 bg-white/5'}`}
                            >
                                <div className="font-bold text-lg mb-2">Flutter</div>
                                <p className="text-sm text-gray-400">High-performance rendering with Dart. Pixel perfect.</p>
                            </button>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            Next: Describe App
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Code size={20} className="text-green-500"/> Describe Requirements</h2>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A fitness tracking app with a workout timer, history log, and social sharing features..."
                            className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-gray-200 focus:border-green-500 focus:outline-none mb-8 resize-none"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">
                                Back
                            </button>
                            <button onClick={handleBuild} className="flex-[2] py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <Play size={20} /> Generate App
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && buildId && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {activeWorkflows[buildId]?.status === 'completed' 
                                    ? <span className="text-green-500 flex items-center gap-2"><CheckCircle /> Build Complete</span>
                                    : <span className="text-blue-500 flex items-center gap-2"><Play className="animate-pulse" /> Building...</span>
                                }
                            </h2>
                            <span className="text-sm text-gray-500 font-mono">ID: {buildId}</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            {activeWorkflows[buildId]?.steps.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        activeWorkflows[buildId]?.status === 'completed' ? 'bg-green-500 text-black' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold">{s.name}</div>
                                        <div className="text-xs text-gray-500">{s.type.toUpperCase()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {activeWorkflows[buildId]?.status === 'completed' && (
                             <button onClick={() => { setStep(1); setPrompt(''); }} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
                                Start New Build
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
