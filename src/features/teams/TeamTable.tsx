import React from 'react';
import type { TeamDto } from '@/@types/team';
import { TeamRow } from './TeamRow';

interface TeamTableProps {
  teams: TeamDto[];
}

export function TeamTable({ teams }: TeamTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0 align-middle">
        <thead className="table-success">
          <tr>
            <th scope="col">Team Name</th>
            <th scope="col" className="text-center">Approved by Manager</th>
            <th scope="col" className="text-center">Approved by Director</th>
            <th scope="col" style={{ width: 180 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <TeamRow key={team._id} team={team} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
