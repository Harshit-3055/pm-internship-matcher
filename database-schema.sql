-- Database Schema for PM Internship Matching System
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create matches table to store AI-generated matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, internship_id)
);

-- 2. Create applications table to track student applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  application_status VARCHAR(20) DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(student_id, internship_id)
);

-- 3. Create matching_logs table for AI system tracking
CREATE TABLE IF NOT EXISTS matching_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  matching_session_id UUID NOT NULL,
  algorithm_version VARCHAR(10) DEFAULT '1.0',
  total_matches INTEGER DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create student_feedback table for learning
CREATE TABLE IF NOT EXISTS student_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  is_helpful BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_student_id ON matches(student_id);
CREATE INDEX IF NOT EXISTS idx_matches_internship_id ON matches(internship_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);

-- 6. Add RLS policies
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_feedback ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for matches
CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can update their own matches" ON matches
  FOR UPDATE USING (auth.uid() = student_id);

-- 8. Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = student_id);

-- 9. Create RLS policies for matching_logs
CREATE POLICY "Users can view their own matching logs" ON matching_logs
  FOR SELECT USING (auth.uid() = student_id);

-- 10. Create RLS policies for student_feedback
CREATE POLICY "Users can manage their own feedback" ON student_feedback
  FOR ALL USING (auth.uid() = student_id);

-- 11. Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Insert sample internships data (if not exists)
INSERT INTO internships (id, company_name, role, location, sector, skills_required, capacity, created_at)
VALUES 
  (gen_random_uuid(), 'TechCorp India', 'Software Development Intern', 'Bangalore', 'Technology', ARRAY['React', 'JavaScript', 'Node.js', 'MongoDB'], 5, NOW()),
  (gen_random_uuid(), 'DataFlow Analytics', 'Data Science Intern', 'Mumbai', 'Data Science', ARRAY['Python', 'Machine Learning', 'SQL', 'Pandas'], 3, NOW()),
  (gen_random_uuid(), 'GreenEnergy Solutions', 'Sustainability Intern', 'Delhi', 'Sustainability', ARRAY['Research', 'Environmental Science', 'Project Management'], 4, NOW()),
  (gen_random_uuid(), 'FinTech Innovations', 'FinTech Intern', 'Pune', 'FinTech', ARRAY['Java', 'Spring Boot', 'Microservices', 'AWS'], 6, NOW()),
  (gen_random_uuid(), 'HealthTech Solutions', 'Healthcare Technology Intern', 'Chennai', 'Healthcare', ARRAY['React', 'Python', 'Django', 'PostgreSQL'], 3, NOW())
ON CONFLICT (id) DO NOTHING;
