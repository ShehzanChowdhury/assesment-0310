'use client';

import React from 'react';
import Link from 'next/link';
import type { TeamDto } from '@/@types/team';

interface TeamActionsProps {
  team: TeamDto;
}

export function TeamActions({ team }: TeamActionsProps) {
  async function handleDelete(id: string) {
    if (!confirm('Delete this team?')) return;
    
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team');
      }
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    }
  }

  return (
    <div className="d-flex gap-2">
      <Link href={`/teams/${team._id}`} className="btn btn-link p-0">
        Edit
      </Link>
      <button 
        className="btn btn-link text-danger p-0" 
        onClick={() => handleDelete(team._id)}
      >
        Delete
      </button>
    </div>
  );
}
