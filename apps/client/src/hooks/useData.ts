import { useState, useEffect } from 'react';
import { Transaction, Category, Event, Card } from '../types';
import { fetchMockTransactions, fetchMockCategories, fetchMockEvents, fetchMockCards } from '../services/api';

export const useData = (isAuthenticated: boolean) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [transData, catData, eventData, cardData] = await Promise.all([
            fetchMockTransactions(),
            fetchMockCategories(),
            fetchMockEvents(),
            fetchMockCards(),
          ]);
          setTransactions(transData);
          setCategories(catData);
          setEvents(eventData);
          setCards(cardData);
        } catch (err) {
          setError('Failed to load data. Please try again later.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setTransactions([]);
      setCategories([]);
      setEvents([]);
      setCards([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    transactions,
    categories,
    events,
    cards,
    isLoading,
    error
  };
}; 