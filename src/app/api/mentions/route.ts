import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const mentions = await prisma.mention.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, mentions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
