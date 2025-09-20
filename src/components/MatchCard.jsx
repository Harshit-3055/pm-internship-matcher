"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

export default function MatchCard({ match, onApply, isApplied = false }) {
  const [isApplying, setIsApplying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Debug logging
  console.log('MatchCard received match:', match);
  console.log('Match score:', match?.match_score);
  console.log('Match reasons:', match?.match_reasons);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(match);
    } finally {
      setIsApplying(false);
    }
  };

  const getScoreColor = (score) => {
    if (!score && score !== 0) return "text-gray-600 bg-gray-100";
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (!score && score !== 0) return "No Score";
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Low Match";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header with match score */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{match.internship?.role}</h3>
              <p className="text-sm text-gray-600">{match.internship?.company_name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(match.match_score)}`}>
              <Star className="w-4 h-4 mr-1" />
              {match.match_score || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">{getScoreLabel(match.match_score)}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{match.internship?.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>{match.internship?.capacity} spots</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span>{match.internship?.sector}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>Available</span>
          </div>
        </div>

        {/* Match Reasons */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Why this match?
          </h4>
          <div className="space-y-1">
            {(match.match_reasons || []).slice(0, 3).map((reason, index) => (
              <div key={index} className="flex items-start text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
            {(!match.match_reasons || match.match_reasons.length === 0) && (
              <div className="text-sm text-gray-500 italic">No specific reasons available</div>
            )}
          </div>
        </div>

        {/* Skills Match */}
        {match.internship?.skills_required && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1">
              {match.internship.skills_required.slice(0, 4).map((skill, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
              {match.internship.skills_required.length > 4 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{match.internship.skills_required.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Role Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Role:</strong> {match.internship?.role}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isApplied ? (
            <div className="flex-1 flex items-center justify-center py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-colors ${
                isApplying
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Apply Now
                </>
              )}
            </button>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <span className="mr-1">Details</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-1">Sector</h5>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {match.internship?.sector}
                </span>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-1">Company</h5>
                <span className="text-sm text-gray-600">
                  {match.internship?.company_name}
                </span>
              </div>

              {match.internship?.skills_required && match.internship.skills_required.length > 4 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">All Required Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {match.internship.skills_required.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
