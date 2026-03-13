import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  DatePicker,
  DatePickerInput,
  Button,
  Form,
} from '@carbon/react';
import { ArrowRight, ArrowLeft } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import './SignUpPage.scss';

// ─── Constants ───────────────────────────────────────────────────────────────
const US_STATES = [
  { value: '', label: '' },
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

const CAR_YEARS = [
  { value: '', label: '' },
  ...Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
    const year = String(2025 - i);
    return { value: year, label: year };
  }),
];

const HOME_YEARS = [
  { value: '', label: '' },
  ...Array.from({ length: 2025 - 1800 + 1 }, (_, i) => {
    const year = String(2025 - i);
    return { value: year, label: year };
  }),
];

const HOME_TYPES = [
  { value: '', label: '' },
  { value: 'single_family', label: 'Single Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'mobile_home', label: 'Mobile Home' },
  { value: 'other', label: 'Other' },
];

const PROGRESS_STEPS = [
  { key: 'info', label: 'Personal Info', description: 'Basic details' },
  { key: 'address', label: 'Address', description: 'Where you live' },
  { key: 'coverage', label: 'Coverage', description: 'Insurance type' },
  { key: 'details', label: 'Details', description: 'Policy specifics' },
];

// ─── SVG Icons (from Figma) ───────────────────────────────────────────────────
const CarIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M27.5063 14.9437L20.2594 12.3375L17.2219 8.53125C16.9582 8.20912 16.6264 7.94952 16.2503 7.77118C15.8742 7.59285 15.4631 7.50023 15.0469 7.5H7.54688C7.08935 7.50236 6.63932 7.61631 6.2358 7.83196C5.83228 8.0476 5.48746 8.35844 5.23125 8.7375L2.69062 12.4875C2.16433 13.2587 1.88032 14.1695 1.875 15.1031V22.5C1.875 22.7486 1.97377 22.9871 2.14959 23.1629C2.3254 23.3387 2.56386 23.4375 2.8125 23.4375H4.81875C5.03464 24.2319 5.50594 24.9332 6.15993 25.4332C6.81393 25.9332 7.61428 26.2041 8.4375 26.2041C9.26072 26.2041 10.0611 25.9332 10.7151 25.4332C11.3691 24.9332 11.8404 24.2319 12.0562 23.4375H17.9437C18.1596 24.2319 18.6309 24.9332 19.2849 25.4332C19.9389 25.9332 20.7393 26.2041 21.5625 26.2041C22.3857 26.2041 23.1861 25.9332 23.8401 25.4332C24.4941 24.9332 24.9654 24.2319 25.1813 23.4375H27.1875C27.4361 23.4375 27.6746 23.3387 27.8504 23.1629C28.0262 22.9871 28.125 22.7486 28.125 22.5V15.825C28.1249 15.6323 28.0655 15.4444 27.9548 15.2867C27.844 15.129 27.6874 15.0093 27.5063 14.9437ZM8.4375 24.375C8.06666 24.375 7.70415 24.265 7.39581 24.059C7.08746 23.853 6.84714 23.5601 6.70523 23.2175C6.56331 22.8749 6.52618 22.4979 6.59853 22.1342C6.67087 21.7705 6.84945 21.4364 7.11167 21.1742C7.3739 20.912 7.70799 20.7334 8.07171 20.661C8.43542 20.5887 8.81242 20.6258 9.15503 20.7677C9.49764 20.9096 9.79048 21.15 9.99651 21.4583C10.2025 21.7666 10.3125 22.1292 10.3125 22.5C10.3125 22.9973 10.115 23.4742 9.76332 23.8258C9.41169 24.1775 8.93478 24.375 8.4375 24.375ZM21.5625 24.375C21.1917 24.375 20.8291 24.265 20.5208 24.059C20.2125 23.853 19.9721 23.5601 19.8302 23.2175C19.6883 22.8749 19.6512 22.4979 19.7235 22.1342C19.7959 21.7705 19.9745 21.4364 20.2367 21.1742C20.4989 20.912 20.833 20.7334 21.1967 20.661C21.5604 20.5887 21.9374 20.6258 22.28 20.7677C22.6226 20.9096 22.9155 21.15 23.1215 21.4583C23.3275 21.7666 23.4375 22.1292 23.4375 22.5C23.4375 22.9973 23.24 23.4742 22.8883 23.8258C22.5367 24.1775 22.0598 24.375 21.5625 24.375ZM26.25 21.5625H25.1813C24.9654 20.7681 24.4941 20.0668 23.8401 19.5668C23.1861 19.0668 22.3857 18.7959 21.5625 18.7959C20.7393 18.7959 19.9389 19.0668 19.2849 19.5668C18.6309 20.0668 18.1596 20.7681 17.9437 21.5625H12.0562C11.8404 20.7681 11.3691 20.0668 10.7151 19.5668C10.0611 19.0668 9.26072 18.7959 8.4375 18.7959C7.61428 18.7959 6.81393 19.0668 6.15993 19.5668C5.50594 20.0668 5.03464 20.7681 4.81875 21.5625H3.75V15.1031C3.74964 14.538 3.91952 13.9859 4.2375 13.5188L6.77812 9.76875C6.86622 9.64498 6.98307 9.54448 7.11862 9.47589C7.25417 9.4073 7.40435 9.37268 7.55625 9.375H15.0562C15.194 9.37478 15.3301 9.4049 15.4548 9.46323C15.5796 9.52157 15.69 9.60667 15.7781 9.7125L18.9656 13.7156C19.0756 13.8489 19.2175 13.9521 19.3781 14.0156L26.25 16.4813V21.5625Z" fill="currentColor"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M15.574 2.07551C15.4076 1.94565 15.2026 1.87512 14.9915 1.87512C14.7804 1.87512 14.5754 1.94565 14.409 2.07551L0.9375 12.5808L2.10253 14.0542L3.75 12.7697V24.3751C3.75102 24.872 3.94889 25.3484 4.3003 25.6998C4.65171 26.0512 5.12803 26.249 5.625 26.2501H24.375C24.872 26.2491 25.3484 26.0513 25.6998 25.6999C26.0512 25.3484 26.2491 24.8721 26.25 24.3751V12.7782L27.8975 14.0626L29.0625 12.589L15.574 2.07551ZM16.875 24.3751H13.125V16.8751H16.875V24.3751ZM18.75 24.3751V16.8751C18.7494 16.378 18.5517 15.9014 18.2002 15.5499C17.8487 15.1984 17.3721 15.0006 16.875 15.0001H13.125C12.6279 15.0006 12.1512 15.1983 11.7997 15.5498C11.4482 15.9013 11.2505 16.3779 11.25 16.8751V24.3751H5.625V11.3077L15 4.0046L24.375 11.3176V24.3751H18.75Z" fill="currentColor"/>
  </svg>
);

