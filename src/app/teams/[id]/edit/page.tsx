import { getTeam } from '@/@services/teams';
import { TeamForm } from '@/features/teams/TeamForm';
import { notFound } from 'next/navigation';

interface EditTeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
  const { id } = await params;
  
  const team = await getTeam(id);
  
  if (!team) {
    notFound();
  }
  
  return <TeamForm team={team} mode="edit" />;
}
