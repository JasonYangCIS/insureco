import React from 'react';
import { TextInput, Select, SelectItem, NumberInput } from '@carbon/react';
import { CAR_YEARS } from './signup.constants';

export default function CarDetailsStep({ formData, updateField, errors }) {
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
