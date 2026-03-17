import React from 'react';
import { CarIcon, HomeIcon } from './SignupIcons';
import './InsuranceTypeStep.scss';

const INSURANCE_OPTIONS = [
  {
    value: 'car',
    title: 'Car Insurance',
    description: 'Get comprehensive coverage for your vehicle',
    icon: <CarIcon />,
  },
  {
    value: 'home',
    title: 'Home Insurance',
    description: 'Protect your most important asset for your family',
    icon: <HomeIcon />,
  },
  {
    value: 'both',
    title: 'Both Home and Car',
    description: 'Insure both and get bundle savings',
    icon: (
      <span className="insurance-option__dual-icons">
        <CarIcon />
        <HomeIcon />
      </span>
    ),
  },
];

export default function InsuranceTypeStep({ formData, updateField, errors }) {
  const handleSelect = (value) => updateField('insuranceType', value);

  return (
    <div className="signup-step">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">What Will You Insure</h2>
      </div>
      <p className="signup-step-description">Which insurance coverage are you looking for</p>

      {errors.insuranceType && (
        <p className="signup-step-error" role="alert">{errors.insuranceType}</p>
      )}

      <div
        className="insurance-options"
        role="radiogroup"
        aria-labelledby="step-heading"
        aria-required="true"
      >
        {INSURANCE_OPTIONS.map(opt => (
          <div
            key={opt.value}
            className={`insurance-option${formData.insuranceType === opt.value ? ' insurance-option--selected' : ''}`}
            role="radio"
            aria-checked={formData.insuranceType === opt.value}
            tabIndex={0}
            onClick={() => handleSelect(opt.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(opt.value);
              }
            }}
          >
            <div className="insurance-option__icon">{opt.icon}</div>
            <div className="insurance-option__content">
              <h3 className="insurance-option__title">{opt.title}</h3>
              <p className="insurance-option__description">{opt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
