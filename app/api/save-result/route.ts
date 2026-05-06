import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { FinancialData, CalculationResult } from '@/types';

// Initialize the Supabase client using the environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Extract the data from the request body
    const body = await req.json();
    const { userData, result }: { userData: FinancialData, result: CalculationResult } = body;

    // 2. Insert the data into the 'leads' table in Supabase
    const { data, error } = await supabase
      .from('leads')
      .upsert({ 
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        country: userData.country,
        age: userData.age,
        income: userData.income,
        savings: userData.savings,
        spending: userData.spending,
        debt: userData.debt,
        goal: userData.goal,
        score: result.score,
        tier: result.tier
      });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