// ─── Step Sub-Components ──────────────────────────────────────────────────────

function PersonalInfoStep({ formData, updateField, errors }) {
  return (
    <div className="signup-step">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">Personal Information</h2>
      </div>
      <p className="signup-step-description">Let's start with some basic information about you.</p>

      <TextInput
        id="firstName"
        labelText="First Name"
        placeholder="Enter your first name"
        value={formData.firstName}
        onChange={e => updateField('firstName', e.target.value)}
        invalid={!!errors.firstName}
        invalidText={errors.firstName}
        required
        aria-required="true"
      />
      <TextInput
        id="lastName"
        labelText="Last Name"
        placeholder="Enter your last name"
        value={formData.lastName}
        onChange={e => updateField('lastName', e.target.value)}
        invalid={!!errors.lastName}
        invalidText={errors.lastName}
        required
        aria-required="true"
      />
      <TextInput
        id="email"
        labelText="Email Address"
        placeholder="your.email@example.com"
        type="email"
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
        invalid={!!errors.email}
        invalidText={errors.email}
        required
        aria-required="true"
      />
      <TextInput
        id="phone"
        labelText="Phone Number"
        placeholder="(555) 123-4567"
        type="tel"
        value={formData.phone}
        onChange={e => updateField('phone', e.target.value)}
        invalid={!!errors.phone}
        invalidText={errors.phone}
        required
        aria-required="true"
      />
      <TextInput
        id="mobilePhone"
        labelText="Mobile Number"
        placeholder="(555) 123-4567"
        type="tel"
        value={formData.mobilePhone}
        onChange={e => updateField('mobilePhone', e.target.value)}
      />
      <DatePicker
        datePickerType="single"
        onChange={(dates = []) => updateField('dateOfBirth', dates[0] || '')}
      >
        <DatePickerInput
          id="dateOfBirth"
          labelText="Date of Birth"
          placeholder="mm/dd/yyyy"
          invalid={!!errors.dateOfBirth}
          invalidText={errors.dateOfBirth}
          required
          aria-required="true"
        />
      </DatePicker>
    </div>
  );
}

