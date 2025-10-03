import type { TeamDto, ApprovalState } from '@/@types/team';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json().then((j) => (j?.data ?? j)) as Promise<T>;
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





