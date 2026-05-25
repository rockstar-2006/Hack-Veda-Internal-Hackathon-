
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { validateAdminSession } from '@/lib/adminAuthValidator';

export async function POST(request: Request) {
    try {
        // Validate admin session from headers
        validateAdminSession(request as any);
        
        const { teamId, status } = await request.json();
        
        if (!teamId) {
            return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
        }

        const adminDb = getAdminDb();
        await adminDb.collection("teams").doc(teamId).update({
            shortlisted: status
        });

        return NextResponse.json({ success: true, teamId, status });
    } catch (error: any) {
        console.error("Shortlist API Error:", error);
        
        // Return 401 for auth errors
        if (error.message?.includes('session') || error.message?.includes('authentication')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
