-- Simple Database Setup for PM Internship Matching System
-- Run this first to create the essential tables

-- 1. Create matches table
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

-- 2. Create applications table
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

-- 3. Add RLS policies
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for matches
CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can update their own matches" ON matches
  FOR UPDATE USING (auth.uid() = student_id);

-- 5. Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = student_id);

-- 6. Insert sample internships data
INSERT INTO internships (id, company_name, role, location, sector, skills_required, capacity, created_at)
VALUES 
  (gen_random_uuid(), 'TechCorp India', 'Software Development Intern', 'Bangalore', 'Technology', ARRAY['React', 'JavaScript', 'Node.js', 'MongoDB'], 5, NOW()),
  (gen_random_uuid(), 'DataFlow Analytics', 'Data Science Intern', 'Mumbai', 'Data Science', ARRAY['Python', 'Machine Learning', 'SQL', 'Pandas'], 3, NOW()),
  (gen_random_uuid(), 'GreenEnergy Solutions', 'Sustainability Intern', 'Delhi', 'Sustainability', ARRAY['Research', 'Environmental Science', 'Project Management'], 4, NOW()),
  (gen_random_uuid(), 'FinTech Innovations', 'FinTech Intern', 'Pune', 'FinTech', ARRAY['Java', 'Spring Boot', 'Microservices', 'AWS'], 6, NOW()),
  (gen_random_uuid(), 'HealthTech Solutions', 'Healthcare Technology Intern', 'Chennai', 'Healthcare', ARRAY['React', 'Python', 'Django', 'PostgreSQL'], 3, NOW())
ON CONFLICT (id) DO NOTHING;
