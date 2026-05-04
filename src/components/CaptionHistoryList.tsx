import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Copy, Trash2, Hash, History as HistoryIcon, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCaptionHistory, type CaptionHistoryEntry } from '@/hooks/useCaptionHistory';

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  threads: 'Threads',
};

const HistoryEntryCard = ({
  entry,
  onToggleFavorite,
  onDelete,
}: {
  entry: CaptionHistoryEntry;
  onToggleFavorite: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const { toast } = useToast();
  const [activeIdx, setActiveIdx] = useState(0);
  const v = entry.variations[activeIdx];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-border/50 hover:shadow-elegant transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {entry.image_preview && (
              <img
                src={entry.image_preview}
                alt="Generated caption source"
                loading="lazy"
                className="w-full sm:w-28 h-28 object-cover rounded-lg border border-border/40 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {entry.tone}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {platformLabel[entry.platform] || entry.platform}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleFavorite(entry.id, !entry.is_favorite)}
                    aria-label={entry.is_favorite ? 'Remove favorite' : 'Add favorite'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        entry.is_favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(entry.id)}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {entry.variations.length > 1 && (
                <div className="flex gap-1.5 flex-wrap">
                  {entry.variations.map((_, i) => (
                    <Button
                      key={i}
                      variant={activeIdx === i ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 px-2.5 text-xs"
                      onClick={() => setActiveIdx(i)}
                    >
                      {String.fromCharCode(65 + i)}
                    </Button>
                  ))}
                </div>
              )}

              {v && (
                <div className="space-y-2">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {v.caption}
                  </p>
                  {v.hashtags?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                      <Hash className="w-3 h-3 shrink-0" />
                      <span className="truncate">{v.hashtags.slice(0, 6).join(' ')}</span>
                      {v.hashtags.length > 6 && (
                        <span className="text-[10px]">+{v.hashtags.length - 6}</span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() =>
                        handleCopy(`${v.caption}\n\n${v.hashtags.join(' ')}`)
                      }
                    >
                      <Copy className="w-3 h-3 mr-1.5" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CaptionHistoryList = () => {
  const { history, loading, toggleFavorite, deleteEntry } = useCaptionHistory();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const visible = filter === 'favorites' ? history.filter((h) => h.is_favorite) : history;

  if (loading && history.length === 0) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-base font-medium">No caption history yet</p>
        <p className="text-sm mt-1">Generate your first caption to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({history.length})
        </Button>
        <Button
          variant={filter === 'favorites' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('favorites')}
        >
          <Star className="w-3.5 h-3.5 mr-1.5" />
          Favorites ({history.filter((h) => h.is_favorite).length})
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {visible.map((entry) => (
            <HistoryEntryCard
              key={entry.id}
              entry={entry}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteEntry}
            />
          ))}
        </AnimatePresence>
        {visible.length === 0 && filter === 'favorites' && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No favorites yet. Tap the heart on any entry to save it.
          </p>
        )}
      </div>
    </div>
  );
};

export default CaptionHistoryList;
