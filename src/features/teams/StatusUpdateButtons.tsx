'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThreeStateStatus } from '@/@components/ui/ThreeStateStatus';
import type { TeamDto, ApprovalState } from '@/@types/team';

interface StatusUpdateButtonsProps {
  team: TeamDto;
  approvalType: 'manager' | 'director';
}

export function StatusUpdateButtons({ team, approvalType }: StatusUpdateButtonsProps) {
  const router = useRouter();
  const currentValue = approvalType === 'manager' ? team.managerApproval : team.directorApproval;
  const title = `${approvalType === 'manager' ? 'Manager' : 'Director'}: ${currentValue}`;

  async function handleStatusChange(status: ApprovalState) {
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
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  }

  return (
    <ThreeStateStatus
      value={currentValue}
      onChange={handleStatusChange}
      title={title}
    />
  );
}