function AddressStep({ formData, updateField, errors }) {
  return (
    <div className="signup-step">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">Your Address</h2>
      </div>
      <p className="signup-step-description">Let us know where you live</p>

      <TextInput
        id="streetAddress"
        labelText="Street Address"
        placeholder="123 Main Street"
        value={formData.streetAddress}
        onChange={e => updateField('streetAddress', e.target.value)}
        invalid={!!errors.streetAddress}
        invalidText={errors.streetAddress}
        required
        aria-required="true"
      />
      <TextInput
        id="city"
        labelText="City"
        placeholder="Your city"
        value={formData.city}
        onChange={e => updateField('city', e.target.value)}
        invalid={!!errors.city}
        invalidText={errors.city}
        required
        aria-required="true"
      />
      <Select
        id="state"
        labelText="State"
        value={formData.state}
        onChange={e => updateField('state', e.target.value)}
        invalid={!!errors.state}
        invalidText={errors.state}
        required
        aria-required="true"
      >
        {US_STATES.map(s => (
          <SelectItem key={s.value} value={s.value} text={s.label} />
        ))}
      </Select>
      <TextInput
        id="zipCode"
        labelText="Zip"
        placeholder="(555) 123-4567"
        value={formData.zipCode}
        onChange={e => updateField('zipCode', e.target.value)}
        invalid={!!errors.zipCode}
        invalidText={errors.zipCode}
        required
        aria-required="true"
      />
    </div>
  );
}

