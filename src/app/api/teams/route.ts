import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { TeamModel } from '@/models/Team';

const MemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.coerce.date(),
  contact: z.string().min(1, 'Contact number is required'),
});

const CreateTeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  members: z.array(MemberSchema).default([]),
});

function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ success: false, message, details }, { status });
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = CreateTeamSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(400, 'Invalid request body', parsed.error.flatten());
    }

    const team = await TeamModel.create({
      name: parsed.data.name,
      description: parsed.data.description,
      members: parsed.data.members,
      managerApproval: 'Pending',
      directorApproval: 'Pending',
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (error) {
    return jsonError(500, 'Failed to create team', error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '10')));

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      TeamModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TeamModel.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return jsonError(500, 'Failed to fetch teams', error);
  }
}


