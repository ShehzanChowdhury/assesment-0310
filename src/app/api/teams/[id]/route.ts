import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { TeamModel } from '@/models/Team';

const MemberSchema = z.object({
  name: z.string().min(1),
  gender: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  contact: z.string().min(1),
});

const UpdateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  members: z.array(MemberSchema).optional(),
});

function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ success: false, message, details }, { status });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return jsonError(400, 'Invalid team id');

    const team = await TeamModel.findById(id).lean();
    if (!team) return jsonError(404, 'Team not found');
    return NextResponse.json({ success: true, data: team });
  } catch (error: unknown) {
    return jsonError(500, 'Failed to fetch team', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return jsonError(400, 'Invalid team id');

    const body = await req.json();
    const parsed = UpdateTeamSchema.safeParse(body);
    if (!parsed.success) return jsonError(400, 'Invalid request body', parsed.error.flatten());

    const updated = await TeamModel.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );
    if (!updated) return jsonError(404, 'Team not found');
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return jsonError(500, 'Failed to update team', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return jsonError(400, 'Invalid team id');
    const deleted = await TeamModel.findByIdAndDelete(id);
    if (!deleted) return jsonError(404, 'Team not found');
    return NextResponse.json({ success: true, data: { _id: id } });
  } catch (error: unknown) {
    return jsonError(500, 'Failed to delete team', error instanceof Error ? error.message : 'Unknown error');
  }
}


