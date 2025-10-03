import type { TeamDto, ApprovalState } from '@/@types/team';
import { emitGlobalError } from '@/@utils';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    const message = text || res.statusText || 'Failed to fetch';
    try {
      emitGlobalError('Failed to fetch');
    } catch (_) {}
    throw new Error(message);
  }
  try {
    const json = await res.json();
    return (json?.data ?? json) as Promise<T>;
  } catch (err) {
    try {
      emitGlobalError('Failed to fetch');
    } catch (_) {}
    throw err;
  }
}

export async function listTeams(): Promise<TeamDto[]> {
  const res = await fetch('/api/teams', { cache: 'no-store' });
  return handle<{ success: boolean; data: TeamDto[] }>(res).then((r) => r.data);
}

export async function deleteTeam(id: string): Promise<void> {
  const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
  await handle(res);
}

export async function updateManagerApproval(id: string, status: ApprovalState): Promise<TeamDto> {
  const res = await fetch(`/api/teams/${id}/manager-approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handle<{ success: boolean; data: TeamDto }>(res).then((r) => r.data);
}

export async function updateDirectorApproval(id: string, status: ApprovalState): Promise<TeamDto> {
  const res = await fetch(`/api/teams/${id}/director-approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handle<{ success: boolean; data: TeamDto }>(res).then((r) => r.data);
}

export async function createTeam(teamData: Omit<TeamDto, '_id' | 'managerApproval' | 'directorApproval'>): Promise<TeamDto> {
  const res = await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  return handle<{ success: boolean; data: TeamDto }>(res).then((r) => r.data);
}

export async function updateTeam(id: string, teamData: Partial<Omit<TeamDto, '_id' | 'managerApproval' | 'directorApproval'>>): Promise<TeamDto> {
  const res = await fetch(`/api/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  return handle<{ success: boolean; data: TeamDto }>(res).then((r) => r.data);
}

export async function getTeam(id: string): Promise<TeamDto | null> {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : '';
  const url = `${baseUrl}/api/teams/${id}`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      const text = await res.text();
      const message = text || res.statusText || 'Failed to fetch';
      try { emitGlobalError('Failed to fetch'); } catch (_) {}
      throw new Error(message);
    }
    return handle<TeamDto>(res);
  } catch (error) {
    console.error('Error in getTeam:', error);
    try { emitGlobalError('Failed to fetch'); } catch (_) {}
    return null;
  }
}