function InsuranceTypeStep({ formData, updateField, errors }) {
  const options = [
    {
      value: 'car',
      title: 'Car Insurance',
      description: 'Get comprehensive coverage for your vehicle',
      icons: <CarIcon />,
    },
    {
      value: 'home',
      title: 'Home Insurance',
      description: 'Protect your most important asset for your family',
      icons: <HomeIcon />,
    },
    {
      value: 'both',
      title: 'Both Home and Car',
      description: 'Insure both and get bundle savings',
      icons: (
        <span className="insurance-option__dual-icons">
          <CarIcon />
          <HomeIcon />
        </span>
      ),
    },
  ];

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
        {options.map(opt => (
          <div
            key={opt.value}
            className={`insurance-option${formData.insuranceType === opt.value ? ' insurance-option--selected' : ''}`}
            role="radio"
            aria-checked={formData.insuranceType === opt.value}
            tabIndex={0}
            onClick={() => updateField('insuranceType', opt.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateField('insuranceType', opt.value);
              }
            }}
          >
            <div className="insurance-option__icons">{opt.icons}</div>
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

function CarDetailsStep({ formData, updateField, errors }) {
  return (
    <div className="signup-step">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">Car Details</h2>
      </div>
      <p className="signup-step-description">Tell us about your car</p>

      <TextInput
        id="carMake"
        labelText="Make"
        placeholder="e.g. Toyota, Ford"
        value={formData.carMake}
        onChange={e => updateField('carMake', e.target.value)}
        invalid={!!errors.carMake}
        invalidText={errors.carMake}
        required
        aria-required="true"
      />
      <TextInput
        id="carModel"
        labelText="Model"
        placeholder="e.g. Corolla, Bronco"
        value={formData.carModel}
        onChange={e => updateField('carModel', e.target.value)}
        invalid={!!errors.carModel}
        invalidText={errors.carModel}
        required
        aria-required="true"
      />
      <Select
        id="carYear"
        labelText="Year"
        value={formData.carYear}
        onChange={e => updateField('carYear', e.target.value)}
        invalid={!!errors.carYear}
        invalidText={errors.carYear}
        required
        aria-required="true"
      >
        {CAR_YEARS.map(y => (
          <SelectItem key={y.value} value={y.value} text={y.label} />
        ))}
      </Select>
      <NumberInput
        id="carMileage"
        label="Mileage"
        value={formData.carMileage}
        min={0}
        step={500}
        onChange={(e, { value } = {}) => updateField('carMileage', value ?? formData.carMileage)}
      />
      <NumberInput
        id="carMilesPerYear"
        label="Miles driven per year"
        value={formData.carMilesPerYear}
        min={0}
        step={500}
        onChange={(e, { value } = {}) => updateField('carMilesPerYear', value ?? formData.carMilesPerYear)}
      />
      <TextInput
        id="carVin"
        labelText="VIN (optional)"
        placeholder=""
        helperText="17 digits"
        value={formData.carVin}
        onChange={e => updateField('carVin', e.target.value)}
        maxLength={17}
      />
    </div>
  );
}

function HomeDetailsStep({ formData, updateField, errors }) {
  return (
    <div className="signup-step">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">Property Details</h2>
      </div>
      <p className="signup-step-description">Tell us about your home</p>

      <Select
        id="homeType"
        labelText="Home Type"
        value={formData.homeType}
        onChange={e => updateField('homeType', e.target.value)}
        invalid={!!errors.homeType}
        invalidText={errors.homeType}
        required
        aria-required="true"
      >
        {HOME_TYPES.map(t => (
          <SelectItem key={t.value} value={t.value} text={t.label} />
        ))}
      </Select>
      <Select
        id="homeYearBuilt"
        labelText="Year Built"
        value={formData.homeYearBuilt}
        onChange={e => updateField('homeYearBuilt', e.target.value)}
        invalid={!!errors.homeYearBuilt}
        invalidText={errors.homeYearBuilt}
        required
        aria-required="true"
      >
        {HOME_YEARS.map(y => (
          <SelectItem key={y.value} value={y.value} text={y.label} />
        ))}
      </Select>
      <NumberInput
        id="homeSquareFeet"
        label="Square Feet"
        helperText="We'll confirm this more accurately later"
        value={formData.homeSquareFeet}
        min={0}
        step={100}
        onChange={(e, { value } = {}) => updateField('homeSquareFeet', value ?? formData.homeSquareFeet)}
      />
      <NumberInput
        id="homeEstimatedValue"
        label="Estimated Home Value"
        helperText="We'll confirm this more accurately later"
        value={formData.homeEstimatedValue}
        min={0}
        step={1000}
        onChange={(e, { value } = {}) => updateField('homeEstimatedValue', value ?? formData.homeEstimatedValue)}
      />
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('personal');
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', mobilePhone: '', dateOfBirth: '',
    streetAddress: '', city: '', state: '', zipCode: '',
    insuranceType: '',
    carMake: '', carModel: '', carYear: '',
    carMileage: 1000, carMilesPerYear: 1000, carVin: '',
    homeType: '', homeYearBuilt: '',
    homeSquareFeet: 1000, homeEstimatedValue: 1000,
  });

  // Compute dynamic step order based on insurance type
  const getStepOrder = () => {
    const base = ['personal', 'address', 'insuranceType'];
    if (formData.insuranceType === 'car') return [...base, 'carDetails'];
    if (formData.insuranceType === 'home') return [...base, 'homeDetails'];
    if (formData.insuranceType === 'both') return [...base, 'carDetails', 'homeDetails'];
    return base;
  };

  // Map each internal step to a visual slot (0-3) in the 4-item progress bar
  const STEP_TO_VISUAL = {
    personal: 0,
    address: 1,
    insuranceType: 2,
    carDetails: 3,
    homeDetails: 3,
  };

  const stepOrder = getStepOrder();
  const currentStepIdx = stepOrder.indexOf(currentStep);
  const isFirstStep = currentStepIdx === 0;
  // Insurance type step is never the "last" step — details always follow
  const isLastStep = currentStepIdx === stepOrder.length - 1 && currentStep !== 'insuranceType';
  const visualStepIndex = STEP_TO_VISUAL[currentStep] ?? 0;
  const showWarning = currentStep === 'carDetails' && !warningDismissed;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const e = {};
    if (currentStep === 'personal') {
      if (!formData.firstName.trim()) e.firstName = 'First name is required';
      if (!formData.lastName.trim()) e.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        e.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        e.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) e.phone = 'Phone number is required';
      if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    }
    if (currentStep === 'address') {
      if (!formData.streetAddress.trim()) e.streetAddress = 'Street address is required';
      if (!formData.city.trim()) e.city = 'City is required';
      if (!formData.state) e.state = 'Please select a state';
      if (!formData.zipCode.trim()) {
        e.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        e.zipCode = 'Please enter a valid ZIP code (e.g. 12345)';
      }
    }
    if (currentStep === 'insuranceType') {
      if (!formData.insuranceType) e.insuranceType = 'Please select an insurance type to continue';
    }
    if (currentStep === 'carDetails') {
      if (!formData.carMake.trim()) e.carMake = 'Make is required';
      if (!formData.carModel.trim()) e.carModel = 'Model is required';
      if (!formData.carYear) e.carYear = 'Please select a year';
    }
    if (currentStep === 'homeDetails') {
      if (!formData.homeType) e.homeType = 'Please select a home type';
      if (!formData.homeYearBuilt) e.homeYearBuilt = 'Please select a year built';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (isLastStep) {
      console.log('Sign up complete:', formData);
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

  const handleCancel = () => navigate('/');

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
          <StepBreadcrumb steps={PROGRESS_STEPS} currentIndex={visualStepIndex} />
        </div>
      </div>

      {/* ── Warning Banner (Car Details only) ── */}
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

      {/* ── Form Card ── */}
      <main className="signup-form-card" aria-labelledby="step-heading">
        <Form noValidate aria-label={`Step ${visualStepIndex + 1} of 4`}>
          {currentStep === 'personal' && (
            <PersonalInfoStep formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 'address' && (
            <AddressStep formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 'insuranceType' && (
            <InsuranceTypeStep formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 'carDetails' && (
            <CarDetailsStep formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 'homeDetails' && (
            <HomeDetailsStep formData={formData} updateField={updateField} errors={errors} />
          )}

          {/* ── Footer Navigation ── */}
          <div className="signup-form-footer">
            {currentStep === 'carDetails' && (
              <Button
                kind="tertiary"
                renderIcon={ArrowLeft}
                onClick={handleCancel}
                className="signup-btn-cancel"
              >
                Cancel
              </Button>
            )}
            {!isFirstStep && (
              <Button
                kind="secondary"
                renderIcon={ArrowLeft}
                onClick={handleBack}
                className="signup-btn-back"
              >
                Back
              </Button>
            )}
            <Button
              kind="primary"
              renderIcon={ArrowRight}
              onClick={handleNext}
              className="signup-btn-next"
            >
              {isLastStep ? 'Complete Sign Up' : 'Next'}
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
}
