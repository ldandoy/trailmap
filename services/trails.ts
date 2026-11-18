import { API_SENTIERS_URL } from './config';

export const getTrails = async () => {
  try {
    const response = await fetch(API_SENTIERS_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching trails:', error);
    return [];
  }
};

export const getTrail = async (id: string) => {
  try {
    const response = await fetch(`${API_SENTIERS_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching trail:', error);
    return null;
  }
};