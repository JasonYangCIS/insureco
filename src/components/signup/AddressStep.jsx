import React from 'react';
import { TextInput, Select, SelectItem } from '@carbon/react';
import { US_STATES } from './signup.constants';

export default function AddressStep({ formData, updateField, errors }) {
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
        labelText="ZIP Code"
        placeholder="e.g. 12345"
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
