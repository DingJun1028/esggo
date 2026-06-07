-- Create ESG Tasks Table
CREATE TABLE IF NOT EXISTS public.esg_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assignee TEXT,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Review', 'Done')),
    due_date DATE,
    hash_lock TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.esg_tasks ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Enable read access for all authenticated users" ON public.esg_tasks
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Enable insert access for all authenticated users" ON public.esg_tasks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Enable update access for all authenticated users" ON public.esg_tasks
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create a trigger for updated_at
CREATE OR REPLACE FUNCTION update_esg_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_esg_tasks_updated_at
BEFORE UPDATE ON public.esg_tasks
FOR EACH ROW
EXECUTE FUNCTION update_esg_tasks_updated_at();
