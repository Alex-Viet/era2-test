import type { LucideIcon } from 'lucide-react';
import { FileText, Image, Music, Video } from 'lucide-react';
import type { GenType } from '@/entities/generation-task';

export const GEN_TYPE_ICONS: Record<GenType, LucideIcon> = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Music,
};

export const GEN_TYPE_LABELS: Record<GenType, string> = {
  text: 'Текст',
  image: 'Изображение',
  video: 'Видео',
  audio: 'Аудио',
};

export const PROMPT_MAX_LENGTH = 120;

export function truncatePrompt(prompt: string, maxLength = PROMPT_MAX_LENGTH): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }

  return `${prompt.slice(0, maxLength).trimEnd()}…`;
}
