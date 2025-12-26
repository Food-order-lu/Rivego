
import { NextRequest, NextResponse } from 'next/server';
import { docuSeal } from '@/lib/docuseal';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { templateId, email, name } = body;

        // Basic validation
        if (!templateId || !email) {
            return NextResponse.json(
                { error: 'Missing required fields: templateId, email' },
                { status: 400 }
            );
        }

        // Call DocuSeal wrapper
        const submission = await docuSeal.initSigningSession(templateId, email, name);

        return NextResponse.json({
            success: true,
            slug: submission[0].slug, // Assuming array response from createSubmission submitters
            submission_id: submission[0].id
        });
    } catch (error: any) {
        console.error('DocuSeal Init API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
