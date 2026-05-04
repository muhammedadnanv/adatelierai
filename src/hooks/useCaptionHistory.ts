import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'ad-atelier-session-id';

export interface CaptionVariation {
  caption: string;
  hashtags: string[];
  keywords: string[];
  platform: string;
}

export interface CaptionHistoryEntry {
  id: string;
  session_id: string;
  image_preview: string | null;
  tone: string;
  platform: string;
  variations: CaptionVariation[];
  is_favorite: boolean;
  created_at: string;
}

const getSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

// Trim image preview to keep storage light. Drop if too large.
const sanitizeImagePreview = (preview: string | null): string | null => {
  if (!preview) return null;
  // ~150 KB cap on the data URL
  if (preview.length > 150_000) return null;
  return preview;
};

export const useCaptionHistory = () => {
  const [history, setHistory] = useState<CaptionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('caption_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) {
      setHistory(data as unknown as CaptionHistoryEntry[]);
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveGeneration = useCallback(
    async (params: {
      tone: string;
      platform: string;
      imagePreview: string;
      variations: CaptionVariation[];
    }) => {
      const { error } = await supabase.from('caption_history').insert({
        session_id: sessionId,
        tone: params.tone,
        platform: params.platform,
        image_preview: sanitizeImagePreview(params.imagePreview),
        variations: params.variations as unknown as never,
      });
      if (error) {
        console.error('Save history failed:', error.message);
        return;
      }
      fetchHistory();
    },
    [sessionId, fetchHistory]
  );

  const toggleFavorite = useCallback(
    async (id: string, next: boolean) => {
      // Optimistic
      setHistory((h) => h.map((e) => (e.id === id ? { ...e, is_favorite: next } : e)));
      const { error } = await supabase
        .from('caption_history')
        .update({ is_favorite: next })
        .eq('id', id)
        .eq('session_id', sessionId);
      if (error) {
        console.error('Toggle favorite failed:', error.message);
        fetchHistory();
      }
    },
    [sessionId, fetchHistory]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setHistory((h) => h.filter((e) => e.id !== id));
      const { error } = await supabase
        .from('caption_history')
        .delete()
        .eq('id', id)
        .eq('session_id', sessionId);
      if (error) {
        console.error('Delete history failed:', error.message);
        fetchHistory();
      }
    },
    [sessionId, fetchHistory]
  );

  return { history, loading, saveGeneration, toggleFavorite, deleteEntry, refresh: fetchHistory };
};
