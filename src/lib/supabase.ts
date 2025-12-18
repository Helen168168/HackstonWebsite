import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  github_url: string;
  skills: string[];
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  prize: string;
  requirements: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  max_members: number;
  challenge_id: string | null;
  is_recruiting: boolean;
  created_at: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
};

export type Project = {
  id: string;
  team_id: string;
  challenge_id: string | null;
  title: string;
  description: string;
  demo_url: string;
  repo_url: string;
  video_url: string;
  images: string[];
  status: string;
  submitted_at: string | null;
  updated_at: string;
};

export type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar_url: string;
  expertise: string[];
  role: string;
  display_order: number;
  created_at: string;
};
