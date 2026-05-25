import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { validateAdminSession } from '@/lib/adminAuthValidator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Validate admin session from headers
        validateAdminSession(request as any);
        
        // Get pagination limit from URL params
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? Math.min(parseInt(limitParam, 10), 200) : 100; // Max 200 records
        
        const adminDb = getAdminDb();
        const [teamsSnap, submissionsSnap] = await Promise.all([
            adminDb.collection("teams").where("archived", "==", false).limit(limit).get(),
            adminDb.collection("submissions").limit(limit * 2).get()
        ]);

        const submissions = submissionsSnap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as any[];

        const teams = teamsSnap.docs.map(doc => {
            const teamId = doc.id;
            const data = doc.data() as any;
            const submission = submissions.find(s => s.id === teamId || s.teamId === teamId);
            
            return {
                id: teamId,
                ...data,
                submissionUrl: submission?.fileUrl || null
            };
        });

        return NextResponse.json(teams);
    } catch (error: any) {
        console.error("Admin Teams + Submission API Error:", error);
        
        // Return 401 for auth errors
        if (error.message?.includes('session') || error.message?.includes('authentication')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
