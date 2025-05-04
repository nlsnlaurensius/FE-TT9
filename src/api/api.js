import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://be-tt-9.vercel.app/api';

export const useApiClient = () => {
  const { token, logout } = useAuth();

  const request = async (endpoint, { method = 'GET', data = null, params = null } = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
         console.error('Unauthorized: Logging out');
         logout();
      }

      const result = await response.json();

      if (!response.ok) {
        const errorDetails = result.details || result.message || 'Unknown error';
        console.error(`API Error: ${response.status}`, errorDetails);
        const error = new Error(result.message || 'API request failed');
        error.status = response.status;
        error.details = errorDetails;
        throw error;
      }

      return result.data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const get = (endpoint, params) => request(endpoint, { method: 'GET', params });
  const post = (endpoint, data) => request(endpoint, { method: 'POST', data });
  const put = (endpoint, data) => request(endpoint, { method: 'PUT', data });
  const del = (endpoint, data) => request(endpoint, { method: 'DELETE', data });

  return { get, post, put, del };
};