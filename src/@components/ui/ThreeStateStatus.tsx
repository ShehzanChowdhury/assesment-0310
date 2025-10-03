"use client";
import React from 'react';
import type { ApprovalState } from '@/@types/team';

type Props = {
  value: ApprovalState;
  onChange: (next: ApprovalState) => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
};

const STATES: ApprovalState[] = ['Pending', 'Approved', 'Not Approved'];

function nextState(current: ApprovalState): ApprovalState {
  const idx = STATES.indexOf(current);
  const ni = (idx + 1) % STATES.length;
  return STATES[ni];
}

export function ThreeStateStatus({ value, onChange, title, loading = false, disabled = false }: Props) {
  const handleClick = React.useCallback(() => {
    if (loading || disabled) return;
    onChange(nextState(value));
  }, [value, onChange, loading, disabled]);

  const colorClass = value === 'Approved' ? 'text-success border-success' : value === 'Not Approved' ? 'text-danger border-danger' : 'text-secondary border-secondary';
  const icon = value === 'Approved' ? '✓' : value === 'Not Approved' ? '✕' : '';
  const aria = title || `${value}`;

  return (
    <span className="tooltip-wrapper" data-tooltip={aria}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={aria}
        aria-busy={loading}
        disabled={loading || disabled}
        className={`rounded-circle d-inline-flex align-items-center justify-content-center ${icon?"bg-transparent": "bg-secondary"} ${colorClass}`}
        style={{ width: 28, height: 28, borderWidth: 2, borderStyle: 'solid', opacity: loading || disabled ? 0.7 : 1 }}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm spinner-border-primary" role="status" aria-hidden="true"></span>
        ) : (
          <span className="fs-6 lh-1">{icon}</span>
        )}
      </button>
    </span>
  );
}

export default ThreeStateStatus;


