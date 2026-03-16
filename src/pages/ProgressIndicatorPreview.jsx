import React, { useState } from 'react';
import {
  Button,
  Heading,
  ProgressIndicator,
  ProgressStep,
  ProgressBar,
  Tag,
  StructuredListWrapper,
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

// ─────────────────────────────────────────────────────────────
// Static data outside component — avoids recreation on every render
// ─────────────────────────────────────────────────────────────
const STEPS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'address', label: 'Address' },
  { key: 'type', label: 'Insurance Type' },
  { key: 'car', label: 'Car Details' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'review', label: 'Review' },
];

const OPTION_NAMES = ['Vertical', 'Bar + Counter', 'Step List', 'Dot Stepper'];

// Emoji scores + accessible sr-only text (WCAG 1.4.1 — not color/symbol only)
const SCORE_MAP = {
  '✅': { label: 'Yes', cls: 'pip-score--yes' },
  '❌': { label: 'No', cls: 'pip-score--no' },
  '⚠️': { label: 'Partial', cls: 'pip-score--partial' },
};

const COMPARISON_ROWS = [
  { label: 'No horizontal scroll', scores: ['✅', '✅', '✅', '✅'] },
  { label: 'Compact height', scores: ['❌', '⚠️', '❌', '✅'] },
  { label: 'Shows all steps', scores: ['✅', '⚠️', '✅', '❌'] },
  { label: 'Pure Carbon', scores: ['✅', '✅', '✅', '❌'] },
  { label: 'Mobile-first UX', scores: ['⚠️', '✅', '⚠️', '✅'] },
  { label: 'Requires custom code', scores: ['❌', '❌', '❌', '✅'] },
];

