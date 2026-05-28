import { useState, useEffect } from 'react';
import { UserAnswers, SurveyStep } from './types';
import OnboardingSteps from './components/OnboardingSteps';
import PromptGallery from './components/PromptGallery';

export default function App() {
  const [step, setStep] = useState<SurveyStep>('BOOT');
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<UserAnswers>({
    source: '',
    age: '',
    name: '',
    village: '',
  });

  // Check if onboarding completed previously
  useEffect(() => {
    const savedAnswers = localStorage.getItem('mdlabs_user_answers');
    const isCompleted = localStorage.getItem('mdlabs_onboarding_completed') === 'true';

    if (isCompleted && savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
        setStep('PROMPT_GALLERY');
      } catch (e) {
        console.error('Error reloading saved answers', e);
      }
    }
    setLoading(false);
  }, []);

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
    setStep('BOOT');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">
        Syncing session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 transition-colors">
      {step === 'PROMPT_GALLERY' ? (
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
  );
}
