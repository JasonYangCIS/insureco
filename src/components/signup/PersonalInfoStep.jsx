import React from 'react';
import { TextInput, DatePicker, DatePickerInput } from '@carbon/react';

export default function PersonalInfoStep({ formData, updateField, errors }) {
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
        helperText="10-digit US phone number"
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
        invalid={!!errors.mobilePhone}
        invalidText={errors.mobilePhone}
        helperText="Optional — 10-digit US phone number"
      />
      <DatePicker
        datePickerType="single"
        maxDate={new Date().toLocaleDateString('en-US')}
        onChange={(dates = []) => updateField('dateOfBirth', dates[0] || '')}
      >
        <DatePickerInput
          id="dateOfBirth"
          labelText="Date of Birth"
          placeholder="mm/dd/yyyy"
          invalid={!!errors.dateOfBirth}
          invalidText={errors.dateOfBirth}
          helperText="You must be at least 18 years old"
          required
          aria-required="true"
        />
      </DatePicker>
    </div>
  );
}
