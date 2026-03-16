import React from 'react';
import { Checkmark } from '@carbon/icons-react';
import './DotStepper.scss';

/**
 * DotStepper — compact, mobile-first progress indicator.
 *
 * Props:
 *   steps        — array of { key: string, label: string }
 *   currentIndex — zero-based index of the active step
 *
 * Accessibility:
 *   - role="group" with aria-label announcing current position
 *   - Visual track is aria-hidden (decorative)
 *   - sr-only <ol> provides full step list to screen readers
 */
export default function DotStepper({ steps, currentIndex }) {
  return (
    <div
      className="dot-stepper"
      role="group"
      aria-label={`Sign-up progress: step ${currentIndex + 1} of ${steps.length}, ${steps[currentIndex]?.label}`}
    >
      {/* Visible header — covered by the group aria-label above */}
      <div className="dot-stepper__header" aria-hidden="true">
        <span className="dot-stepper__counter">
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span className="dot-stepper__label">{steps[currentIndex]?.label}</span>
      </div>

      {/* Visual dot track — purely decorative */}
      <div className="dot-stepper__track" aria-hidden="true">
        {steps.map((step, index) => {
          const status =
            index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
          return (
            <React.Fragment key={step.key}>
              <div className={`dot-stepper__dot dot-stepper__dot--${status}`}>
                {status === 'complete' && <Checkmark size={10} />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`dot-stepper__connector${
                    index < currentIndex ? ' dot-stepper__connector--complete' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Screen-reader step list — hidden visually */}
      <ol className="sr-only">
        {steps.map((step, index) => {
          const status =
            index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
          return (
            <li key={step.key}>
              {step.label}: {status}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
