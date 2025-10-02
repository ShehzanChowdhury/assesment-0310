import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { TeamModel, APPROVAL_STATES } from '@/models/Team';

const ApproveSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Not Approved']),
});

function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ success: false, message, details }, { status });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return jsonError(400, 'Invalid team id');

    const parsed = ApproveSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError(400, 'Invalid request body', parsed.error.flatten());

    const updated = await TeamModel.findByIdAndUpdate(
      id,
      { $set: { managerApproval: parsed.data.status } },
      { new: true }
    );
    if (!updated) return jsonError(404, 'Team not found');
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return jsonError(500, 'Failed to update manager approval', error?.message);
  }
}


