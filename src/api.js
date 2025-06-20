const axios = require('axios');
require('dotenv').config();

const inflowwApi = axios.create({
  baseURL: 'https://api.infloww.com', // Placeholder; replace with actual Infloww API URL
  headers: {
    Authorization: `Bearer ${process.env.INFLOWW_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function getFanEvents(creatorId) {
  try {
    const response = await inflowwApi.get(`/creators/${creatorId}/events`);
    return response.data; // Expected: [{ fanId, fanName, event, timestamp }]
  } catch (error) {
    console.error('Error fetching fan events:', error.message);
    // Fallback to simulated data for testing
    return [
      { fanId: 'fan1', fanName: 'John', event: 'fan_online', timestamp: Date.now() },
      { fanId: 'fan2', fanName: 'Jane', event: 'new_subscriber', timestamp: Date.now() },
    ];
  }
}

module.exports = { getFanEvents };