import React from 'react';
import type { TeamDto } from '@/@types/team';
import { TeamActions } from './TeamActions';
import { StatusUpdateButtons } from './StatusUpdateButtons';

interface TeamRowProps {
  team: TeamDto;
}

export function TeamRow({ team }: TeamRowProps) {
  return (
    <tr>
      <td>{team.name}</td>
      <td className="text-center">
        <StatusUpdateButtons
          team={team}
          approvalType="manager"
        />
      </td>
      <td className="text-center">
        <StatusUpdateButtons
          team={team}
          approvalType="director"
        />
      </td>
      <td>
        <TeamActions team={team} />
      </td>
    </tr>
  );
}
