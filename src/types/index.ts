export interface Tasks {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  progress_rate: string;
  created_at: string;
  updated_at: string;
  progress_status: string;
  member_count: number;
  member_avatar: string[];
}
