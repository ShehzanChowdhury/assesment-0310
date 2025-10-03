'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThreeStateStatus } from '@/@components/ui/ThreeStateStatus';
import type { TeamDto, ApprovalState } from '@/@types/team';
import { useToast } from '@/@components/common/Toast';

interface StatusUpdateButtonsProps {
  team: TeamDto;
  approvalType: 'manager' | 'director';
}

export function StatusUpdateButtons({ team, approvalType }: StatusUpdateButtonsProps) {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = React.useState(false);
  const currentValue = approvalType === 'manager' ? team.managerApproval : team.directorApproval;
  const title = `${approvalType === 'manager' ? 'Manager' : 'Director'}: ${currentValue}`;

  async function handleStatusChange(status: ApprovalState) {
    if (loading) return;
    setLoading(true);
    try {
      const endpoint = approvalType === 'manager' 
        ? `/api/teams/${team._id}/manager-approve`
        : `/api/teams/${team._id}/director-approve`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      show('Team Status Saved');
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThreeStateStatus
      value={currentValue}
      onChange={handleStatusChange}
      title={title}
      loading={loading}
    />
  );
}
