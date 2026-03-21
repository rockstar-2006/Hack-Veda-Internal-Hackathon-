
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const { teamId, status } = await request.json();
        
        if (!teamId) {
            return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
        }

        await adminDb.collection("teams").doc(teamId).update({
            shortlisted: status
        });

        return NextResponse.json({ success: true, teamId, status });
    } catch (error: any) {
        console.error("Shortlist API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