// ─────────────────────────────────────────────────────────────
// Score cell — emoji is decorative, sr-only carries text meaning
// ─────────────────────────────────────────────────────────────
function ScoreCell({ score }) {
  const meta = SCORE_MAP[score] ?? { label: score, cls: '' };
  return (
    <span className={`pip-score ${meta.cls}`}>
      <span aria-hidden="true">{score}</span>
      <span className="sr-only">{meta.label}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Option 4: Custom Dot Stepper (no Carbon)
// ─────────────────────────────────────────────────────────────
function DotStepper({ steps, currentIndex }) {
  return (
    <div
      className="dot-stepper"
      role="group"
      aria-label={`Sign-up progress: step ${currentIndex + 1} of ${steps.length}, ${steps[currentIndex].label}`}
    >
      {/* Visible header — aria-hidden since the group aria-label covers it */}
      <div className="dot-stepper__header" aria-hidden="true">
        <span className="dot-stepper__counter">
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span className="dot-stepper__label">{steps[currentIndex].label}</span>
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

      {/* Screen-reader step list */}
      <ol className="sr-only">
        {steps.map((step, index) => {
          const status =
            index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
          return <li key={step.key}>{step.label}: {status}</li>;
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile Frame — purely presentational chrome
// ─────────────────────────────────────────────────────────────
function MobileFrame({ children, label }) {
  return (
    <div className="mobile-frame-wrapper">
      <div className="mobile-frame-device">
        {/* Device chrome is decorative */}
        <div className="mobile-frame-notch" aria-hidden="true" />
        <div className="mobile-frame-screen">
          <div className="mobile-frame-status-bar" aria-hidden="true">
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

// ─────────────────────────────────────────────────────────────
// Pros / Cons
// ─────────────────────────────────────────────────────────────
function Assessment({ pros, cons }) {
  return (
    <div className="pip-assessment">
      <div className="pip-assessment-pros">
        <h4 className="pip-assessment-heading pip-assessment-heading--pro">Pros</h4>
        <ul className="pip-assessment-list">
          {pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="pip-assessment-cons">
        <h4 className="pip-assessment-heading pip-assessment-heading--con">Cons</h4>
        <ul className="pip-assessment-list">
          {cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function ProgressIndicatorPreview() {
  const [currentStep, setCurrentStep] = useState(2);

  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <main className="pip-page">

      {/* Page header */}
      <div className="pip-page-header">
        <Heading as="h1" className="pip-page-title">
          Progress Bar Designs
        </Heading>
        <p className="pip-page-subtitle">
          Four mobile-friendly progress indicator designs for the sign-up flow — evaluate and
          choose the best fit.
        </p>
      </div>

      {/* Interactive controls */}
      <div className="pip-controls" role="region" aria-label="Step preview controls">
        <div className="pip-controls-info">
          <Tag type="blue" size="md">
            Step {currentStep + 1} of {STEPS.length}
          </Tag>
          <span
            className="pip-controls-step-name"
            aria-live="polite"
            aria-atomic="true"
          >
            {STEPS[currentStep].label}
          </span>
        </div>
        <div className="pip-controls-buttons">
          <Button
            kind="ghost"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            renderIcon={ArrowLeft}
            iconDescription="Go to previous step"
          >
            Back
          </Button>
          <Button
            kind="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentStep === STEPS.length - 1}
            renderIcon={ArrowRight}
            iconDescription="Go to next step"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Options grid */}
      <div className="pip-options-grid">

        {/* ═══════════════════════════════════════════════════════
            OPTION 1 — Vertical Carbon ProgressIndicator
            (current horizontal bar updated to vertical)
        ═══════════════════════════════════════════════════════ */}
        <section className="pip-option" aria-labelledby="opt1-title">
          <div className="pip-option-meta">
            <div className="pip-option-number" aria-hidden="true">1</div>
            <div className="pip-option-info">
              <h2 id="opt1-title" className="pip-option-title">Vertical Step Tracker</h2>
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

          <div className="pip-demo-area" aria-label="Option 1 mobile preview">
            <MobileFrame label="Fits all screen sizes, no horizontal scroll">
              <div className="pip-demo-inner pip-demo-inner--vertical">
                <ProgressIndicator currentIndex={currentStep} vertical>
                  {STEPS.map((step, index) => (
                    <ProgressStep
                      key={step.key}
                      label={step.label}
                      complete={index < currentStep}
                      current={index === currentStep}
                      description={
                        index < currentStep
                          ? 'Complete'
                          : index === currentStep
                          ? 'In progress'
                          : ''
                      }
                    />
                  ))}
                </ProgressIndicator>
              </div>
            </MobileFrame>
          </div>

          <Assessment
            pros={[
              'Drop-in replacement for current horizontal bar',
              'No horizontal scrolling on any screen',
              'Shows all steps with clear completion state',
              'Full Carbon accessibility built-in',
            ]}
            cons={[
              'Pushes form content down with many steps',
              'Takes more vertical space than compact options',
            ]}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════
            OPTION 2 — Carbon ProgressBar + Tags (Pure Carbon)
        ═══════════════════════════════════════════════════════ */}
        <section className="pip-option" aria-labelledby="opt2-title">
          <div className="pip-option-meta">
            <div className="pip-option-number" aria-hidden="true">2</div>
            <div className="pip-option-info">
              <h2 id="opt2-title" className="pip-option-title">Progress Bar + Step Counter</h2>
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

          <div className="pip-demo-area" aria-label="Option 2 mobile preview">
            <MobileFrame label="Extremely compact — works with any number of steps">
              <div className="pip-demo-inner">
                <div className="carbon-bar-stepper">
                  <div className="carbon-bar-stepper__header">
                    <Heading as="h3" className="carbon-bar-stepper__step-name">
                      {STEPS[currentStep].label}
                    </Heading>
                    <Tag
                      type={currentStep === STEPS.length - 1 ? 'green' : 'blue'}
                      size="sm"
                    >
                      {currentStep + 1} / {STEPS.length}
                    </Tag>
                  </div>
                  <ProgressBar
                    label="Sign-up progress"
                    helperText={`${progressPercent}% complete`}
                    value={progressPercent}
                    max={100}
                    status={currentStep === STEPS.length - 1 ? 'finished' : 'active'}
                  />
                  <div className="carbon-bar-stepper__step-list" role="list" aria-label="All steps">
                    {STEPS.map((step, index) => {
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
                          <span className="sr-only">
                            {isDone ? ' — complete' : isCurrent ? ' — current' : ' — upcoming'}
                          </span>
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              </div>
            </MobileFrame>
          </div>

          <Assessment
            pros={[
              'Very compact — only 2–3 lines tall',
              'Instantly shows percentage progress',
              '100% Carbon components, no custom code',
              'Step tags wrap naturally on small screens',
            ]}
            cons={[
              'Tag list can wrap to many lines with 6+ steps',
              'Less visual distinction between steps',
            ]}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════
            OPTION 3 — Carbon StructuredList Step Tracker
        ═══════════════════════════════════════════════════════ */}
        <section className="pip-option" aria-labelledby="opt3-title">
          <div className="pip-option-meta">
            <div className="pip-option-number" aria-hidden="true">3</div>
            <div className="pip-option-info">
              <h2 id="opt3-title" className="pip-option-title">Structured Step List</h2>
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

          <div className="pip-demo-area" aria-label="Option 3 mobile preview">
            <MobileFrame label="Scrollable list — clear status at a glance">
              <div className="pip-demo-inner">
                <StructuredListWrapper className="step-list" condensed>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>
                        <span className="step-list__head-text">
                          Sign-up Progress
                          <Tag type="blue" size="sm">{progressPercent}%</Tag>
                        </span>
                      </StructuredListCell>
                      <StructuredListCell head className="step-list__status-col">
                        Status
                      </StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {STEPS.map((step, index) => {
                      const isDone = index < currentStep;
                      const isCurrent = index === currentStep;
                      const statusLabel = isDone
                        ? 'complete'
                        : isCurrent
                        ? 'current step'
                        : 'upcoming';
                      return (
                        <StructuredListRow
                          key={step.key}
                          className={[
                            'step-list__row',
                            isCurrent ? 'step-list__row--current' : '',
                            isDone ? 'step-list__row--done' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <StructuredListCell className="step-list__name-cell">
                            <span className="step-list__step-number" aria-hidden="true">
                              {index + 1}.
                            </span>
                            <span
                              className={`step-list__step-name${
                                isCurrent ? ' step-list__step-name--current' : ''
                              }`}
                            >
                              {step.label}
                            </span>
                          </StructuredListCell>
                          <StructuredListCell className="step-list__status-cell">
                            {isDone ? (
                              <CheckmarkFilled
                                size={16}
                                className="step-list__icon step-list__icon--done"
                              />
                            ) : isCurrent ? (
                              <CircleFilled
                                size={16}
                                className="step-list__icon step-list__icon--current"
                              />
                            ) : (
                              <CircleDash
                                size={16}
                                className="step-list__icon step-list__icon--upcoming"
                              />
                            )}
                            <span className="sr-only">{statusLabel}</span>
                          </StructuredListCell>
                        </StructuredListRow>
                      );
                    })}
                  </StructuredListBody>
                </StructuredListWrapper>
              </div>
            </MobileFrame>
          </div>

          <Assessment
            pros={[
              'Every step visible with clear status icon',
              'Natural vertical scrolling on mobile',
              '100% Carbon components, no custom HTML',
              'Familiar table-like layout, easy to scan',
            ]}
            cons={[
              'More vertical space than compact options',
              'Dense — may feel form-heavy before the form',
            ]}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════
            OPTION 4 — Custom Non-Carbon Dot Stepper
        ═══════════════════════════════════════════════════════ */}
        <section className="pip-option pip-option--recommended" aria-labelledby="opt4-title">
          <div className="pip-recommended-badge">Recommended</div>
          <div className="pip-option-meta">
            <div className="pip-option-number" aria-hidden="true">4</div>
            <div className="pip-option-info">
              <h2 id="opt4-title" className="pip-option-title">Inline Dot Stepper</h2>
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

          <div className="pip-demo-area" aria-label="Option 4 mobile preview">
            <MobileFrame label="Fits in one line — no scrolling, no extra height">
              <div className="pip-demo-inner">
                <DotStepper steps={STEPS} currentIndex={currentStep} />
              </div>
            </MobileFrame>
          </div>

          <Assessment
            pros={[
              'Most compact — only ~60px tall',
              'Works perfectly on any screen width',
              'Instantly scannable current step',
              'Smooth animated transitions',
              'No scrolling under any condition',
            ]}
            cons={[
              'Custom code — requires ongoing maintenance',
              'Dots alone do not show all step names',
              'Accessibility must be maintained manually',
            ]}
          />
        </section>

      </div>

      {/* Comparison summary — proper <table> for screen reader navigation */}
      <section className="pip-summary" aria-labelledby="summary-title">
        <Heading as="h2" id="summary-title" className="pip-summary-title">
          Design Comparison
        </Heading>

        <table className="pip-comparison-table" aria-label="Progress bar design comparison">
          <thead>
            <tr>
              <th scope="col" className="pip-comparison-cell pip-comparison-cell--label">
                Criteria
              </th>
              {OPTION_NAMES.map((name, i) => (
                <th
                  key={name}
                  scope="col"
                  className={`pip-comparison-cell${i === 3 ? ' pip-comparison-cell--highlight' : ''}`}
                >
                  <span className="pip-comparison-option-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pip-comparison-option-name">{name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label}>
                <td className="pip-comparison-cell pip-comparison-cell--label">{row.label}</td>
                {row.scores.map((score, i) => (
                  <td
                    key={`${row.label}-${i}`}
                    className={`pip-comparison-cell${
                      i === 3 ? ' pip-comparison-cell--highlight' : ''
                    }`}
                  >
                    <ScoreCell score={score} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="pip-summary-note">
          <strong>Recommendation:</strong> Option 4 (Dot Stepper) for the best mobile UX — or
          Option 1 (Vertical) as a zero-risk drop-in replacement for the current bar.
        </p>
      </section>
    </main>
  );
}
