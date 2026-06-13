import React from 'react';
import './RetryState.scss';

interface RetryStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
}

const RetryState: React.FC<RetryStateProps> = ({ title, message, actionLabel = 'Try again', onRetry }) => (
  <section className="retry-state" role="status">
    <span className="state-kicker">Something went sideways</span>
    <h1>{title}</h1>
    <p>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry}>
        {actionLabel}
      </button>
    )}
  </section>
);

export default RetryState;
