export const getTrails = async () => {
  try {
    const response = await fetch('http://10.217.251.90:3000/sentiers');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched trails:', data);
    return data;
  } catch (error) {
    console.error('Error fetching trails:', error);
    return [];
  }
};