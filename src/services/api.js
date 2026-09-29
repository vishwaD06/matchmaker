const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }
    
    return response.json();
  }

  // Auth endpoints
  async signup(email, password, fullName) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username: email, password }),
    });
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Interview endpoints
  async startInterview() {
    return this.request('/interview/start', {
      method: 'POST',
    });
  }

  async submitInterviewResponse(sessionId, message) {
    return this.request('/interview/respond', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  }

  async getInterviewSession(sessionId) {
    return this.request(`/interview/session/${sessionId}`);
  }

  // Profile endpoints
  async createProfile(traits, interviewResponses) {
    return this.request('/profile/create', {
      method: 'POST',
      body: JSON.stringify({ traits, interview_responses: interviewResponses }),
    });
  }

  async getMyProfile() {
    return this.request('/profile/me');
  }

  async updateMyProfile(updates) {
    return this.request('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async completeMyProfile() {
    return this.request('/profile/complete', {
      method: 'POST',
    });
  }

  // Matching endpoints
  async findMatch() {
    return this.request('/matching/find', {
      method: 'POST',
    });
  }

  async getPendingMatch() {
    return this.request('/matching/pending');
  }

  async getMyMatches() {
    return this.request('/matching/my-matches');
  }

  async respondToMatch(matchId, response) {
    return this.request('/matching/respond', {
      method: 'POST',
      body: JSON.stringify({ match_id: matchId, response }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
