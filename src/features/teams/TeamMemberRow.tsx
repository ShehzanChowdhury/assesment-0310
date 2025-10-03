"use client";
import React from 'react';
import type { TeamMember } from '@/@types/team';

interface TeamMemberRowProps {
  member: TeamMember;
  index: number;
  onChange: (index: number, field: keyof TeamMember, value: string) => void;
  onRemove: (index: number) => void;
  errors?: {
    name?: string;
    gender?: string;
    dateOfBirth?: string;
    contact?: string;
  };
}

export function TeamMemberRow({ member, index, onChange, onRemove, errors }: TeamMemberRowProps) {
  const handleChange = (field: keyof TeamMember) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    // Convert date input to ISO string for API compatibility
    if (field === 'dateOfBirth' && value) {
      const date = new Date(value);
      value = date.toISOString();
    }
    
    // Enforce digits-only for contact field at input time
    if (field === 'contact') {
      value = value.replace(/[^0-9]/g, '');
    }

    onChange(index, field, value);
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
          value={member.name}
          onChange={handleChange('name')}
          placeholder="Enter member name"
        />
        {errors?.name && (
          <div className="invalid-feedback">
            {errors.name}
          </div>
        )}
      </td>
      <td>
        <select
          className={`form-control ${errors?.gender ? 'is-invalid' : ''}`}
          value={member.gender}
          onChange={handleChange('gender')}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors?.gender && (
          <div className="invalid-feedback">
            {errors.gender}
          </div>
        )}
      </td>
      <td>
        <input
          type="date"
          className={`form-control ${errors?.dateOfBirth ? 'is-invalid' : ''}`}
          value={formatDateForInput(member.dateOfBirth)}
          onChange={handleChange('dateOfBirth')}
        />
        {errors?.dateOfBirth && (
          <div className="invalid-feedback">
            {errors.dateOfBirth}
          </div>
        )}
      </td>
      <td>
        <input
          type="tel"
          className={`form-control ${errors?.contact ? 'is-invalid' : ''}`}
          value={member.contact}
          onChange={handleChange('contact')}
          placeholder="Enter contact number"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {errors?.contact && (
          <div className="invalid-feedback">
            {errors.contact}
          </div>
        )}
      </td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onRemove(index)}
          title="Remove member"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}
