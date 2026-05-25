
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { validateAdminSession } from '@/lib/adminAuthValidator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Validate admin session from headers
        validateAdminSession(request as any);

        const adminDb = getAdminDb();
        const [teamsSnap, submissionsSnap] = await Promise.all([
            adminDb.collection("teams").where("archived", "==", false).get(),
            adminDb.collection("submissions").get()
        ]);

        const teams = teamsSnap.docs.map(d => d.data());
        
        return NextResponse.json({
            totalTeams: teamsSnap.size,
            shortlisted: teams.filter(t => t.shortlisted).length,
            confirmed: teams.filter(t => t.rsvpStatus === 'confirmed').length,
            submissions: submissionsSnap.size
        });
    } catch (error: any) {
        console.error("Admin Stats API Error:", error);
        
        // Return 401 for auth errors
        if (error.message?.includes('session') || error.message?.includes('authentication')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
