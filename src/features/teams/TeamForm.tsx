"use client";
import React, { useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamDto, TeamMember } from '@/@types/team';
import { createTeam, updateTeam } from '@/@services/teams';
import { useToast } from '@/@components/common/Toast';
import { TeamMemberRow } from './TeamMemberRow';

interface TeamFormProps {
  team?: TeamDto;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
  members: TeamMember[];
}

interface FormErrors {
  name?: string;
  description?: string;
  // Shallow validation message for the members list itself (e.g., when empty)
  membersGeneral?: string;
  members?: Array<{
    name?: string;
    gender?: string;
    dateOfBirth?: string;
    contact?: string;
  }>;
}

export function TeamForm({ team, mode }: TeamFormProps) {
  const router = useRouter();
  const { show } = useToast();
  
  const computeInitialForm = (): FormData => ({
    name: team?.name || '',
    description: team?.description || '',
    members: (team?.members && team.members.length > 0)
      ? team.members
      : [{ name: '', gender: '', dateOfBirth: '', contact: '' }],
  });

  // Keep a stable snapshot of the initial form for dirty-checking
  const initialFormRef = useRef<FormData>(computeInitialForm());

  const [formData, setFormData] = useState<FormData>(initialFormRef.current);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast deep compare for our simple shape
  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormRef.current);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate team name
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    // Validate team description
    if (!formData.description.trim()) {
      newErrors.description = 'Team description is required';
    }

    // Validate members
    const memberErrors: Array<{ name?: string; gender?: string; dateOfBirth?: string; contact?: string }> = [];
    let hasMemberErrors = false;

    // Require at least one member
    if (formData.members.length === 0) {
      newErrors.membersGeneral = 'At least one team member is required';
    }

    formData.members.forEach((member) => {
      const memberError: { name?: string; gender?: string; dateOfBirth?: string; contact?: string } = {};

      if (!member.name.trim()) {
        memberError.name = 'Name is required';
        hasMemberErrors = true;
      }

      if (!member.gender.trim()) {
        memberError.gender = 'Gender is required';
        hasMemberErrors = true;
      }

      if (!member.dateOfBirth.trim()) {
        memberError.dateOfBirth = 'Date of birth is required';
        hasMemberErrors = true;
      }

      if (!member.contact.trim()) {
        memberError.contact = 'Contact number is required';
        hasMemberErrors = true;
      } else if (!/^\d+$/.test(member.contact.trim())) {
        memberError.contact = 'Contact number must contain digits only';
        hasMemberErrors = true;
      }

      memberErrors.push(memberError);
    });

    if (hasMemberErrors) {
      newErrors.members = memberErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      ),
    }));

    // Clear member error when user starts typing
    if (errors.members?.[index]?.[field]) {
      setErrors(prev => ({
        ...prev,
        members: prev.members?.map((memberError, i) => 
          i === index ? { ...memberError, [field]: undefined } : memberError
        ),
      }));
    }
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { name: '', gender: '', dateOfBirth: '', contact: '' }],
    }));
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));

    // Clear member errors for removed member
    if (errors.members) {
      setErrors(prev => ({
        ...prev,
        members: prev.members?.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await createTeam(formData);
        show('Team created successfully');
      } else {
        await updateTeam(team!._id, formData);
        show('Team updated successfully');
      }
      
      router.push('/');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to save team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (isFormChanged) {
      const confirmed = window.confirm('You have unsaved changes. If you exit now, all changes will be lost. Do you want to continue?');
      if (!confirmed) return;
    }
    router.push('/');
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header text-white" style={{ backgroundColor: '#1F4E78' }}>
          <h5 className="mb-0 text-center">
            Team Details
          </h5>
        </div>
        <div className="card-body" style={{ backgroundColor: '#e2efda' }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Team Information Section */}
            <div className="row mb-8">
              
              <div className="col-md-6 mb-3">
                <label htmlFor="teamName" className="form-label">
                  Team Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="teamName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter team name"
                />
                {errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="col-12 mb-3">
                <label htmlFor="teamDescription" className="form-label">
                  Team Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="teamDescription"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter team description"
                />
                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Team Members Section */}
            <div className="row mb-4" >
              <div className="col-12">
                <h6 className="text-primary mb-3">Team Members</h6>
              </div>
              
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Name <span className="text-danger">*</span></th>
                        <th>Gender <span className="text-danger">*</span></th>
                        <th>Date of Birth <span className="text-danger">*</span></th>
                        <th>Contact No. <span className="text-danger">*</span></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.members.map((member, index) => (
                        <TeamMemberRow
                          key={index}
                          member={member}
                          index={index}
                          onChange={handleMemberChange}
                          onRemove={removeMember}
                          errors={errors.members?.[index]}
                        />
                      ))}
                      {formData.members.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No team members added yet. Click &quot;Add New Member&quot; to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {errors.membersGeneral && (
                  <div className="text-danger small mb-2">{errors.membersGeneral}</div>
                )}
                
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={addMember}
                >
                  Add New Member
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExit}
                disabled={isSubmitting}
              >
                Exit
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !isFormChanged}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
