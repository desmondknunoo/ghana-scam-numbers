-- Create the scam_reports table for user submissions
CREATE TABLE IF NOT EXISTS public.scam_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number text NOT NULL,
    category text NOT NULL CHECK (category IN ('momo', 'phishing', 'impersonation')),
    modus_operandi text NOT NULL,
    reporter_email text,
    additional_info text,
    evidence_urls text[] DEFAULT '{}',
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now(),
    approved_at timestamptz,
    rejected_at timestamptz,
    rejection_reason text,
    approved_entry jsonb,
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scam_reports_status ON public.scam_reports(status);
CREATE INDEX IF NOT EXISTS idx_scam_reports_created_at ON public.scam_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scam_reports_phone ON public.scam_reports(phone_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (submissions only)
CREATE POLICY "Allow public to insert reports" ON public.scam_reports
    FOR INSERT TO anon
    WITH CHECK (true);

-- Admin access policy (you'll need to set this up based on your auth method)
CREATE POLICY "Allow admin to read all reports" ON public.scam_reports
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow admin to update reports" ON public.scam_reports
    FOR UPDATE TO authenticated
    USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_scam_reports_updated_at
    BEFORE UPDATE ON public.scam_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for public statistics (optional)
CREATE OR REPLACE VIEW public.scam_stats AS
SELECT 
    status,
    COUNT(*) as count,
    category,
    DATE_TRUNC('month', created_at) as month
FROM public.scam_reports
GROUP BY status, category, DATE_TRUNC('month', created_at);

-- Grant permissions
GRANT SELECT, INSERT ON public.scam_reports TO anon;
GRANT ALL ON public.scam_reports TO authenticated;
GRANT SELECT ON public.scam_stats TO anon;