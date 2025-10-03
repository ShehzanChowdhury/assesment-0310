import React from "react";
import type { TeamDto } from "@/@types/team";
import { TeamRow } from "./TeamRow";

interface TeamTableProps {
  teams: TeamDto[];
}

export function TeamTable({ teams }: TeamTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0 align-middle border border-dark">
        <thead className="table-success">
          <tr>
            <th scope="col" className="border-end border-dark w-50">Team Name</th>
            <th scope="col" className="text-center border-end border-dark">
              Approved by Manager
            </th>
            <th scope="col" className="text-center border-end border-dark">
              Approved by Director
            </th>
            <th scope="col" className="text-center border-end border-dark" style={{ width: 180 }}>
              
            </th>
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
