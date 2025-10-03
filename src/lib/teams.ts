import { connectToDatabase } from '@/lib/db';
import { TeamModel } from '@/models/Team';
import type { TeamDto } from '@/@types/team';

export async function getTeams(): Promise<TeamDto[]> {
  try {
    await connectToDatabase();
    const teams = await TeamModel.find({}).sort({ createdAt: -1 }).lean();
    
    // Transform the data to match TeamDto interface
    return teams.map(team => ({
      _id: String(team._id),
      name: team.name,
      description: team.description,
      managerApproval: team.managerApproval,
      directorApproval: team.directorApproval,
      members: team.members.map((member: { name: string; gender: string; dateOfBirth: Date; contact: string }) => ({
        name: member.name,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth.toISOString(),
        contact: member.contact,
      })),
    }));
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return [];
  }
}
