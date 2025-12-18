/*
  # 黑客松平台数据库架构

  ## 新建表

  1. **profiles** - 用户资料表
     - id (uuid, 关联 auth.users)
     - username (text, 唯一)
     - full_name (text)
     - avatar_url (text)
     - bio (text)
     - github_url (text)
     - skills (text[])
     - created_at (timestamptz)
     - updated_at (timestamptz)

  2. **challenges** - 赛题表
     - id (uuid, 主键)
     - title (text)
     - description (text)
     - difficulty (text)
     - prize (text)
     - requirements (text)
     - tags (text[])
     - is_active (boolean)
     - created_at (timestamptz)

  3. **teams** - 团队表
     - id (uuid, 主键)
     - name (text, 唯一)
     - description (text)
     - leader_id (uuid, 关联 profiles)
     - max_members (integer)
     - challenge_id (uuid, 关联 challenges)
     - is_recruiting (boolean)
     - created_at (timestamptz)

  4. **team_members** - 团队成员表
     - id (uuid, 主键)
     - team_id (uuid, 关联 teams)
     - user_id (uuid, 关联 profiles)
     - role (text)
     - joined_at (timestamptz)
     - 唯一约束: (team_id, user_id)

  5. **projects** - 项目作品表
     - id (uuid, 主键)
     - team_id (uuid, 关联 teams)
     - challenge_id (uuid, 关联 challenges)
     - title (text)
     - description (text)
     - demo_url (text)
     - repo_url (text)
     - video_url (text)
     - images (text[])
     - status (text)
     - submitted_at (timestamptz)
     - updated_at (timestamptz)

  6. **mentors** - 导师/评委表
     - id (uuid, 主键)
     - name (text)
     - title (text)
     - company (text)
     - bio (text)
     - avatar_url (text)
     - expertise (text[])
     - role (text) - 'mentor' 或 'judge'
     - display_order (integer)
     - created_at (timestamptz)

  ## 安全策略

  - 为所有表启用 RLS
  - 用户只能查看和更新自己的资料
  - 团队领导可以管理自己的团队
  - 团队成员可以查看团队信息
  - 所有人可以查看赛题、项目和导师信息
  - 只有认证用户可以创建团队和提交项目
*/

-- 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  github_url text DEFAULT '',
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 赛题表
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  prize text DEFAULT '',
  requirements text DEFAULT '',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 团队表
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  leader_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  max_members integer DEFAULT 5,
  challenge_id uuid REFERENCES challenges(id) ON DELETE SET NULL,
  is_recruiting boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Team leaders can update their teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = leader_id)
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Team leaders can delete their teams"
  ON teams FOR DELETE
  TO authenticated
  USING (auth.uid() = leader_id);

-- 团队成员表
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team leaders can manage members"
  ON team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.leader_id = auth.uid()
    )
  );

CREATE POLICY "Users can join teams"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 项目作品表
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  demo_url text DEFAULT '',
  repo_url text DEFAULT '',
  video_url text DEFAULT '',
  images text[] DEFAULT '{}',
  status text DEFAULT 'draft',
  submitted_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view submitted projects"
  ON projects FOR SELECT
  TO authenticated
  USING (status = 'submitted');

CREATE POLICY "Team members can view their projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team leaders can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = projects.team_id
      AND teams.leader_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = projects.team_id
      AND teams.leader_id = auth.uid()
    )
  );

-- 导师/评委表
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  expertise text[] DEFAULT '{}',
  role text DEFAULT 'mentor',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentors"
  ON mentors FOR SELECT
  TO authenticated
  USING (true);