import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { FinancialData, CalculationResult } from '@/types';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ CRITICAL: Supabase keys are missing in Vercel Environment Variables");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { userData, result }: { userData: FinancialData, result: CalculationResult } = body;

    // We map the data explicitly to ensure names match the SQL exactly
    const { error } = await supabase
      .from('leads')
      .insert({ 
        first_name: userData.firstName || "",
        last_name: userData.lastName || "",
        email: userData.email,
        country: userData.country || "Unknown",
        age: parseInt(userData.age.toString()) || 0,
        income: parseInt(userData.income.toString()) || 0,
        savings: parseInt(userData.savings.toString()) || 0,
        spending: parseInt(userData.spending.toString()) || 0,
        debt: parseInt(userData.debt.toString()) || 0,
        goal: userData.goal,
        score: result.score,
        tier: result.tier
      });

    if (error) {
      console.error("❌ SUPABASE ERROR:", error.message, "Detail:", error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ UNEXPECTED CRASH:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
