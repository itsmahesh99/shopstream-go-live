-- Create live_streams table for tracking streaming sessions
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    room_code VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'active', 'ended', 'error')),
    viewer_count INTEGER DEFAULT 0,
    max_viewers INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_live_streams_host_id ON live_streams(host_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);
CREATE INDEX IF NOT EXISTS idx_live_streams_created_at ON live_streams(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own streams" ON live_streams
    FOR SELECT USING (auth.uid() = host_id);

CREATE POLICY "Users can insert their own streams" ON live_streams
    FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own streams" ON live_streams
    FOR UPDATE USING (auth.uid() = host_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_live_streams_updated_at
    BEFORE UPDATE ON live_streams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
