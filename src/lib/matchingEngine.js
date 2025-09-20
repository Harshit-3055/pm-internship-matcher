// AI/ML Matching Engine for PM Internship Scheme
import { supabase } from './supabaseClient';

class MatchingEngine {
  constructor() {
    this.weights = {
      skills: 0.35,
      location: 0.20,
      sector: 0.15,
      academic: 0.10,
      affirmative: 0.10,
      availability: 0.10
    };
  }

  // Main matching function
  async getMatchesForStudent(studentId) {
    try {
      console.log(`Starting AI matching for student: ${studentId}`);
      
      // Get student profile
      const student = await this.getStudentProfile(studentId);
      console.log('Student profile:', student);
      if (!student) {
        throw new Error('Student profile not found');
      }

      // Get all available internships
      const internships = await this.getAvailableInternships();
      console.log('Available internships:', internships);
      
      // Calculate matches
      const matches = await this.calculateMatches(student, internships);
      console.log('Calculated matches:', matches);
      
      // Sort by match score
      const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Save matches to database and get the saved matches
      const savedMatches = await this.saveMatches(studentId, sortedMatches);
      
      console.log(`Generated ${sortedMatches.length} matches for student ${studentId}`);
      return savedMatches;
      
    } catch (error) {
      console.error('Error in matching engine:', error);
      throw error;
    }
  }

