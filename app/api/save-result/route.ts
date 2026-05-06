import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { FinancialData, CalculationResult } from '@/types';

export async function POST(req: Request) {
  try {
    // 1. Initialize Supabase INSIDE the function
    // This prevents the "supabaseKey is required" error during the build process
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase Environment Variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Extract the data from the request body
    const body = await req.json();
    const { userData, result }: { userData: FinancialData, result: CalculationResult } = body;

    // 3. Insert the data into the 'leads' table
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
      console.error("Supabase Database Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("API Route Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
