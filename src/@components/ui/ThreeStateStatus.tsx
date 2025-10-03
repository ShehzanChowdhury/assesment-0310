"use client";
import React from 'react';
import type { ApprovalState } from '@/@types/team';

type Props = {
  value: ApprovalState;
  onChange: (next: ApprovalState) => void;
  title?: string;
};

const STATES: ApprovalState[] = ['Pending', 'Approved', 'Not Approved'];

function nextState(current: ApprovalState): ApprovalState {
  const idx = STATES.indexOf(current);
  const ni = (idx + 1) % STATES.length;
  return STATES[ni];
}

export function ThreeStateStatus({ value, onChange, title }: Props) {
  const handleClick = React.useCallback(() => {
    onChange(nextState(value));
  }, [value, onChange]);

  const colorClass = value === 'Approved' ? 'text-success border-success' : value === 'Not Approved' ? 'text-danger border-danger' : 'text-secondary border-secondary';
  const icon = value === 'Approved' ? '✓' : value === 'Not Approved' ? '✕' : '';
  const aria = title || `${value}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      title={aria}
      aria-label={aria}
      className={`rounded-circle d-inline-flex align-items-center justify-content-center bg-transparent ${colorClass}`}
      style={{ width: 28, height: 28, borderWidth: 2, borderStyle: 'solid' }}
    >
      <span className="fs-6 lh-1">{icon}</span>
    </button>
  );
}

export default ThreeStateStatus;


