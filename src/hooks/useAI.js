import { useState, useCallback } from 'react';
import api from '../api/client.js';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = useCallback(async (messages) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.chat(messages);
      return result.response;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  const report = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.report(type);
      return result.response;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  const evaluate = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.evaluate(employeeId);
      return result.response;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  const insights = useCallback(async (type, id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.insights(type, id);
      return result.response;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  const risks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.risks();
      return result.response;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  return { chat, report, evaluate, insights, risks, loading, error };
}
