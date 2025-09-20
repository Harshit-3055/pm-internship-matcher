// Test script to check database connectivity and table existence
import { supabase } from './src/lib/supabaseClient.js';

async function testDatabase() {
  console.log('Testing database connectivity...');
  
  try {
    // Test 1: Check if internships table exists and has data
    console.log('1. Testing internships table...');
    const { data: internships, error: internshipsError } = await supabase
      .from('internships')
      .select('*')
      .limit(5);
    
    if (internshipsError) {
      console.error('Error accessing internships table:', internshipsError);
    } else {
      console.log('Internships found:', internships.length);
      console.log('Sample internship:', internships[0]);
    }

    // Test 2: Check if profiles table exists
    console.log('2. Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error accessing profiles table:', profilesError);
    } else {
      console.log('Profiles table accessible');
    }

    // Test 3: Check if matches table exists
    console.log('3. Testing matches table...');
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .limit(1);
    
    if (matchesError) {
      console.error('Error accessing matches table:', matchesError);
    } else {
      console.log('Matches table accessible');
    }

    // Test 4: Check if applications table exists
    console.log('4. Testing applications table...');
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('*')
      .limit(1);
    
    if (applicationsError) {
      console.error('Error accessing applications table:', applicationsError);
    } else {
      console.log('Applications table accessible');
    }

  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
