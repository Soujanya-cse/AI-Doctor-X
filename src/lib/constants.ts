// Color constants for severity
export const SEVERITY_COLORS = {
  LOW: "#00FF8A", // Success - green
  MEDIUM: "#FFD600", // Warning - yellow
  HIGH: "#FF4A4A", // Danger - red
};

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

// Get severity level based on value (1-10 scale)
export const getSeverityLevel = (value: number): string => {
  if (value <= 3) return SEVERITY_LEVELS.LOW;
  if (value <= 6) return SEVERITY_LEVELS.MEDIUM;
  return SEVERITY_LEVELS.HIGH;
};

// Get severity color based on value (1-10 scale)
export const getSeverityColor = (value: number): string => {
  if (value <= 3) return SEVERITY_COLORS.LOW;
  if (value <= 6) return SEVERITY_COLORS.MEDIUM;
  return SEVERITY_COLORS.HIGH;
};

// Default recommendations for when no specific ones are available
export const DEFAULT_RECOMMENDATIONS = [
  "Maintain a balanced diet",
  "Exercise regularly (at least 30 minutes a day)",
  "Stay hydrated",
  "Get adequate sleep (7-8 hours)",
  "Manage stress through relaxation techniques",
];

// AR QR Code value - in a real app, this would be dynamically generated
export const AR_QR_CODE_VALUE = "https://example.com/ar?model=human-3d";

// Disease progression months
export const PROGRESSION_MONTHS = [0, 1, 2, 3, 4, 5, 6];

// Demo user ID
export const DEMO_USER_ID = 1;
