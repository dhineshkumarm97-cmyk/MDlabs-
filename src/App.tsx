import { useState, useEffect } from 'react';
import { UserAnswers, SurveyStep } from './types';
import OnboardingSteps from './components/OnboardingSteps';
import PromptGallery from './components/PromptGallery';
import BootScreen from './components/BootScreen';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Scale, ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<SurveyStep>(() => {
    const isCompleted = localStorage.getItem('mdlabs_onboarding_completed') === 'true';
    const savedAnswers = localStorage.getItem('mdlabs_user_answers');
    if (isCompleted && savedAnswers) {
      return 'BOOT';
    }
    return 'SOURCE_QUESTION';
  });

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const [answers, setAnswers] = useState<UserAnswers>(() => {
    const savedAnswers = localStorage.getItem('mdlabs_user_answers');
    if (savedAnswers) {
      try {
        return JSON.parse(savedAnswers);
      } catch (e) {
        console.error('Error reloading saved answers', e);
      }
    }
    return {
      source: '',
      age: '',
      name: '',
      village: '',
    };
  });

  // Show the warning notice modal whenever the user transitions to the prompt gallery
  useEffect(() => {
    if (step === 'PROMPT_GALLERY') {
      setShowWarningModal(true);
    }
  }, [step]);

  const handleUpdateAnswer = (key: keyof UserAnswers, value: string) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };
      localStorage.setItem('mdlabs_user_answers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNextStep = () => {
    switch (step) {
      case 'SOURCE_QUESTION':
        setStep('AGE_QUESTION');
        break;
      case 'AGE_QUESTION':
        setStep('NAME_QUESTION');
        break;
      case 'NAME_QUESTION':
        setStep('VILLAGE_QUESTION');
        break;
      case 'VILLAGE_QUESTION':
        localStorage.setItem('mdlabs_onboarding_completed', 'true');
        setStep('PROMPT_GALLERY');
        break;
      default:
        break;
    }
  };

  const handleResetSurvey = () => {
    localStorage.removeItem('mdlabs_onboarding_completed');
    localStorage.removeItem('mdlabs_user_answers');
    setAnswers({
      source: '',
      age: '',
      name: '',
      village: '',
    });
    setStep('SOURCE_QUESTION');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 transition-colors flex flex-col justify-between">
      <div className="flex-1 w-full">
        {step === 'BOOT' ? (
          <BootScreen onComplete={() => setStep('PROMPT_GALLERY')} />
        ) : step === 'PROMPT_GALLERY' ? (
          <PromptGallery 
            answers={answers} 
            onReset={handleResetSurvey} 
          />
        ) : (
          <OnboardingSteps
            currentStep={step}
            answers={answers}
            onChangeAnswer={handleUpdateAnswer}
            onNextStep={handleNextStep}
            onSetStep={setStep}
          />
        )}
      </div>

      {/* Global Footer visible all across the pages down */}
      <footer className="w-full bg-white/70 backdrop-blur-md border-t border-slate-100/80 py-5 text-center shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-slate-400 font-medium">
            &copy; 2026 <span className="font-bold text-slate-500">MDlabs</span> &bull; Aesthetic Prompt Engine. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-[12px] font-semibold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer hover:underline underline-offset-4"
            >
              Terms &amp; Conditions
            </button>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-[12px] font-semibold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer hover:underline underline-offset-4"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Warning/Disclaimer Notice Pop-up Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWarningModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-md bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">
                    Important Notice
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">
                    Workspace Feed Alert
                  </p>
                </div>
                <button 
                  onClick={() => setShowWarningModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-amber-50/25 border border-amber-100/50 rounded-xl p-4 my-1">
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                  &ldquo;some times prompt will not suitable for image because of low network connection or any server error so please accept that,our team will working to fix that&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer"
                >
                  Okay, I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Pop-up Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-lg bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      Terms &amp; Conditions
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold font-mono tracking-wider uppercase">
                      Workspace Guidelines
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="max-h-[360px] overflow-y-auto pr-1 space-y-4 text-xs text-slate-600 leading-relaxed font-sans border-y border-slate-100 py-4 my-1">
                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">1. License &amp; Curated Materials Access</h4>
                  <p>
                    MDlabs grants you a limited, non-commercial, revocable license to access, view, and read our catalog of aesthetic midjourney style structures, negative formula tags, and keyword weights. The prompt formulas are provided for research, testing, and creative inspiration.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">2. Image Mismatch &amp; Operational Accuracy</h4>
                  <p className="bg-amber-50/40 border border-amber-100/40 p-2.5 rounded-lg italic">
                    By accessing MDlabs, you explicitly acknowledge that prompt keywords may occasionally appear slightly modified or mismatching relative to their displayed image cards because of occasional remote network latency, CDN failures, or unstable server queries. Our creative team maintains continuous updates to restore and preserve exact matching layouts.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">3. Generative Platforms &amp; Disclaimers</h4>
                  <p>
                    MDlabs is an independent cataloging toolkit and is not affiliated, endorsed, or associated with Midjourney Inc, Stability AI, or Google Cloud. We offer curated text patterns &quot;as-is&quot; without any warranty of output fidelity on third-party design models.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">4. Modifications to Workspace Features</h4>
                  <p>
                    We reserve the exclusive prerogative to add, remove, reorganize, or filter categories, tag criteria, and structural prompt records without warning to safeguard overall look, feel, and performance.
                  </p>
                </section>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer"
                >
                  I Accept Terms
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Pop-up Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-lg bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      Privacy Policy
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold font-mono tracking-wider uppercase">
                      Data Integrity Standard
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="max-h-[360px] overflow-y-auto pr-1 space-y-4 text-xs text-slate-600 leading-relaxed font-sans border-y border-slate-100 py-4 my-1">
                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">1. Localized Data Policy &amp; No Database Logging</h4>
                  <p>
                    At MDlabs, we prioritize your anonymity and privacy. The information requested during the Onboarding phases (such as your chosen reference source, age range, preferred builder display name, and geographic village/town location) is **never** transmitted, stored, or processed on backend physical databases.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">2. Client-Side Persistent Storage</h4>
                  <p>
                    We save customized styling attributes, geographic village references, and filter selections entirely in your web browser&apos;s isolated <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-[10px]">localStorage</code>. This localized data structure guarantees your preferences persist seamlessly between page refreshes without any server analytics cookies.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">3. Data Removal &amp; Survey Reset</h4>
                  <p>
                    You retain total absolute control over your private information. You may immediately and irrevocably wipe all preference parameters, village references, and onboarding progress keys by clicking the <strong className="text-indigo-600">&quot;Reset Onboarding&quot;</strong> button loaded in the main Prompt Feed view.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">4. Secure Client Assets</h4>
                  <p>
                    Images loaded to match prompt keywords are fetched live via secure SSL/TLS channels directly through the Unsplash platform CDN API. We do not place hidden canvas metadata extractors or trackers.
                  </p>
                </section>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer"
                >
                  Close &amp; Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
