import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server'

export async function POST(request) {
    const { password, token } = await request.json();

    if (!token || !password) {
        return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    const supabase = createClient();

    try {

        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token,
            type: 'recovery', 
            password, 
        });

        if (verifyError) {
            return NextResponse.json({ error: verifyError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
