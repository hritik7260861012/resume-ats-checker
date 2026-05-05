/**
 * Calculate ATS score by comparing resume text with job description
 * @param {string} resumeText - The extracted text from the resume
 * @param {string} jobDescription - The job description text
 * @returns {Object} - Score, matched keywords, and missing keywords
 */
const calculateScore = (resumeText, jobDescription) => {
  if (!resumeText || !jobDescription) {
    throw new Error('Both resume text and job description are required');
  }

  // Normalize texts
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJobDesc = jobDescription.toLowerCase();

  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);

  // Check for matched and missing keywords
  const matchedKeywords = [];
  const missingKeywords = [];

  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    // Use word boundary regex for more accurate matching
    const regex = new RegExp(`\\b${escapeRegex(keywordLower)}\\b`, 'i');
    
    if (regex.test(normalizedResume)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate score based on keyword match percentage
  let score = 0;
  if (keywords.length > 0) {
    score = Math.round((matchedKeywords.length / keywords.length) * 100);
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    matchedKeywords,
    missingKeywords
  };
};

/**
 * Extract important keywords from job description
 * @param {string} text - The job description text
 * @returns {string[]} - Array of unique keywords
 */
const extractKeywords = (text) => {
  // Common stop words to exclude
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
    'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
    'then', 'once', 'if', 'as', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under',
    'again', 'further', 'while', 'about', 'against', 'am', 'it', 's',
    't', 'd', 'll', 've', 're', 'm', 'ability', 'experience', 'skills',
    'required', 'preferred', 'including', 'responsibilities', 'qualifications'
  ]);

  // Common tech/industry terms that should be kept
  const techTerms = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node', 'nodejs', 'express', 'django',
    'flask', 'spring', 'mongodb', 'mysql', 'postgresql', 'sql', 'nosql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'ci/cd',
    'devops', 'agile', 'scrum', 'rest', 'api', 'graphql', 'html', 'css',
    'typescript', 'nextjs', 'nuxt', 'redux', 'mobx', 'sass', 'less',
    'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'mocha',
    'cypress', 'selenium', 'terraform', 'ansible', 'jenkins', 'github',
    'gitlab', 'bitbucket', 'linux', 'windows', 'macos', 'bash', 'shell',
    'microservices', 'serverless', 'lambda', 'cloud', 'ml', 'ai',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'data science', 'data analysis', 'sql', 'etl', 'spark', 'hadoop',
    'kafka', 'redis', 'elasticsearch', 'nginx', 'apache', 'tomcat',
    'flutter', 'react native', 'swift', 'kotlin', 'android', 'ios',
    'figma', 'sketch', 'adobe', 'ui', 'ux', 'frontend', 'backend',
    'fullstack', 'full stack', 'web', 'mobile', 'desktop', 'security',
    'testing', 'qa', 'automation', 'manual', 'performance', 'scalability',
    'architecture', 'design patterns', 'oop', 'functional', 'oop',
    'mvc', 'mvvm', 'mvp', 'clean code', 'tdd', 'bdd', 'ddd',
    'communication', 'leadership', 'team', 'collaboration', 'problem solving',
    'analytical', 'critical thinking', 'time management', 'adaptability'
  ];

  // Normalize and tokenize the text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // Extract multi-word tech terms first
  const keywords = new Set();
  const textLower = text.toLowerCase();

  // Check for multi-word tech terms
  techTerms.forEach(term => {
    if (term.includes(' ') && textLower.includes(term)) {
      keywords.add(term);
    }
  });

  // Extract single words
  words.forEach(word => {
    // Keep if it's a tech term or meets criteria
    if (techTerms.includes(word) && !stopWords.has(word)) {
      keywords.add(word);
    } else if (
      word.length >= 4 && 
      !stopWords.has(word) && 
      !/^\d+$/.test(word)
    ) {
      // Check if word appears multiple times (indicates importance)
      const occurrences = words.filter(w => w === word).length;
      if (occurrences >= 2) {
        keywords.add(word);
      }
    }
  });

  // Also extract phrases in quotes or specific patterns
  const phrasePatterns = [
    /"([^"]+)"/g,
    // Match common job requirement patterns
    /\b(\w+(?:\s+\w+){1,3})\s+(?:experience|skills|knowledge|proficiency|expertise)\b/gi
  ];

  phrasePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const phrase = match[1] || match[0];
      if (phrase && phrase.length > 3) {
        keywords.add(phrase.trim().toLowerCase());
      }
    }
  });

  return Array.from(keywords).filter(k => k.length > 0);
};

/**
 * Escape special regex characters in a string
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = calculateScore;