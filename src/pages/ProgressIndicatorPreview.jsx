import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Stack,
  Heading,
  ProgressIndicator,
  ProgressStep,
  ProgressBar,
  Tag,
  StructuredList,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import {
  ArrowLeft,
  ArrowRight,
  Checkmark,
  CheckmarkFilled,
  CircleDash,
  CircleFilled,
} from '@carbon/icons-react';
import './ProgressIndicatorPreview.scss';

// ============================================================
// Option 4: Custom Non-Carbon Dot Stepper
// ============================================================
function DotStepper({ steps, currentIndex }) {
  return (
    <div className="dot-stepper" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      <div className="dot-stepper__header">
        <span className="dot-stepper__counter">Step {currentIndex + 1} of {steps.length}</span>
        <span className="dot-stepper__label">{steps[currentIndex].label}</span>
      </div>
      <div className="dot-stepper__track">
        {steps.map((step, index) => {
          const status =
            index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
          return (
            <React.Fragment key={step.key}>
              <div
                className={`dot-stepper__dot dot-stepper__dot--${status}`}
                aria-label={`${step.label}: ${status}`}
              >
                {status === 'complete' && <Checkmark size={10} />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`dot-stepper__connector${index < currentIndex ? ' dot-stepper__connector--complete' : ''}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="dot-stepper__step-labels">
        {steps.map((step, index) => (
          <span
            key={step.key}
            className={`dot-stepper__step-label${index === currentIndex ? ' dot-stepper__step-label--current' : ''}`}
          >
            {index === currentIndex ? step.label : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Mobile Frame Wrapper
// ============================================================
function MobileFrame({ children, label }) {
  return (
    <div className="mobile-frame-wrapper">
      <div className="mobile-frame-device">
        <div className="mobile-frame-notch" />
        <div className="mobile-frame-screen">
          <div className="mobile-frame-status-bar">
            <span>9:41</span>
            <span>●●●</span>
          </div>
          <div className="mobile-frame-content">{children}</div>
        </div>
      </div>
      <p className="mobile-frame-label">{label}</p>
    </div>
  );
}

// ============================================================
// Main Preview Page
// ============================================================
export default function ProgressIndicatorPreview() {
  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'address', label: 'Address' },
    { key: 'type', label: 'Insurance Type' },
    { key: 'car', label: 'Car Details' },
    { key: 'coverage', label: 'Coverage' },
    { key: 'review', label: 'Review' },
  ];

  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleNext = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  return (
    <div className="pip-page">
      {/* Page Header */}
      <div className="pip-page-header">
        <Heading className="pip-page-title">Progress Bar Designs</Heading>
        <p className="pip-page-subtitle">
          Four mobile-friendly progress indicator designs for the sign-up flow — evaluate and choose
          the best fit.
        </p>
      </div>

      {/* Step Controls */}
      <div className="pip-controls">
        <div className="pip-controls-info">
          <Tag type="blue" size="md">
            Step {currentStep + 1} of {steps.length}
          </Tag>
          <span className="pip-controls-step-name">{steps[currentStep].label}</span>
        </div>
        <div className="pip-controls-buttons">
          <Button
            kind="ghost"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            renderIcon={ArrowLeft}
            iconDescription="Back"
          >
            Back
          </Button>
          <Button
            kind="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            renderIcon={ArrowRight}
            iconDescription="Next"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="pip-options-grid">

        {/* ─────────────────────────────────────────────────────────
            OPTION 1 — Vertical Carbon ProgressIndicator
            Update to the current progress bar to make it vertical
        ───────────────────────────────────────────────────────── */}
        <div className="pip-option">
          <div className="pip-option-meta">
            <div className="pip-option-number">1</div>
            <div className="pip-option-info">
              <h3 className="pip-option-title">Vertical Step Tracker</h3>
              <p className="pip-option-desc">
                The current horizontal progress bar converted to vertical — no horizontal scrolling
                on any screen size.
              </p>
              <div className="pip-option-tags">
                <Tag type="blue" size="sm">Carbon Component</Tag>
                <Tag type="teal" size="sm">Updated Current Bar</Tag>
              </div>
            </div>
          </div>

          <div className="pip-demo-area">
            <MobileFrame label="Fits all screen sizes with no scrolling">
              <div className="pip-demo-inner pip-demo-inner--vertical">
                <ProgressIndicator
                  currentIndex={currentStep}
                  vertical
                  spaceEqually={false}
                >
                  {steps.map((step, index) => (
                    <ProgressStep
                      key={step.key}
                      label={step.label}
                      complete={index < currentStep}
                      current={index === currentStep}
                      description={index < currentStep ? 'Complete' : index === currentStep ? 'In progress' : ''}
                    />
                  ))}
                </ProgressIndicator>
              </div>
            </MobileFrame>
          </div>

          <div className="pip-assessment">
            <div className="pip-assessment-pros">
              <h4 className="pip-assessment-heading pip-assessment-heading--pro">Pros</h4>
              <ul className="pip-assessment-list">
                <li>Drop-in replacement for current horizontal bar</li>
                <li>No horizontal scrolling on any screen</li>
                <li>Shows all steps with clear completion state</li>
                <li>Full Carbon accessibility built-in</li>
              </ul>
            </div>
            <div className="pip-assessment-cons">
              <h4 className="pip-assessment-heading pip-assessment-heading--con">Cons</h4>
              <ul className="pip-assessment-list">
                <li>Pushes form content down with many steps</li>
                <li>Takes more vertical space than needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            OPTION 2 — Carbon ProgressBar + Step Counter
            New type using only Carbon components
        ───────────────────────────────────────────────────────── */}
        <div className="pip-option">
          <div className="pip-option-meta">
            <div className="pip-option-number">2</div>
            <div className="pip-option-info">
              <h3 className="pip-option-title">Progress Bar + Step Counter</h3>
              <p className="pip-option-desc">
                A compact Carbon ProgressBar filling horizontally — shows percentage and current
                step name inline. 100% Carbon components.
              </p>
              <div className="pip-option-tags">
                <Tag type="blue" size="sm">Carbon Only</Tag>
                <Tag type="purple" size="sm">Most Compact</Tag>
              </div>
            </div>
          </div>

          <div className="pip-demo-area">
            <MobileFrame label="Extremely compact — works with any number of steps">
              <div className="pip-demo-inner">
                <div className="carbon-bar-stepper">
                  <div className="carbon-bar-stepper__header">
                    <Heading as="h4" className="carbon-bar-stepper__step-name">
                      {steps[currentStep].label}
                    </Heading>
                    <Tag type={currentStep === steps.length - 1 ? 'green' : 'blue'} size="sm">
                      {currentStep + 1} / {steps.length}
                    </Tag>
                  </div>
                  <ProgressBar
                    label=""
                    hideLabel
                    helperText={`${progressPercent}% complete`}
                    value={progressPercent}
                    max={100}
                    status={currentStep === steps.length - 1 ? 'finished' : 'active'}
                  />
                  <div className="carbon-bar-stepper__step-list">
                    {steps.map((step, index) => {
                      const isDone = index < currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <Tag
                          key={step.key}
                          type={isDone ? 'green' : isCurrent ? 'blue' : 'outline'}
                          size="sm"
                          renderIcon={isDone ? CheckmarkFilled : undefined}
                        >
                          {step.label}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              </div>
            </MobileFrame>
          </div>

          <div className="pip-assessment">
            <div className="pip-assessment-pros">
              <h4 className="pip-assessment-heading pip-assessment-heading--pro">Pros</h4>
              <ul className="pip-assessment-list">
                <li>Very compact — only 2–3 lines tall</li>
                <li>Instantly shows percentage progress</li>
                <li>100% Carbon components, no custom code</li>
                <li>Tag list wraps naturally on small screens</li>
              </ul>
            </div>
            <div className="pip-assessment-cons">
              <h4 className="pip-assessment-heading pip-assessment-heading--con">Cons</h4>
              <ul className="pip-assessment-list">
                <li>Tag list can wrap to many lines with 6+ steps</li>
                <li>Less visual distinction between steps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            OPTION 3 — Carbon StructuredList Step Tracker
            Another Carbon approach, different from Option 2
        ───────────────────────────────────────────────────────── */}
        <div className="pip-option">
          <div className="pip-option-meta">
            <div className="pip-option-number">3</div>
            <div className="pip-option-info">
              <h3 className="pip-option-title">Structured Step List</h3>
              <p className="pip-option-desc">
                A Carbon StructuredList showing every step as a row with a status icon — clean,
                scannable, and fully Carbon.
              </p>
              <div className="pip-option-tags">
                <Tag type="blue" size="sm">Carbon Only</Tag>
                <Tag type="cyan" size="sm">Full Overview</Tag>
              </div>
            </div>
          </div>

          <div className="pip-demo-area">
            <MobileFrame label="Scrollable list — clear status at a glance">
              <div className="pip-demo-inner">
                <StructuredList className="step-list" condensed>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>
                        <span className="step-list__head-text">
                          Sign-up Progress &nbsp;
                          <Tag type="blue" size="sm">{progressPercent}%</Tag>
                        </span>
                      </StructuredListCell>
                      <StructuredListCell head className="step-list__status-col">Status</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {steps.map((step, index) => {
                      const isDone = index < currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <StructuredListRow
                          key={step.key}
                          className={`step-list__row${isCurrent ? ' step-list__row--current' : ''}${isDone ? ' step-list__row--done' : ''}`}
                        >
                          <StructuredListCell className="step-list__name-cell">
                            <span className="step-list__step-number">{index + 1}.</span>
                            <span className={`step-list__step-name${isCurrent ? ' step-list__step-name--current' : ''}`}>
                              {step.label}
                            </span>
                          </StructuredListCell>
                          <StructuredListCell className="step-list__status-cell">
                            {isDone ? (
                              <CheckmarkFilled size={16} className="step-list__icon step-list__icon--done" />
                            ) : isCurrent ? (
                              <CircleFilled size={16} className="step-list__icon step-list__icon--current" />
                            ) : (
                              <CircleDash size={16} className="step-list__icon step-list__icon--upcoming" />
                            )}
                          </StructuredListCell>
                        </StructuredListRow>
                      );
                    })}
                  </StructuredListBody>
                </StructuredList>
              </div>
            </MobileFrame>
          </div>

          <div className="pip-assessment">
            <div className="pip-assessment-pros">
              <h4 className="pip-assessment-heading pip-assessment-heading--pro">Pros</h4>
              <ul className="pip-assessment-list">
                <li>Every step visible with clear status icon</li>
                <li>Natural vertical scrolling on mobile</li>
                <li>100% Carbon components, no custom HTML</li>
                <li>Familiar table-like layout, easy to scan</li>
              </ul>
            </div>
            <div className="pip-assessment-cons">
              <h4 className="pip-assessment-heading pip-assessment-heading--con">Cons</h4>
              <ul className="pip-assessment-list">
                <li>More vertical space than compact options</li>
                <li>Dense — may feel form-heavy before the form</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            OPTION 4 — Custom Non-Carbon Dot Stepper
            No Carbon — whatever works best for mobile
        ───────────────────────────────────────────────────────── */}
        <div className="pip-option pip-option--recommended">
          <div className="pip-recommended-badge">Recommended</div>
          <div className="pip-option-meta">
            <div className="pip-option-number">4</div>
            <div className="pip-option-info">
              <h3 className="pip-option-title">Inline Dot Stepper</h3>
              <p className="pip-option-desc">
                A minimal custom dot-based stepper with a progress track — ultra-compact, fits in
                a single line on any screen size.
              </p>
              <div className="pip-option-tags">
                <Tag type="red" size="sm">Custom (No Carbon)</Tag>
                <Tag type="purple" size="sm">Best Mobile UX</Tag>
              </div>
            </div>
          </div>

          <div className="pip-demo-area">
            <MobileFrame label="Fits in one line — no scrolling, no extra height">
              <div className="pip-demo-inner">
                <DotStepper steps={steps} currentIndex={currentStep} />
              </div>
            </MobileFrame>
          </div>

          <div className="pip-assessment">
            <div className="pip-assessment-pros">
              <h4 className="pip-assessment-heading pip-assessment-heading--pro">Pros</h4>
              <ul className="pip-assessment-list">
                <li><strong>Most compact</strong> — only ~60px tall</li>
                <li>Works perfectly on any screen width</li>
                <li>Instantly scannable current step</li>
                <li>Smooth animated transitions</li>
                <li>No scrolling under any condition</li>
              </ul>
            </div>
            <div className="pip-assessment-cons">
              <h4 className="pip-assessment-heading pip-assessment-heading--con">Cons</h4>
              <ul className="pip-assessment-list">
                <li>Custom code — needs maintenance</li>
                <li>Dots don't show step names (only current)</li>
                <li>Accessibility requires manual ARIA setup</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Comparison Summary */}
      <div className="pip-summary">
        <Heading as="h3" className="pip-summary-title">Design Comparison</Heading>
        <div className="pip-comparison-table">
          <div className="pip-comparison-header">
            <div className="pip-comparison-cell pip-comparison-cell--label">Criteria</div>
            {['Vertical', 'Bar + Counter', 'Step List', 'Dot Stepper'].map((name, i) => (
              <div key={i} className={`pip-comparison-cell${i === 3 ? ' pip-comparison-cell--highlight' : ''}`}>
                <span className="pip-comparison-option-num">{i + 1}</span>
                <span className="pip-comparison-option-name">{name}</span>
              </div>
            ))}
          </div>
          {[
            { label: 'No horizontal scroll', scores: ['✅', '✅', '✅', '✅'] },
            { label: 'Compact height', scores: ['❌', '⚠️', '❌', '✅'] },
            { label: 'Shows all steps', scores: ['✅', '⚠️', '✅', '❌'] },
            { label: 'Pure Carbon', scores: ['✅', '✅', '✅', '❌'] },
            { label: 'Mobile-first UX', scores: ['⚠️', '✅', '⚠️', '✅'] },
            { label: 'Custom code', scores: ['❌', '❌', '❌', '✅'] },
          ].map((row) => (
            <div key={row.label} className="pip-comparison-row">
              <div className="pip-comparison-cell pip-comparison-cell--label">{row.label}</div>
              {row.scores.map((score, i) => (
                <div key={i} className={`pip-comparison-cell${i === 3 ? ' pip-comparison-cell--highlight' : ''}`}>
                  {score}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="pip-summary-note">
          <strong>Recommendation:</strong> Option 4 (Dot Stepper) for the best mobile UX — or
          Option 1 (Vertical) as a zero-risk drop-in replacement for the current bar.
        </p>
      </div>
    </div>
  );
}
