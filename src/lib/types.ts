
export type HistoryItem = {
  id: string;
  topic: string;
  number: number;
  prompts: string[];
  createdAt: string;
  userId: string;
  unique?: boolean;
};
