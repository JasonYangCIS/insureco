import React from 'react';
import { Select, SelectItem, NumberInput } from '@carbon/react';
import { HOME_TYPES, HOME_YEARS } from './signup.constants';

export default function HomeDetailsStep({ formData, updateField, errors }) {
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
