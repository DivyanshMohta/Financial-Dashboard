import { api } from '../api';

export const fetchAnalytics = async () => {
  const res = await api.get('/transactions/analytics');
  return res.data;
};
