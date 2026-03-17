import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from '@carbon/react';
import { ArrowRight, ArrowLeft } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';

import PersonalInfoStep from '../components/signup/PersonalInfoStep';
import AddressStep from '../components/signup/AddressStep';
import InsuranceTypeStep from '../components/signup/InsuranceTypeStep';
import CarDetailsStep from '../components/signup/CarDetailsStep';
import HomeDetailsStep from '../components/signup/HomeDetailsStep';
import SummaryStep from '../components/signup/SummaryStep';

import { PROGRESS_STEPS, STEP_TO_VISUAL } from '../components/signup/signup.constants';
import { isValidPhone } from '../components/signup/signup.helpers';

import './SignUpPage.scss';

// ─── Initial form state ───────────────────────────────────────────────────────
const INITIAL_FORM = {
  firstName: '', lastName: '', email: '',
  phone: '', mobilePhone: '', dateOfBirth: '',
  streetAddress: '', city: '', state: '', zipCode: '',
  insuranceType: '',
  carMake: '', carModel: '', carYear: '',
  carMileage: 1000, carMilesPerYear: 1000, carVin: '',
  homeType: '', homeYearBuilt: '',
  homeSquareFeet: 1000, homeEstimatedValue: 1000,
};

// ─── Step ordering ────────────────────────────────────────────────────────────
function getStepOrder(insuranceType) {
  const base = ['personal', 'address', 'insuranceType'];
  if (insuranceType === 'car')  return [...base, 'carDetails', 'summary'];
  if (insuranceType === 'home') return [...base, 'homeDetails', 'summary'];
  if (insuranceType === 'both') return [...base, 'carDetails', 'homeDetails', 'summary'];
  return base;
}

// ─── Per-step validation rules ────────────────────────────────────────────────
function validateStep(step, formData) {
  const errors = {};

  if (step === 'personal') {
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim())  errors.lastName  = 'Last name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.mobilePhone.trim() && !isValidPhone(formData.mobilePhone)) {
      errors.mobilePhone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dob > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      } else {
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 18);
        if (dob > minAge) errors.dateOfBirth = 'You must be at least 18 years old to apply';
      }
    }
  }

  if (step === 'address') {
    if (!formData.streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!formData.city.trim())          errors.city          = 'City is required';
    if (!formData.state)                errors.state         = 'Please select a state';
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code (e.g. 12345 or 12345-6789)';
    }
  }

  if (step === 'insuranceType') {
    if (!formData.insuranceType) errors.insuranceType = 'Please select an insurance type to continue';
  }

  if (step === 'carDetails') {
    if (!formData.carMake.trim()) errors.carMake = 'Make is required';
    if (!formData.carModel.trim()) errors.carModel = 'Model is required';
    if (!formData.carYear)        errors.carYear  = 'Please select a year';
  }

  if (step === 'homeDetails') {
    if (!formData.homeType)     errors.homeType     = 'Please select a home type';
    if (!formData.homeYearBuilt) errors.homeYearBuilt = 'Please select a year built';
  }

  return errors;
}

// ─── Page component ───────────────────────────────────────────────────────────
export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep]         = useState('personal');
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [errors, setErrors]                   = useState({});
  const [formData, setFormData]               = useState(INITIAL_FORM);

  const stepOrder      = getStepOrder(formData.insuranceType);
  const currentStepIdx = stepOrder.indexOf(currentStep);
  const isFirstStep    = currentStepIdx === 0;
  const isLastStep     = currentStep === 'summary';
  const visualIndex    = STEP_TO_VISUAL[currentStep] ?? 0;
  const showWarning    = currentStep === 'carDetails' && !warningDismissed;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (isLastStep) {
      navigate('/dashboard');
      return;
    }
    setCurrentStep(stepOrder[currentStepIdx + 1]);
    setWarningDismissed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (isFirstStep) return;
    setCurrentStep(stepOrder[currentStepIdx - 1]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="signup-page">
      {/* ── Hero + Progress ── */}
      <div className="signup-outer">
        <header className="signup-hero">
          <h1 className="signup-hero__title">Sign Up for InsureCo</h1>
          <p className="signup-hero__subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </header>
        <div className="signup-progress" aria-label="Sign-up progress">
          <StepBreadcrumb steps={PROGRESS_STEPS} currentIndex={visualIndex} />
        </div>
      </div>

      {/* ── Vehicle registration warning (Car Details step only) ── */}
      {showWarning && (
        <div className="signup-warning" role="alert" aria-live="assertive">
          <div className="signup-warning__left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M8.125 5.647V8.784M8.125 10.667H8.131M14.4 8a6.275 6.275 0 11-12.55 0 6.275 6.275 0 0112.55 0z" stroke="#946C00" strokeWidth="1.882" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="signup-warning__text">
              Please ensure your vehicle information matches your registration documents.
            </span>
          </div>
          <button
            className="signup-warning__dismiss"
            onClick={() => setWarningDismissed(true)}
            aria-label="Dismiss warning message"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Form card ── */}
      <main className="signup-form-card" aria-labelledby="step-heading">
        <Form noValidate aria-label={`Step ${visualIndex + 1} of ${PROGRESS_STEPS.length}`}>
          {currentStep === 'personal'       && <PersonalInfoStep  formData={formData} updateField={updateField} errors={errors} />}
          {currentStep === 'address'        && <AddressStep       formData={formData} updateField={updateField} errors={errors} />}
          {currentStep === 'insuranceType'  && <InsuranceTypeStep formData={formData} updateField={updateField} errors={errors} />}
          {currentStep === 'carDetails'     && <CarDetailsStep    formData={formData} updateField={updateField} errors={errors} />}
          {currentStep === 'homeDetails'    && <HomeDetailsStep   formData={formData} updateField={updateField} errors={errors} />}
          {currentStep === 'summary'        && <SummaryStep       formData={formData} />}

          {/* ── Navigation footer ── */}
          <div className="signup-form-footer">
            {currentStep === 'carDetails' && (
              <Button kind="tertiary" renderIcon={ArrowLeft} onClick={() => navigate('/')} className="signup-btn-cancel">
                Cancel
              </Button>
            )}
            {!isFirstStep && (
              <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack} className="signup-btn-back">
                Back
              </Button>
            )}
            <Button kind="primary" renderIcon={ArrowRight} onClick={handleNext} className="signup-btn-next">
              {isLastStep ? 'Complete Sign Up' : 'Next'}
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
}
