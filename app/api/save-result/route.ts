import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { FinancialData, CalculationResult } from '@/types';

export async function POST(req: Request) {
  console.log("--- API REQUEST RECEIVED ---");
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("Checking environment variables...");
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ ERROR: Missing Supabase Environment Variables");
      return NextResponse.json({ error: "Missing Env Vars" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase client initialized");

    const body = await req.json();
    console.log("✅ Request body received:", JSON.stringify(body).substring(0, 100) + "...");
    
    const { userData, result }: { userData: FinancialData, result: CalculationResult } = body;

    console.log(`Attempting to save lead for email: ${userData.email}`);

    const { data, error } = await supabase
      .from('leads')
      .insert({ // Changed from upsert to insert for cleaner debugging
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
      console.error("❌ SUPABASE DATABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ SUCCESS: Lead saved to Supabase");
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    console.error("❌ UNEXPECTED API CRASH:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
