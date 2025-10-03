import Link from 'next/link';
import { getTeams } from '@/lib/teams';
import { TeamTable } from '../../features/teams';

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Team Status</h5>
          <Link href="/teams/new" className="btn btn-warning btn-sm fw-semibold">New Team</Link>
        </div>
        <div className="card-body p-0">
          <TeamTable teams={teams} />
        </div>
      </div>
    </div>
  );
}
