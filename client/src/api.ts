import axios from 'axios';
import { Asset, Alert, PriceData, ProbabilityAnalysis } from './types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const assetsApi = {
  getAll: () => api.get<Asset[]>('/assets'),
  getById: (id: number) => api.get<Asset>(`/assets/${id}`),
  create: (data: Partial<Asset>) => api.post<Asset>('/assets', data),
  delete: (id: number) => api.delete(`/assets/${id}`),
  getPrice: (id: number) => api.get<PriceData>(`/assets/${id}/price`),
  getHistory: (id: number, days: number = 30) =>
    api.get<any[]>(`/assets/${id}/history`, { params: { days } }),
  getProbability: (id: number, targetIncrease: number = 0.30) =>
    api.get<ProbabilityAnalysis>(`/assets/${id}/probability`, { params: { targetIncrease } }),
};

export const alertsApi = {
  getAll: (email?: string, active?: boolean) =>
    api.get<Alert[]>('/alerts', { params: { email, active } }),
  getById: (id: number) => api.get<Alert>(`/alerts/${id}`),
  create: (data: Partial<Alert>) => api.post<Alert>('/alerts', data),
  update: (id: number, data: Partial<Alert>) => api.put<Alert>(`/alerts/${id}`, data),
  delete: (id: number) => api.delete(`/alerts/${id}`),
  test: (id: number) => api.post(`/alerts/${id}/test`),
};

export const monitorApi = {
  getStatus: () => api.get('/monitor/status'),
  start: () => api.post('/monitor/start'),
  stop: () => api.post('/monitor/stop'),
  checkAll: () => api.post('/monitor/check'),
  checkAsset: (assetId: number) => api.post(`/monitor/check/${assetId}`),
};

export const probabilityApi = {
  getAll: (targetIncrease: number = 0.30) =>
    api.get<ProbabilityAnalysis[]>('/probability', { params: { targetIncrease } }),
  getByAsset: (assetId: number, targetIncrease: number = 0.30) =>
    api.get<ProbabilityAnalysis>(`/probability/${assetId}`, { params: { targetIncrease } }),
  calculate: (assetId: number, targetIncrease: number = 0.30) =>
    api.post<ProbabilityAnalysis>(`/probability/${assetId}/calculate`, { targetIncrease }),
};

export default api;
