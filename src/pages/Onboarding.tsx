import React from 'react';
import { Briefcase, Heart, Building2, Sparkles, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface OnboardingStepData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: OnboardingStepData[] = [
  {
    icon: <Gamepad2 className="w-12 h-12" />,
    title: 'Welcome!',
    description:
      'Welcome to Life Simulator! Start from nothing and build your way to the top. Get a job, buy properties, start businesses, and make smart decisions to grow your empire.',
  },
  {
    icon: <Briefcase className="w-12 h-12" />,
    title: 'Earn Money',
    description:
      'Find a job to start earning money. As you gain skills and level up, better jobs with higher pay will unlock. Work hard, get promoted, and watch your bank account grow.',
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: 'Manage Your Life',
    description:
      'Keep an eye on your energy, mood, hunger, and health. Rest when tired, eat when hungry, and stay active to keep healthy. Neglect these and your game could end!',
  },
  {
    icon: <Building2 className="w-12 h-12" />,
    title: 'Grow Your Empire',
    description:
      'Invest in real estate, buy cars for prestige, and start businesses for passive income. Upgrade your assets and watch your net worth soar.',
  },
  {
    icon: <Sparkles className="w-12 h-12" />,
    title: 'Make Decisions',
    description:
      'Random events will test your judgment. Choose wisely! Unlock achievements as you hit milestones. Every decision shapes your path to success.',
  },
];

export const Onboarding: React.FC = () => {
  const { onboardingStep, nextOnboardingStep, skipOnboarding } = useGameStore();

  const currentStep = steps[onboardingStep] || steps[0];
  const isLast = onboardingStep >= steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      skipOnboarding();
    } else {
      nextOnboardingStep();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 text-white"
          style={{
            background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, var(--success)))',
            boxShadow: '0 8px 32px color-mix(in srgb, var(--accent) 25%, transparent)',
          }}
        >
          {currentStep.icon}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          {currentStep.title}
        </h2>

        {/* Description */}
        <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-10 px-4">
          {currentStep.description}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === onboardingStep ? '24px' : '8px',
                backgroundColor:
                  i === onboardingStep
                    ? 'var(--accent)'
                    : i < onboardingStep
                    ? 'var(--accent)'
                    : 'var(--border)',
                opacity: i <= onboardingStep ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={skipOnboarding}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-[var(--text-tertiary)] bg-[var(--bg-card)] border border-[var(--border)] transition-all hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-[2] py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 80%, var(--success)))',
            }}
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
