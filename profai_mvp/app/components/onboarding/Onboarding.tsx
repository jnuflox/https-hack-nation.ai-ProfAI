import React, { useState } from 'react';
import { OnboardingData, Theme } from '@/types/onboarding';
import { LogoIcon } from '@/components/icons';

interface OnboardingProps {
    onFinish: (data: OnboardingData) => void;
    themes: Theme[];
    isGenerating: boolean;
}

const GOALS = ['Understand AI basics', 'Build personal projects', 'Career advancement', 'Stay updated on tech'];
const METHODS = ['Quick Summaries', 'Deep Dives', 'Videos', 'Practical Examples'];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish, themes, isGenerating }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<Omit<OnboardingData, 'themeId'>>({
        learningGoals: [],
        elearningExperience: null,
        learningMethods: [],
        aiUsage: null,
        aiUnderstanding: '',
    });
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

    const handleGoalToggle = (goal: string) => {
        setData(prev => ({
            ...prev,
            learningGoals: prev.learningGoals.includes(goal)
                ? prev.learningGoals.filter(g => g !== goal)
                : [...prev.learningGoals, goal]
        }));
    };

    const handleMethodToggle = (method: string) => {
        setData(prev => ({
            ...prev,
            learningMethods: prev.learningMethods.includes(method)
                ? prev.learningMethods.filter(m => m !== method)
                : [...prev.learningMethods, method]
        }));
    };
    
    const isStepValid = () => {
        switch(step) {
            case 1: return data.learningGoals.length > 0;
            case 2: return data.elearningExperience !== null && data.aiUsage !== null && data.aiUnderstanding.trim() !== '';
            case 3: return data.learningMethods.length > 0;
            case 4: return selectedThemeId !== null;
            default: return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStepValid() && selectedThemeId) {
            onFinish({ ...data, themeId: selectedThemeId });
        }
    };
    
    const getProgressWidthClass = () => {
        const percentage = (step / 4) * 100;
        if (percentage <= 25) return 'w-1/4';
        if (percentage <= 50) return 'w-2/4';
        if (percentage <= 75) return 'w-3/4';
        return 'w-full';
    };

    const ProgressBar = () => (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
            <div className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out ${getProgressWidthClass()}`}></div>
        </div>
    );

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-2">What are your main goals for learning AI?</h2>
                        <p className="text-gray-400 mb-6">Select all that apply. This helps us tailor the content depth.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {GOALS.map(goal => (
                                <button key={goal} onClick={() => handleGoalToggle(goal)} className={`p-4 rounded-lg text-left border-2 transition-colors ${data.learningGoals.includes(goal) ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'}`}>
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6">Tell us about your experience.</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 mb-2">How experienced are you with e-learning platforms?</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                                        <button key={level} onClick={() => setData(d => ({ ...d, elearningExperience: level }))} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${data.elearningExperience === level ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'}`}>
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">How often do you use AI tools (like ChatGPT, Midjourney, etc.)?</label>
                                 <div className="flex flex-col sm:flex-row gap-3">
                                     {(['Never', 'Occasionally', 'Frequently'] as const).map(usage => (
                                        <button key={usage} onClick={() => setData(d => ({ ...d, aiUsage: usage }))} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${data.aiUsage === usage ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'}`}>
                                            {usage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label htmlFor="ai-understanding" className="block text-gray-300 mb-2">Briefly, what's your current understanding of AI?</label>
                                <textarea id="ai-understanding" value={data.aiUnderstanding} onChange={e => setData(d => ({ ...d, aiUnderstanding: e.target.value }))} className="w-full p-3 bg-gray-700 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0" rows={3} placeholder="e.g., 'I know it's about making computers smart, but not much else.'"></textarea>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-2">How do you prefer to learn?</h2>
                        <p className="text-gray-400 mb-6">Choose your favorite ways to absorb information.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {METHODS.map(method => (
                                <button key={method} onClick={() => handleMethodToggle(method)} className={`p-4 rounded-lg text-left border-2 transition-colors ${data.learningMethods.includes(method) ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'}`}>
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-2">Finally, choose your starting topic.</h2>
                        <p className="text-gray-400 mb-6">We'll build your first roadmap around this theme.</p>
                        <div className="space-y-3">
                            {themes.map(theme => (
                                <button key={theme.id} onClick={() => setSelectedThemeId(theme.id)} className={`w-full p-4 rounded-lg text-left border-2 transition-colors ${selectedThemeId === theme.id ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'}`}>
                                    <h3 className="font-semibold text-lg">{theme.name}</h3>
                                    <p className="text-sm text-gray-400">{theme.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4 font-sans animate-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Welcome to ProfAI
                    </h1>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-lg border border-gray-700/50">
                    <ProgressBar />
                    <form onSubmit={handleSubmit}>
                       {renderStep()}
                        <div className="flex justify-between items-center mt-8">
                             <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1 || isGenerating} className="px-6 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50">
                                Back
                            </button>
                            {step < 4 ? (
                                <button type="button" onClick={() => setStep(s => s + 1)} disabled={!isStepValid() || isGenerating} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                    Next
                                </button>
                            ) : (
                                <button type="submit" disabled={!isStepValid() || isGenerating} className="px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-wait flex items-center gap-2">
                                     {isGenerating && (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isGenerating ? 'Generating Your Plan...' : 'Build My Roadmap'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
