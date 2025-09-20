// API endpoint for internship applications
import { NextResponse } from 'next/server';
import { matchingEngine } from '@/lib/matchingEngine';

export async function POST(request) {
  try {
    const { studentId, internshipId, matchId } = await request.json();

    if (!studentId || !internshipId || !matchId) {
      return NextResponse.json({ 
        error: 'Student ID, Internship ID, and Match ID are required' 
      }, { status: 400 });
    }

    await matchingEngine.applyForInternship(studentId, internshipId, matchId);

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully!' 
    });

  } catch (error) {
    console.error('Application API error:', error);
    return NextResponse.json({ 
      error: 'Failed to submit application',
      details: error.message 
    }, { status: 500 });
  }
}
