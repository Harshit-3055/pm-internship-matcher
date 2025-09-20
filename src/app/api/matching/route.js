// API endpoint for matching system
import { NextResponse } from 'next/server';
import { matchingEngine } from '@/lib/matchingEngine';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const { studentId, action } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    switch (action) {
      case 'generate_matches':
        console.log('Generating matches for student:', studentId);
        const matches = await matchingEngine.getMatchesForStudent(studentId);
        console.log('Generated matches:', matches);
        return NextResponse.json({ 
          success: true, 
          matches,
          message: `Generated ${matches.length} personalized matches`
        });

      case 'get_matches':
        const existingMatches = await matchingEngine.getStudentMatches(studentId);
        return NextResponse.json({ 
          success: true, 
          matches: existingMatches
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Matching API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process matching request',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const matches = await matchingEngine.getStudentMatches(studentId);
    return NextResponse.json({ 
      success: true, 
      matches 
    });

  } catch (error) {
    console.error('Get matches API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch matches',
      details: error.message 
    }, { status: 500 });
  }
}
