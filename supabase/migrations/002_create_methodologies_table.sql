-- Create methodologies table with RLS
CREATE TABLE public.methodologies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.methodologies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for methodologies table
-- Users can only see their own methodologies
CREATE POLICY "Users can view their own methodologies" ON public.methodologies
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own methodologies
CREATE POLICY "Users can insert their own methodologies" ON public.methodologies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own methodologies
CREATE POLICY "Users can update their own methodologies" ON public.methodologies
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own methodologies
CREATE POLICY "Users can delete their own methodologies" ON public.methodologies
    FOR DELETE USING (auth.uid() = user_id);