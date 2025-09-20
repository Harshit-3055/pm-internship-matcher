"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getSessionSafely, signOutSafely, handleAuthError } from "@/lib/authUtils";
import { useRouter } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import { 
  User, 
  GraduationCap, 
  Code, 
  MapPin, 
  FileText, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  Search,
  Filter,
  Building2,
  Calendar,
  Users,
  Briefcase
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [checkTimeout, setCheckTimeout] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [myMatches, setMyMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchGenerationStatus, setMatchGenerationStatus] = useState(null);
  const [matchRenderKey, setMatchRenderKey] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    
    // Education
    highestQualification: "",
    currentDegree: "",
    yearOfStudy: "",
    university: "",
    cgpa: "",
    
    // Skills
    technicalSkills: [],
    softSkills: [],
    domainInterests: [],
    
    // Preferences
    locationPreferences: [],
    workType: "",
    stipendExpectation: "",
    duration: "",
    
    // Documents
    resume: null,
    certificates: [],
    idProof: null
  });
  
  const [technicalSkillInput, setTechnicalSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [domainSkillInput, setDomainSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  
  const steps = [
    { id: 0, title: "Welcome", icon: Sparkles },
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Education", icon: GraduationCap },
    { id: 3, title: "Skills", icon: Code },
    { id: 4, title: "Preferences", icon: MapPin },
    { id: 5, title: "Documents", icon: FileText }
  ];

  // Load internships from Supabase
  const loadInternships = async () => {
    setLoadingInternships(true);
    try {
      const { data, error } = await supabase
        .from("internships")
        .select("id, company_name, role, skills_required, location, sector, capacity, created_at")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setInternships(data || []);
      setFilteredInternships(data || []);
    } catch (error) {
      console.error("Error loading internships:", error);
      setMessage("Error loading internships: " + error.message);
    } finally {
      setLoadingInternships(false);
    }
  };

  // Load my matches
  const loadMyMatches = async () => {
    if (!user) return;
    
    setLoadingMatches(true);
    try {
      const response = await fetch(`/api/matching?studentId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match the expected structure
        const newMatches = (data.matches || []).map(match => ({
          id: match.id || `match-${Date.now()}-${Math.random()}`,
          match_score: match.match_score || 0,
          match_reasons: match.match_reasons || [],
          status: match.status || 'pending',
          internship: match.internship
        }));
        
        console.log('Loading existing matches:', newMatches);
        console.log('Sample existing match structure:', newMatches[0]);
        setMyMatches(newMatches);
        console.log(`Loaded ${newMatches.length} existing matches`);
      } else {
        console.error("Error loading matches:", data.error);
        setMyMatches([]);
      }
    } catch (error) {
      console.error("Error loading matches:", error);
      setMyMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Generate new matches using AI
  const generateMatches = async () => {
    if (!user) return;
    
    setMatchGenerationStatus("generating");
    setMessage(""); // Clear any previous messages
    
    try {
      console.log('Generating matches for user:', user.id);
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.id,
          action: 'generate_matches'
        })
      });
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.success) {
        // Transform the data to match the expected structure
        const newMatches = (data.matches || []).map(match => ({
          id: match.id || `match-${Date.now()}-${Math.random()}`,
          match_score: match.matchScore || match.match_score || 0,
          match_reasons: match.matchReasons || match.match_reasons || [],
          status: match.status || 'pending',
          internship: match.internship
        }));
        
        console.log('Setting new matches:', newMatches);
        console.log('Sample match structure:', newMatches[0]);
        setMyMatches(newMatches);
        setMatchRenderKey(prev => prev + 1); // Force re-render
        setMatchGenerationStatus("success");
        setMessage(`Successfully generated ${newMatches.length} personalized matches! 🎉`);
        setTimeout(() => {
          setMatchGenerationStatus(null);
          setMessage("");
        }, 3000);
      } else {
        console.error('API error:', data.error);
        setMessage("Error generating matches: " + data.error);
        setMatchGenerationStatus("error");
        setTimeout(() => {
          setMatchGenerationStatus(null);
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error generating matches:", error);
      setMessage("Error generating matches: " + error.message);
      setMatchGenerationStatus("error");
      setTimeout(() => {
        setMatchGenerationStatus(null);
        setMessage("");
      }, 3000);
    }
  };

  // Apply for an internship
  const applyForInternship = async (match) => {
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.id,
          internshipId: match.internship.id,
          matchId: match.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the match status locally
        setMyMatches(prev => 
          prev.map(m => 
            m.id === match.id 
              ? { ...m, status: 'applied' }
              : m
          )
        );
        setMessage("Application submitted successfully! 🎉");
      } else {
        setMessage("Error submitting application: " + data.error);
      }
    } catch (error) {
      console.error("Error applying for internship:", error);
      setMessage("Error submitting application. Please try again.");
    }
  };

  // Check logged-in user and load existing profile data
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && checking) {
        console.log("Timeout reached, forcing check to complete");
        setCheckTimeout(true);
        setChecking(false);
      }
    }, 5000); // 5 second timeout
    
    const verify = async () => {
      try {
        console.log("Starting authentication check...");
        const user = await getSessionSafely();
        
        if (!isMounted) {
          console.log("Component unmounted, aborting");
          return;
        }
        
        if (!user) {
          console.log("No user found, redirecting to login");
          setChecking(false);
          router.replace("/");
          return;
        }
        
        console.log("User found:", user.email);
        setUser(user);
        setFormData(prev => ({ ...prev, email: user.email }));
        
        // Try to load existing profile data (optional)
        try {
          console.log("Attempting to load profile data...");
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          
          if (profileData && !profileError) {
            console.log("Profile data loaded successfully");
            setFormData({
              fullName: profileData.full_name || "",
              dateOfBirth: profileData.date_of_birth || "",
              gender: profileData.gender || "",
              phone: profileData.phone || "",
              email: profileData.email || user.email,
              highestQualification: profileData.highest_qualification || "",
              currentDegree: profileData.current_degree || "",
              yearOfStudy: profileData.year_of_study || "",
              university: profileData.university || "",
              cgpa: profileData.cgpa || "",
              technicalSkills: profileData.technical_skills || [],
              softSkills: profileData.soft_skills || [],
              domainInterests: profileData.domain_interests || [],
              locationPreferences: profileData.location_preferences || [],
              workType: profileData.work_type || "",
              stipendExpectation: profileData.stipend_expectation || "",
              duration: profileData.duration || "",
              resume: null,
              certificates: [],
              idProof: null
            });
            setProfileCompleted(true);
          } else {
            console.log("No existing profile found or error loading profile:", profileError);
            setProfileCompleted(false);
          }
        } catch (profileError) {
          console.log("Profile loading failed, continuing with fresh form:", profileError);
          setProfileCompleted(false);
        }
        
        console.log("Setting checking to false");
        setChecking(false);
        
      } catch (error) {
        console.error("Unexpected error in verify function:", error);
        if (isMounted) {
          setChecking(false);
          router.replace("/");
        }
      }
    };
    
    verify();
    
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      console.log("Auth state changed:", _event, session ? "session exists" : "no session");
      if (!session) {
        console.log("Session lost, redirecting to home");
        router.replace("/");
      }
    });
    
    return () => {
      console.log("Cleaning up useEffect");
      isMounted = false;
      clearTimeout(timeoutId);
      sub.subscription.unsubscribe();
    };
  }, [router, checking]);

  // Load internships and matches when user is authenticated
  useEffect(() => {
    if (user) {
      loadInternships();
      loadMyMatches();
    }
  }, [user]);

  // Force re-render when matches change
  useEffect(() => {
    console.log('Matches updated:', myMatches.length);
  }, [myMatches]);

  // Filter internships based on search and filters
  useEffect(() => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skills_required.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSector) {
      filtered = filtered.filter(internship => 
        internship.sector === selectedSector
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(internship => 
        internship.location === selectedLocation
      );
    }

    setFilteredInternships(filtered);
  }, [searchTerm, selectedSector, selectedLocation, internships]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const addSkill = (type, inputValue, setInputValue) => {
    if (inputValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], inputValue.trim()]
      }));
      setInputValue("");
    }
  };
  
  const removeSkill = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };
  
  const addLocation = () => {
    if (locationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        locationPreferences: [...prev.locationPreferences, locationInput.trim()]
      }));
      setLocationInput("");
    }
  };
  
  const removeLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      locationPreferences: prev.locationPreferences.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    console.log("Submit button clicked, isEditMode:", isEditMode);
    setLoading(true);
    setMessage("");

    try {
    let resumeUrl = "";

      if (formData.resume) {
      const { data, error } = await supabase.storage
  .from("resumes")
          .upload(`resumes/${user.id}/${formData.resume.name}`, formData.resume, {
    upsert: true
  });

        if (error) throw error;
        resumeUrl = supabase.storage.from("resumes").getPublicUrl(data.path).data.publicUrl;
      }
      
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          highest_qualification: formData.highestQualification,
          current_degree: formData.currentDegree,
          year_of_study: formData.yearOfStudy,
          university: formData.university,
          cgpa: formData.cgpa,
          technical_skills: formData.technicalSkills,
          soft_skills: formData.softSkills,
          domain_interests: formData.domainInterests,
          location_preferences: formData.locationPreferences,
          work_type: formData.workType,
          stipend_expectation: formData.stipendExpectation,
          duration: formData.duration,
        resume_url: resumeUrl,
      });

      if (error) throw error;
      
      // Handle both new profile and edit mode
      setProfileCompleted(true);
      setIsEditMode(false);
      setMessage(isEditMode ? "Profile updated successfully! 🎉" : "Profile completed successfully! 🎉");
      
      // Reset form inputs
      setTechnicalSkillInput("");
      setSoftSkillInput("");
      setDomainSkillInput("");
      setLocationInput("");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Error saving profile: " + error.message);
    } finally {
    setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setCurrentStep(0);
    setMessage("");
  };

  // Get unique sectors and locations for filters
  const sectors = [...new Set(internships.map(i => i.sector).filter(Boolean))];
  const locations = [...new Set(internships.map(i => i.location).filter(Boolean))];

  // Conditional rendering - moved to end to avoid hooks order issues
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-pulse text-gray-600">Checking your session...</div>
          <div className="text-sm text-gray-500">
            If this takes too long, please try refreshing the page
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="text-gray-600">No user session found</div>
          <div className="text-sm text-gray-500">
            Please log in to access your profile
          </div>
          <button
            onClick={() => router.push("/login")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render section navigation
  const renderSectionNavigation = () => (
    <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 p-4 mb-6">
      <div className="flex space-x-1">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeSection === "profile"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => setActiveSection("opportunities")}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeSection === "opportunities"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Opportunities</span>
        </button>
        <button
          onClick={() => setActiveSection("my-internships")}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeSection === "my-internships"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>My Internships</span>
        </button>
      </div>
    </div>
  );

  // Render internship opportunities section
  const renderInternshipOpportunities = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search internships by company, role, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        
        {/* Sector Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredInternships.length} of {internships.length} internships
      </div>

      {/* Internships Grid */}
      {loadingInternships ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-gray-600">Loading internships...</div>
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No internships found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <div key={internship.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{internship.role}</h3>
                    <p className="text-sm text-gray-600">{internship.company_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{internship.capacity} spots</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{internship.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{internship.sector}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.skills_required?.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Apply Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render my internships section with AI matches
  const renderMyInternships = () => (
    <div className="space-y-6">
      {/* Header with AI matching controls */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-purple-600" />
              My AI-Matched Internships
            </h3>
            <p className="text-gray-600 mt-1">
              Personalized matches based on your profile and preferences
            </p>
          </div>
          <button
            onClick={generateMatches}
            disabled={matchGenerationStatus === "generating"}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              matchGenerationStatus === "generating"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
            }`}
          >
            {matchGenerationStatus === "generating" ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </div>
            ) : (
              "🤖 Generate New Matches"
            )}
          </button>
        </div>

        {/* Status messages */}
        {matchGenerationStatus === "success" && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ AI has generated new personalized matches for you!
          </div>
        )}
        
        {matchGenerationStatus === "error" && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ❌ Error generating matches. Please try again.
          </div>
        )}
      </div>

      {/* Matches display */}
      {loadingMatches ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-600">Loading your matches...</div>
        </div>
      ) : myMatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
          <p className="text-gray-600 mb-6">
            Complete your profile and click "Generate New Matches" to get AI-powered recommendations
          </p>
          <button
            onClick={generateMatches}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            🤖 Generate My Matches
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Your Personalized Matches ({myMatches.length})
            </h4>
            <div className="text-sm text-gray-600">
              Sorted by AI match score
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" key={matchRenderKey}>
            {myMatches.map((match, index) => (
              <MatchCard
                key={`${match.id || 'new'}-${match.match_score || 0}-${index}-${matchRenderKey}`}
                match={match}
                onApply={applyForInternship}
                isApplied={match.status === 'applied'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-8">
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Check className="w-16 h-16 text-white animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
          <span className="text-white text-lg">🎉</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">Profile Complete!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your profile has been successfully saved. Our AI is now analyzing your profile 
          to find the perfect internship matches for you.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <span className="text-gray-700">AI analyzes your skills and preferences</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">2</span>
            </div>
            <span className="text-gray-700">Matches you with relevant internships</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">3</span>
            </div>
            <span className="text-gray-700">You&apos;ll receive personalized recommendations</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleEditProfile}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all border-2 border-indigo-600"
        >
          🏠 Go to Homepage
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
  return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {isEditMode ? "Edit Your Profile" : "Welcome to PM InternMatch!"}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isEditMode 
                ? "Update your information to get better matches."
                : "Let's get you matched with the perfect internship opportunity. Our AI will analyze your profile to find the best matches."
              }
            </p>
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
            >
              {isEditMode ? "✏️ Update Profile" : "👉 Let's Get You Matched with the Perfect Internship!"}
            </button>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                  >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email || user?.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Education Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Highest Qualification</label>
                <div className="relative">
                  <select
                    value={formData.highestQualification}
                    onChange={(e) => handleInputChange("highestQualification", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                  >
                  <option value="">Select Qualification</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor&apos;s Degree</option>
                  <option value="master">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Degree</label>
        <input
          type="text"
                  value={formData.currentDegree}
                  onChange={(e) => handleInputChange("currentDegree", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g. B.Tech Computer Science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year of Study</label>
                <div className="relative">
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => handleInputChange("yearOfStudy", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                  >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="graduated">Graduated</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => handleInputChange("cgpa", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="8.5"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">University/College</label>
        <input
          type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g. Indian Institute of Technology Delhi"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Skills & Interests
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Technical Skills</label>
                <div className="mt-2 flex gap-2">
        <input
          type="text"
                    value={technicalSkillInput}
                    onChange={(e) => setTechnicalSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('technicalSkills', technicalSkillInput, setTechnicalSkillInput)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g. React, Python, SQL"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill('technicalSkills', technicalSkillInput, setTechnicalSkillInput)}
                    className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technicalSkills.map((skill, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill('technicalSkills', index)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Soft Skills</label>
                <div className="mt-2 flex gap-2">
        <input
          type="text"
                    value={softSkillInput}
                    onChange={(e) => setSoftSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('softSkills', softSkillInput, setSoftSkillInput)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g. Leadership, Communication"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill('softSkills', softSkillInput, setSoftSkillInput)}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.softSkills.map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill('softSkills', index)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Domain Interests</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={domainSkillInput}
                    onChange={(e) => setDomainSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('domainInterests', domainSkillInput, setDomainSkillInput)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g. FinTech, Healthcare, EdTech"
                  />
        <button
                    type="button"
                    onClick={() => addSkill('domainInterests', domainSkillInput, setDomainSkillInput)}
                    className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.domainInterests.map((interest, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {interest}
                      <button onClick={() => removeSkill('domainInterests', index)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" />
        </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Location Preferences</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g. Delhi, Bangalore, Remote"
                  />
        <button
          type="button"
                    onClick={addLocation}
                    className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.locationPreferences.map((location, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {location}
                      <button onClick={() => removeLocation(index)} className="ml-1 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Work Type</label>
                  <div className="relative">
                    <select
                      value={formData.workType}
                      onChange={(e) => handleInputChange("workType", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                    >
                    <option value="">Select Work Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <div className="relative">
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                    >
                    <option value="">Select Duration</option>
                    <option value="1-month">1 Month</option>
                    <option value="2-months">2 Months</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Stipend Expectation (₹)</label>
                <input
                  type="number"
                  value={formData.stipendExpectation}
                  onChange={(e) => handleInputChange("stipendExpectation", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Documents
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-gray-600 mb-4">PDF format preferred</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleInputChange("resume", e.target.files[0])}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Choose File
                </label>
                {formData.resume && (
                  <p className="mt-2 text-sm text-gray-600">{formData.resume.name}</p>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <div className="text-sm text-white/90">Signed in as</div>
              <div className="text-lg font-semibold">{user?.email}</div>
            </div>
          </div>
          <button
          onClick={async () => {
            await signOutSafely();
              router.replace("/");
          }}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Logout
        </button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Section Navigation */}
        {renderSectionNavigation()}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Only show for profile section */}
          {activeSection === "profile" && (
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 p-4 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {profileCompleted && !isEditMode ? "Profile Status" : "Progress"}
                </h3>
                
                {profileCompleted && !isEditMode ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-700">Profile Complete!</h4>
                      <p className="text-sm text-gray-600 mt-1">All information saved</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completion</span>
                        <span className="font-semibold text-green-600">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleEditProfile}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            currentStep === step.id
                              ? "bg-indigo-100 text-indigo-700"
                              : currentStep > step.id
                              ? "bg-green-100 text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentStep === step.id
                              ? "bg-indigo-600 text-white"
                              : currentStep > step.id
                              ? "bg-green-600 text-white"
                              : "bg-gray-200"
                          }`}>
                            {currentStep > step.id ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <span className="text-sm font-medium">{step.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className={activeSection === "profile" ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 p-8">
              {message && !profileCompleted && (
                <div className={`mb-6 rounded-lg p-4 ${
                  message.includes("Error") 
                    ? "bg-red-50 border border-red-200 text-red-700" 
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}>
                  {message}
                </div>
              )}
              
              {/* Render different sections based on activeSection */}
              {activeSection === "profile" && (
                profileCompleted && !isEditMode ? (
                  renderSuccessState()
                ) : (
                  <>
                    {renderStep()}
                    
                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold ${
                          currentStep === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      
                      {currentStep === steps.length - 1 ? (
                        <button
                          onClick={() => {
                            console.log("Submit button clicked!");
                            console.log("Current form data:", formData);
                            console.log("isEditMode:", isEditMode);
                            handleSubmit();
                          }}
                          disabled={loading}
                          className={`bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Saving..." : isEditMode ? "Update Profile" : "Complete Profile"}
                        </button>
                      ) : (
                        <button
                          onClick={nextStep}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg flex items-center space-x-2"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                )
              )}
              
              {activeSection === "opportunities" && renderInternshipOpportunities()}
              {activeSection === "my-internships" && renderMyInternships()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}