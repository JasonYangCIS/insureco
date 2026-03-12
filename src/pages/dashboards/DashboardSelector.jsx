import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, ClickableTile } from '@carbon/react';
import { Finance, Analytics, ColorPalette, ArrowRight } from '@carbon/icons-react';
import './DashboardSelector.scss';

export default function DashboardSelector() {
  const navigate = useNavigate();

  const dashboardOptions = [
    {
      id: 'conservative',
      title: 'Conservative',
      subtitle: 'Traditional Financial Overview',
      description: 'Classic grid layout with standard data tables and familiar financial dashboard patterns. Perfect for traditional financial analysis.',
      icon: Finance,
      route: '/dashboard-conservative',
      color: 'conservative',
      features: [
        'Traditional KPI cards',
        'Standard charts (line/bar toggle)',
        'Sortable data table',
        'Professional styling',
      ],
    },
    {
      id: 'modern',
      title: 'Modern Sleek',
      subtitle: 'Minimalist Design',
      description: 'Contemporary interface with clean typography, subtle animations, and refined color usage. A fresh take on financial analytics.',
      icon: Analytics,
      route: '/dashboard-modern',
      color: 'modern',
      features: [
        'Minimalist KPI cards',
        'Tabbed navigation',
        'Progress indicators',
        'Blue gradient theme',
      ],
    },
    {
      id: 'creative',
      title: 'Wild & Creative',
      subtitle: 'Data Storytelling Experience',
      description: 'Bold visualizations with unconventional layouts, asymmetric design, and creative use of space and color. Stand out from the crowd.',
      icon: ColorPalette,
      route: '/dashboard-creative',
      color: 'creative',
      features: [
        'Asymmetric layouts',
        'Bold gradient cards',
        'Multiple chart types',
        'Creative color schemes',
      ],
    },
  ];

  return (
    <div className="dashboard-selector">
      <div className="selector-hero">
        <Grid>
          <Column lg={16}>
            <div className="hero-content-selector">
              <h1 className="selector-title">Financial Dashboard Prototypes</h1>
              <p className="selector-subtitle">
                Choose from three distinct design approaches for the Insurance Financial Analytics Dashboard (IFAD)
              </p>
            </div>
          </Column>
        </Grid>
      </div>

      <Grid className="selector-grid">
        {dashboardOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Column sm={4} md={8} lg={16} key={option.id}>
              <ClickableTile
                className={`dashboard-option-card dashboard-option-${option.color}`}
                onClick={() => navigate(option.route)}
              >
                <div className="option-header">
                  <div className="option-icon">
                    <IconComponent size={48} />
                  </div>
                  <div className="option-titles">
                    <h2 className="option-title">{option.title}</h2>
                    <p className="option-subtitle">{option.subtitle}</p>
                  </div>
                  <div className="option-arrow">
                    <ArrowRight size={32} />
                  </div>
                </div>

                <p className="option-description">{option.description}</p>

                <div className="option-features">
                  <div className="features-label">Key Features:</div>
                  <ul className="features-list">
                    {option.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="option-footer">
                  <span className="view-prototype-text">View Prototype</span>
                  <ArrowRight size={20} />
                </div>
              </ClickableTile>
            </Column>
          );
        })}
      </Grid>

      <Grid className="info-section">
        <Column lg={16}>
          <div className="info-content">
            <h3 className="info-title">About These Prototypes</h3>
            <p className="info-text">
              Each prototype implements the complete Financial Dashboard PRD with the following features:
            </p>
            <ul className="info-list">
              <li><strong>Summary Statistics:</strong> Total Owed, Total Claimed, Portfolio Split, Loss Ratio</li>
              <li><strong>Expense Visualization:</strong> 12-month trend analysis with interactive charts</li>
              <li><strong>Asset Performance Ledger:</strong> Sortable table with 25 realistic insurance assets</li>
              <li><strong>Drill-Down Views:</strong> Detailed asset pages with claim history and policy documents</li>
            </ul>
            <p className="info-text">
              Click any prototype above to explore the full dashboard experience with realistic mock data.
            </p>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