  // Get student profile with enhanced data
  async getStudentProfile(studentId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error) throw error;
    return profile;
  }

  // Get available internships
  async getAvailableInternships() {
    const { data: internships, error } = await supabase
      .from('internships')
      .select('id, company_name, role, skills_required, location, sector, capacity, created_at')
      .gt('capacity', 0); // Only internships with available spots

    if (error) throw error;
    return internships || [];
  }

  // Calculate matches for a student
  async calculateMatches(student, internships) {
    const matches = [];

    for (const internship of internships) {
      const matchScore = await this.calculateMatchScore(student, internship);
      const matchReasons = this.generateMatchReasons(student, internship, matchScore);
      
      // console.log(`Match score for ${internship.company_name} - ${internship.role}:`, matchScore);
      // console.log(`Match reasons:`, matchReasons);
      
      if (matchScore > 0.4) { // 40% threshold for quality matches
        matches.push({
          internship,
          matchScore: Math.round(matchScore * 100), // Convert to percentage (0-100)
          matchReasons,
          status: 'pending'
        });
        // console.log(`Added match for ${internship.company_name}`);
      } else {
        // console.log(`Skipped ${internship.company_name} - score too low: ${matchScore}`);
      }
    }

    // console.log(`Total matches found: ${matches.length}`);
    return matches;
  }

  // Calculate comprehensive match score
  async calculateMatchScore(student, internship) {
    let totalScore = 0;

    // 1. Skills Matching (35%)
    const skillsScore = this.calculateSkillsScore(student, internship);
    totalScore += skillsScore * this.weights.skills;
    // console.log(`Skills score: ${skillsScore} (weight: ${this.weights.skills})`);

    // 2. Location Preference (20%)
    const locationScore = this.calculateLocationScore(student, internship);
    totalScore += locationScore * this.weights.location;
    // console.log(`Location score: ${locationScore} (weight: ${this.weights.location})`);

    // 3. Sector Interest (15%)
    const sectorScore = this.calculateSectorScore(student, internship);
    totalScore += sectorScore * this.weights.sector;
    // console.log(`Sector score: ${sectorScore} (weight: ${this.weights.sector})`);

    // 4. Academic Performance (10%)
    const academicScore = this.calculateAcademicScore(student, internship);
    totalScore += academicScore * this.weights.academic;
    // console.log(`Academic score: ${academicScore} (weight: ${this.weights.academic})`);

    // 5. Affirmative Action (10%)
    const affirmativeScore = this.calculateAffirmativeScore(student, internship);
    totalScore += affirmativeScore * this.weights.affirmative;
    // console.log(`Affirmative score: ${affirmativeScore} (weight: ${this.weights.affirmative})`);

    // 6. Availability Match (10%)
    const availabilityScore = this.calculateAvailabilityScore(student, internship);
    totalScore += availabilityScore * this.weights.availability;
    // console.log(`Availability score: ${availabilityScore} (weight: ${this.weights.availability})`);

    // console.log(`Total weighted score: ${totalScore}`);
    return Math.min(totalScore, 1.0); // Cap at 100%
  }

  // Skills matching using semantic similarity
  calculateSkillsScore(student, internship) {
    const studentSkills = [
      ...(student.technical_skills || []),
      ...(student.soft_skills || [])
    ];
    const requiredSkills = internship.skills_required || [];

    console.log(`Student skills:`, studentSkills);
    console.log(`Required skills:`, requiredSkills);

    if (requiredSkills.length === 0) return 0.5; // Neutral score if no skills specified

    let matchedSkills = 0;
    let totalSkills = requiredSkills.length;

    for (const requiredSkill of requiredSkills) {
      const normalizedRequired = requiredSkill.toLowerCase().trim();
      
      // Check for exact matches
      const exactMatch = studentSkills.some(skill => 
        skill.toLowerCase().trim() === normalizedRequired
      );
      
      if (exactMatch) {
        matchedSkills += 1;
        console.log(`Exact match found for: ${requiredSkill}`);
        continue;
      }

      // Check for partial matches (semantic similarity)
      const partialMatch = studentSkills.some(skill => {
        const normalizedStudent = skill.toLowerCase().trim();
        const similarity = this.calculateStringSimilarity(normalizedStudent, normalizedRequired);
        console.log(`Similarity between "${skill}" and "${requiredSkill}": ${similarity}`);
        return similarity > 0.6;
      });

      if (partialMatch) {
        matchedSkills += 0.7; // Partial match gets 70% credit
        console.log(`Partial match found for: ${requiredSkill}`);
      } else {
        console.log(`No match found for: ${requiredSkill}`);
      }
    }

    const finalScore = matchedSkills / totalSkills;
    console.log(`Skills match score: ${matchedSkills}/${totalSkills} = ${finalScore}`);
    return finalScore;
  }

  // Location preference matching
  calculateLocationScore(student, internship) {
    const studentLocations = student.location_preferences || [];
    const internshipLocation = internship.location?.toLowerCase() || '';

    console.log(`Student locations:`, studentLocations);
    console.log(`Internship location:`, internshipLocation);

    if (studentLocations.length === 0) return 0.5; // Neutral if no preferences

    // Check for exact location matches
    const exactMatch = studentLocations.some(loc => 
      loc.toLowerCase().trim() === internshipLocation
    );

    if (exactMatch) {
      console.log(`Exact location match found: ${internshipLocation}`);
      return 1.0;
    }

    // Check for city-level matches
    const cityMatch = studentLocations.some(loc => {
      const normalizedLoc = loc.toLowerCase().trim();
      return internshipLocation.includes(normalizedLoc) || normalizedLoc.includes(internshipLocation);
    });

    if (cityMatch) {
      console.log(`City-level location match found`);
      return 0.8;
    }

    // Check for remote work preference
    if (student.work_type === 'remote' && studentLocations.includes('Remote')) {
      console.log(`Remote work preference match`);
      return 0.9;
    }

    console.log(`No location match found`);
    return 0.3; // Low score for no match
  }

  // Sector interest matching
  calculateSectorScore(student, internship) {
    const studentInterests = student.domain_interests || [];
    const internshipSector = internship.sector?.toLowerCase() || '';

    if (studentInterests.length === 0) return 0.5;

    const sectorMatch = studentInterests.some(interest => {
      const normalizedInterest = interest.toLowerCase().trim();
      return normalizedInterest === internshipSector || 
             this.calculateStringSimilarity(normalizedInterest, internshipSector) > 0.7;
    });

    return sectorMatch ? 1.0 : 0.2;
  }

  // Academic performance scoring
  calculateAcademicScore(student, internship) {
    const cgpa = parseFloat(student.cgpa) || 0;
    
    // More conservative scoring - academic performance should be a factor, not the main factor
    if (cgpa >= 9.0) return 0.8;  // Excellent but not perfect
    if (cgpa >= 8.0) return 0.6;  // Very good
    if (cgpa >= 7.0) return 0.4;  // Good
    if (cgpa >= 6.0) return 0.2;  // Average
    return 0.1;  // Below average
  }

  // Affirmative action scoring
  calculateAffirmativeScore(student, internship) {
    let score = 0.5; // Base score

    // Rural/Urban bonus
    // This would need to be determined from address or other data
    // For demo purposes, we'll use a simple heuristic
    
    // Gender diversity (if specified)
    if (student.gender && student.gender !== 'prefer-not-to-say') {
      score += 0.1; // Small bonus for gender diversity
    }

    // Year of study consideration
    const yearOfStudy = student.year_of_study;
    if (yearOfStudy === '3rd' || yearOfStudy === '4th') {
      score += 0.2; // Higher priority for final year students
    }

    return Math.min(score, 1.0);
  }

  // Availability matching
  calculateAvailabilityScore(student, internship) {
    const studentDuration = student.duration;

    if (!studentDuration) return 0.5;

    // Since internships table doesn't have duration, we'll use a default approach
    // This could be enhanced by adding duration to internships table later
    return 0.8; // Default good score since we can't compare durations
  }

  // Generate human-readable match reasons
  generateMatchReasons(student, internship, matchScore) {
    const reasons = [];

    // Skills match reasons
    const skillsScore = this.calculateSkillsScore(student, internship);
    if (skillsScore > 0.7) {
      const matchedSkills = this.getMatchedSkills(student, internship);
      reasons.push(`Strong skills match: ${matchedSkills.join(', ')}`);
    } else if (skillsScore > 0.4) {
      reasons.push('Partial skills alignment');
    }

    // Location reasons
    const locationScore = this.calculateLocationScore(student, internship);
    if (locationScore > 0.8) {
      reasons.push(`Perfect location match: ${internship.location}`);
    } else if (locationScore > 0.5) {
      reasons.push(`Good location fit: ${internship.location}`);
    }

    // Sector reasons
    const sectorScore = this.calculateSectorScore(student, internship);
    if (sectorScore > 0.8) {
      reasons.push(`Matches your interest in ${internship.sector}`);
    }

    // Academic reasons - only mention if it's a significant factor
    const cgpa = parseFloat(student.cgpa) || 0;
    if (cgpa >= 9.0) {
      reasons.push('Outstanding academic performance (CGPA: ' + cgpa + ')');
    } else if (cgpa >= 8.5) {
      reasons.push('Excellent academic performance (CGPA: ' + cgpa + ')');
    } else if (cgpa >= 7.5) {
      reasons.push('Strong academic performance (CGPA: ' + cgpa + ')');
    }
    // Don't mention academic performance for lower scores to avoid cluttering

    // Duration reasons
    const availabilityScore = this.calculateAvailabilityScore(student, internship);
    if (availabilityScore > 0.8) {
      reasons.push(`Good availability match for your schedule`);
    }

    // Default reason if no specific reasons
    if (reasons.length === 0) {
      reasons.push(`Good overall match (${Math.round(matchScore * 100)}% compatibility)`);
    }

    return reasons;
  }

  // Get matched skills for display
  getMatchedSkills(student, internship) {
    const studentSkills = [
      ...(student.technical_skills || []),
      ...(student.soft_skills || [])
    ];
    const requiredSkills = internship.skills_required || [];

    const matched = [];
    for (const requiredSkill of requiredSkills) {
      const normalizedRequired = requiredSkill.toLowerCase().trim();
      
      const exactMatch = studentSkills.find(skill => 
        skill.toLowerCase().trim() === normalizedRequired
      );
      
      if (exactMatch) {
        matched.push(exactMatch);
      }
    }

    return matched.slice(0, 3); // Return top 3 matches
  }

  // String similarity calculation (Levenshtein distance)
  calculateStringSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  }

  // Save matches to database
  async saveMatches(studentId, matches) {
    try {
      const matchRecords = matches.map(match => ({
        student_id: studentId,
        internship_id: match.internship.id,
        match_score: match.matchScore,
        match_reasons: match.matchReasons,
        status: 'pending'
      }));

      console.log('Saving matches:', matchRecords);

      // Delete existing matches for this student
      const { error: deleteError } = await supabase
        .from('matches')
        .delete()
        .eq('student_id', studentId);

      if (deleteError) {
        console.error('Error deleting existing matches:', deleteError);
        // Don't throw here, just log the error
      }

      // Insert new matches
      const { error: insertError } = await supabase
        .from('matches')
        .insert(matchRecords);

      if (insertError) {
        console.error('Error inserting matches:', insertError);
        throw insertError;
      }

      console.log('Successfully saved matches to database');
      
      // Return the matches with the correct structure for immediate use
      return matches;
    } catch (error) {
      console.error('Error in saveMatches:', error);
      throw error;
    }
  }

  // Get matches for a student
  async getStudentMatches(studentId) {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        internship:internships(id, company_name, role, skills_required, location, sector, capacity, created_at)
      `)
      .eq('student_id', studentId)
      .order('match_score', { ascending: false });

    if (error) throw error;
    
    // Ensure the data structure is consistent with what MatchCard expects
    const formattedMatches = (matches || []).map(match => ({
      id: match.id,
      match_score: match.match_score,
      match_reasons: match.match_reasons || [],
      status: match.status,
      internship: match.internship
    }));
    
    return formattedMatches;
  }

  // Apply for an internship
  async applyForInternship(studentId, internshipId, matchId) {
    const { error } = await supabase
      .from('applications')
      .insert({
        student_id: studentId,
        internship_id: internshipId,
        match_id: matchId,
        application_status: 'submitted'
      });

    if (error) throw error;

    // Update match status
    await supabase
      .from('matches')
      .update({ status: 'applied' })
      .eq('id', matchId);
  }
}

export const matchingEngine = new MatchingEngine();
