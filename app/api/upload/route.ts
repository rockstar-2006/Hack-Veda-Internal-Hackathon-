
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const teamId = formData.get('teamId') as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        // Prepare the upload to Catbox.moe
        // We do this server-side to avoid CORS issues from browser requests
        const catboxFormData = new FormData();
        catboxFormData.append('reqtype', 'fileupload');
        catboxFormData.append('fileToUpload', file);

        console.log(`Uploading ${file.name} for team ${teamId} to universal free host...`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: catboxFormData,
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`Catbox API error: ${response.statusText}`);
            }

            const fileUrl = await response.text();

            // Catbox returns a direct string URL (e.g. https://files.catbox.moe/xxxxxx.pdf)
            if (fileUrl.startsWith('http')) {
                console.log("Universal Upload Successful:", fileUrl);
                return NextResponse.json({ url: fileUrl });
            } else {
                console.error("Catbox rejected file:", fileUrl);
                return NextResponse.json({ error: "File hosting service rejected the request." }, { status: 500 });
            }
        } catch (fetchError: any) {
            clearTimeout(timeout);
            if (fetchError.name === 'AbortError') {
                console.error("Upload request timed out after 30 seconds");
                return NextResponse.json({ error: "Upload timed out. Please try again." }, { status: 504 });
            }
            throw fetchError;
        }
    } catch (error: any) {
        console.error("Upload API Route Error:", error);
        return NextResponse.json({ error: error.message || "Internal Upload Error." }, { status: 500 });
    }
}
