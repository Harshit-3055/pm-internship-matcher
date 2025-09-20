# 🔍 Debug Guide - AI Matching System

## 🚨 **Issue: Matches Not Showing**

You're seeing "AI has generated new personalized matches for you!" but no matches are displayed. Let's debug this step by step.

## 🔧 **Step 1: Check Database Tables**

First, run the simple database setup:

1. **Go to Supabase SQL Editor**
2. **Copy and paste the contents of `simple-database-setup.sql`**
3. **Click "Run"**

This will create the essential tables and sample data.

## 🔍 **Step 2: Check Browser Console**

1. **Open your browser's Developer Tools** (F12)
2. **Go to the Console tab**
3. **Click "Generate New Matches"**
4. **Look for error messages or logs**

You should see logs like:
- `Generating matches for user: [user-id]`
- `Starting AI matching for student: [user-id]`
- `Student profile: [profile-data]`
- `Available internships: [internships-data]`
- `Calculated matches: [matches-data]`

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Student profile not found"**
**Cause:** No profile data in the `profiles` table
**Solution:** Complete your profile first

### **Issue 2: "No internships found"**
**Cause:** No data in the `internships` table
**Solution:** Run the `simple-database-setup.sql` script

### **Issue 3: "Matches table doesn't exist"**
**Cause:** Database schema not set up
**Solution:** Run the `simple-database-setup.sql` script

### **Issue 4: "Permission denied"**
**Cause:** RLS policies not set up correctly
**Solution:** Run the `simple-database-setup.sql` script

## 🔧 **Step 3: Manual Database Check**

Run this SQL in Supabase to check your data:

```sql
-- Check if internships exist
SELECT COUNT(*) as internship_count FROM internships;

-- Check if profiles exist
SELECT COUNT(*) as profile_count FROM profiles;

-- Check if matches table exists
SELECT COUNT(*) as matches_count FROM matches;
```

## 🔧 **Step 4: Test API Endpoint**

You can test the API directly:

1. **Open browser console**
2. **Run this code:**

```javascript
fetch('/api/matching', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentId: 'YOUR_USER_ID_HERE',
    action: 'generate_matches'
  })
})
.then(r => r.json())
.then(console.log);
```

## 🔧 **Step 5: Check Profile Data**

Make sure your profile has the required fields:

1. **Go to your profile page**
2. **Complete all sections:**
   - Personal Information
   - Education Details
   - Skills & Interests
   - Preferences
3. **Save the profile**

## 🔧 **Step 6: Verify Database Schema**

Check if your tables have the correct structure:

```sql
-- Check internships table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'internships';

-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check matches table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'matches';
```

## 🚀 **Quick Fix**

If nothing else works, try this:

1. **Run the simple database setup**
2. **Complete your profile with sample data**
3. **Try generating matches again**

## 📞 **Still Having Issues?**

If you're still having problems:

1. **Check the browser console for specific error messages**
2. **Verify that all database tables exist**
3. **Make sure your profile is complete**
4. **Check that the API endpoints are working**

The debugging logs I added will help identify exactly where the issue is occurring.
