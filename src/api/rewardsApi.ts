import axios from 'axios';

const BASE_URL = 'https://staging.helloagain.at/api/v1/clients/5189/bounties/';

export const fetchRewards = async (page = 1, limit = 10) => {
  console.log(`Fetching rewards: page=${page}, limit=${limit}`);
  const response = await axios.get(`${BASE_URL}?limit=${limit}&page=${page}`);
  return response.data;
};
