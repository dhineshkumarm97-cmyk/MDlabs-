import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  User, 
  ChevronRight, 
  Flame, 
  Instagram, 
  Youtube, 
  Search, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserAnswers, SurveyStep } from '../types';
import AdSpace from './AdSpace';

interface OnboardingStepsProps {
  currentStep: SurveyStep;
  answers: UserAnswers;
  onChangeAnswer: (key: keyof UserAnswers, value: string) => void;
  onNextStep: () => void;
  onSetStep: (step: SurveyStep) => void;
}

export default function OnboardingSteps({
  currentStep,
  answers,
  onChangeAnswer,
  onNextStep,
  onSetStep,
}: OnboardingStepsProps) {


  // Questions and options setup
  const sourceOptions = [
    { label: 'Instagram', icon: Instagram, color: 'text-pink-500 bg-pink-50 border-pink-100 hover:bg-pink-100/50' },
    { label: 'YouTube', icon: Youtube, color: 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100/50' },
    { label: 'TikTok / Shorts', icon: Flame, color: 'text-slate-800 bg-slate-50 border-slate-200 hover:bg-slate-100' },
    { label: 'Google Search', icon: Search, color: 'text-blue-500 bg-blue-50 border-blue-100 hover:bg-blue-100/50' },
    { label: 'From a Friend', icon: Users, color: 'text-green-500 bg-green-50 border-green-100 hover:bg-green-100/50' },
    { label: 'Other Creator', icon: Sparkles, color: 'text-violet-500 bg-violet-50 border-violet-100 hover:bg-violet-100/50' },
  ];

  const ageOptions = [
    { label: 'Under 18', desc: 'Curious explorer' },
    { label: '18 - 24', desc: 'Aesthetic creator' },
    { label: '25 - 34', desc: 'Professional designer' },
    { label: '35 - 44', desc: 'Creative engineer' },
    { label: '45+', desc: 'Visionary mind' },
  ];

  const suggestionVillages = [
    'Oak Creek', 'Siddhpur', 'Rampur', 'Marathahalli', 'Whitefield', 'Amritsar', 'Dharamsala', 'Gokarna'
  ];

  const getStepProgressWidth = () => {
    switch (currentStep) {
      case 'SOURCE_QUESTION': return '25%';
      case 'AGE_QUESTION': return '50%';
      case 'NAME_QUESTION': return '75%';
      case 'VILLAGE_QUESTION': return '100%';
      default: return '0%';
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'SOURCE_QUESTION': return 1;
      case 'AGE_QUESTION': return 2;
      case 'NAME_QUESTION': return 3;
      case 'VILLAGE_QUESTION': return 4;
      default: return 1;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col justify-center items-center py-6 px-4">
      <AnimatePresence mode="wait">
        {/* ==================== SURVEY STEPS ==================== */}
        {currentStep !== 'PROMPT_GALLERY' && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col justify-start min-h-[440px] md:min-h-[480px] overflow-hidden"
          >
            {/* Step Onboarding Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full">
                  Step {getStepNumber()} of 4
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">
                  FUNNEL
                </span>
              </div>
              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-violet-600 h-full transition-all duration-300"
                  style={{ width: getStepProgressWidth() }}
                ></div>
              </div>
            </div>

            {/* Step Question Headers */}
            <div className="mb-6">
              {currentStep === 'SOURCE_QUESTION' && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Compass className="w-6 h-6 text-violet-500" />
                    Where did you hear about this website?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your reference channel to help us prioritize trending platforms.
                  </p>
                </>
              )}

              {currentStep === 'AGE_QUESTION' && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                    What is your age range?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    We curate style recommendations customized around your creative background.
                  </p>
                </>
              )}

              {currentStep === 'NAME_QUESTION' && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-500" />
                    What is your name?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide your name or builder alias to customize prompt cards.
                  </p>
                </>
              )}

              {currentStep === 'VILLAGE_QUESTION' && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                    What is your village or town?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Let us find trending prompt creators in your geographic region.
                  </p>
                </>
              )}
            </div>

            {/* Step Functional Content Area */}
            <div className="flex-1 flex flex-col justify-center">
              {/* --- SOURCE_QUESTION CONTENT --- */}
              {currentStep === 'SOURCE_QUESTION' && (
                <div className="grid grid-cols-2 gap-3">
                  {sourceOptions.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = answers.source === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          onChangeAnswer('source', opt.label);
                          // Auto forward for ultimate smooth user experience
                          setTimeout(() => onNextStep(), 200);
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all text-left group cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100'
                            : `border-slate-100 text-slate-700 ${opt.color}`
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'text-slate-600 group-hover:scale-110 transition-transform'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* --- AGE_QUESTION CONTENT --- */}
              {currentStep === 'AGE_QUESTION' && (
                <div className="space-y-2.5">
                  {ageOptions.map((opt) => {
                    const isSelected = answers.age === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          onChangeAnswer('age', opt.label);
                          setTimeout(() => onNextStep(), 200);
                        }}
                        className={`w-full flex items-center justify-between p-3 px-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100'
                            : 'border-slate-100 hover:border-violet-100 hover:bg-slate-50/50 text-slate-700 bg-white'
                        }`}
                      >
                        <div>
                          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-xs ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent border border-slate-300'}`}></div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* --- NAME_QUESTION CONTENT --- */}
              {currentStep === 'NAME_QUESTION' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full text-base px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-500 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                      placeholder="e.g. Liam, Priya, John"
                      value={answers.name}
                      onChange={(e) => onChangeAnswer('name', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && answers.name.trim().length >= 2) {
                          onNextStep();
                        }
                      }}
                      autoFocus
                    />
                    {answers.name.trim().length > 0 && answers.name.trim().length < 2 && (
                      <p className="text-[11px] text-amber-500 mt-1.5 ml-1 font-medium bg-amber-50/50 border border-amber-100 rounded-lg py-1 px-2.5 w-fit">
                        Please enter at least 2 characters.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      disabled={answers.name.trim().length < 2}
                      onClick={onNextStep}
                      className="flex items-center gap-2 bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md hover:bg-violet-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* --- VILLAGE_QUESTION CONTENT --- */}
              {currentStep === 'VILLAGE_QUESTION' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full text-base px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-500 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                      placeholder="Enter village e.g. Whitefield"
                      value={answers.village}
                      onChange={(e) => onChangeAnswer('village', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && answers.village.trim().length >= 2) {
                          onNextStep();
                        }
                      }}
                      autoFocus
                    />
                    {answers.village.trim().length > 0 && answers.village.trim().length < 2 && (
                      <p className="text-[11px] text-amber-500 mt-1.5 ml-1 font-medium bg-amber-50/50 border border-amber-100 rounded-lg py-1 px-2.5 w-fit">
                        Please specify a valid town or village name.
                      </p>
                    )}
                  </div>

                  {/* Suggestion capsules */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Suggestions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {suggestionVillages.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            onChangeAnswer('village', v);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            answers.village === v
                              ? 'bg-violet-50 text-violet-700 border-violet-200'
                              : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <button
                      type="button"
                      disabled={answers.village.trim().length < 2}
                      onClick={onNextStep}
                      className="flex items-center gap-2 bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md hover:bg-violet-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all cursor-pointer"
                    >
                      <span>Show Trending Prompts</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Space for advertisement at the bottom of standard screens */}
            <AdSpace idSuffix={currentStep} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
