import { NextRequest, NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/swagger';

export async function GET(_: NextRequest) {
  return NextResponse.json(openApiSpec);
}


