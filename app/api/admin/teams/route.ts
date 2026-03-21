
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const [teamsSnap, submissionsSnap] = await Promise.all([
            adminDb.collection("teams").where("archived", "==", false).get(),
            adminDb.collection("submissions").get()
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
