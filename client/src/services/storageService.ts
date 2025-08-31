/**
 * Storage Service
 * Handles data persistence with localStorage fallback and API integration
 */

// Storage keys
const STORAGE_KEYS = {
  REGISTRATIONS: 'marma_registrations',
};

// Check if we're in production mode with API endpoint
const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Save data to storage (localStorage or API)
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  if (API_URL) {
    try {
      // Save data via API
      const endpoint = getEndpointForKey(key);
      await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Error saving data to API (${key}):`, error);
      throw error;
    }
  } else {
    // Save to localStorage in development
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error);
      throw error;
    }
  }
};

/**
 * Load data from storage (localStorage or API)
 */
export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
  if (API_URL) {
    try {
      // Load data from API
      const endpoint = getEndpointForKey(key);
      const response = await fetch(`${API_URL}/${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error loading data from API (${key}):`, error);
      return defaultValue;
    }
  } else {
    // Load from localStorage in development
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error);
      return defaultValue;
    }
  }
};

/**
 * Update a specific item in a collection
 */
export const updateItem = async <T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): Promise<void> => {
  if (API_URL) {
    try {
      // Update via API
      const endpoint = getEndpointForKey(key);
      await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error(`Error updating item via API (${key}/${id}):`, error);
      throw error;
    }
  } else {
    // Update in localStorage
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const items: T[] = JSON.parse(data);
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        localStorage.setItem(key, JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error(`Error updating item in localStorage (${key}/${id}):`, error);
      throw error;
    }
  }
};

/**
 * Add a new item to a collection
 */
export const addItem = async <T>(key: string, item: T): Promise<T> => {
  if (API_URL) {
    try {
      // Add via API
      const endpoint = getEndpointForKey(key);
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error adding item via API (${key}):`, error);
      throw error;
    }
  } else {
    // Add to localStorage
    try {
      const data = localStorage.getItem(key);
      const items: T[] = data ? JSON.parse(data) : [];
      items.push(item);
      localStorage.setItem(key, JSON.stringify(items));
      return item;
    } catch (error) {
      console.error(`Error adding item to localStorage (${key}):`, error);
      throw error;
    }
  }
};

/**
 * Get endpoint URL for a storage key
 */
const getEndpointForKey = (key: string): string => {
  switch (key) {
    case STORAGE_KEYS.REGISTRATIONS:
      return 'registrations';
    default:
      return key.toLowerCase();
  }
};

export { STORAGE_KEYS };
