import React from 'react';
import { CheckmarkFilled } from '@carbon/icons-react';
import { HOME_TYPE_LABELS, INSURANCE_LABELS } from './signup.constants';
import { formatDate } from './signup.helpers';
import './SummaryStep.scss';

export default function SummaryStep({ formData }) {
  const showCar = formData.insuranceType === 'car' || formData.insuranceType === 'both';
  const showHome = formData.insuranceType === 'home' || formData.insuranceType === 'both';

  return (
    <div className="signup-step signup-summary">
      <div className="signup-step-header">
        <h2 className="signup-step-title" id="step-heading">Review Your Information</h2>
      </div>
      <p className="signup-step-description">
        Please review your details before submitting. Use the Back button to make any changes.
      </p>

      <div className="summary-sections">
        <SummarySection title="Personal Information">
          <SummaryField label="Full Name" value={`${formData.firstName} ${formData.lastName}`} />
          <SummaryField label="Email Address" value={formData.email} />
          <SummaryField label="Phone Number" value={formData.phone} />
          {formData.mobilePhone && (
            <SummaryField label="Mobile Number" value={formData.mobilePhone} />
          )}
          <SummaryField label="Date of Birth" value={formatDate(formData.dateOfBirth)} />
        </SummarySection>

        <SummarySection title="Address">
          <SummaryField label="Street Address" value={formData.streetAddress} />
          <SummaryField label="City" value={formData.city} />
          <SummaryField label="State" value={formData.state} />
          <SummaryField label="ZIP Code" value={formData.zipCode} />
        </SummarySection>

        <SummarySection title="Coverage">
          <SummaryField
            label="Insurance Type"
            value={INSURANCE_LABELS[formData.insuranceType] || formData.insuranceType}
          />
        </SummarySection>

        {showCar && (
          <SummarySection title="Car Details">
            <SummaryField label="Make" value={formData.carMake} />
            <SummaryField label="Model" value={formData.carModel} />
            <SummaryField label="Year" value={formData.carYear} />
            <SummaryField label="Mileage" value={`${Number(formData.carMileage).toLocaleString()} miles`} />
            <SummaryField label="Miles / Year" value={Number(formData.carMilesPerYear).toLocaleString()} />
            {formData.carVin && <SummaryField label="VIN" value={formData.carVin} />}
          </SummarySection>
        )}

        {showHome && (
          <SummarySection title="Home Details">
            <SummaryField label="Home Type" value={HOME_TYPE_LABELS[formData.homeType] || formData.homeType} />
            <SummaryField label="Year Built" value={formData.homeYearBuilt} />
            <SummaryField label="Square Feet" value={`${Number(formData.homeSquareFeet).toLocaleString()} sq ft`} />
            <SummaryField label="Estimated Value" value={`$${Number(formData.homeEstimatedValue).toLocaleString()}`} />
          </SummarySection>
        )}
      </div>

      <div className="summary-confirm-note" role="note">
        <CheckmarkFilled size={16} aria-hidden="true" />
        <span>
          By clicking <strong>Complete Sign Up</strong>, you confirm that all information provided is accurate.
        </span>
      </div>
    </div>
  );
}

// ─── Internal helper components ───────────────────────────────────────────────

function SummarySection({ title, children }) {
  return (
    <section className="summary-section" aria-label={title}>
      <h3 className="summary-section__title">{title}</h3>
      <dl className="summary-fields">{children}</dl>
    </section>
  );
}

function SummaryField({ label, value }) {
  return (
    <div className="summary-field">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}
