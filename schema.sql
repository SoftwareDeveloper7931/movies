-- Public Domain Movies Database Schema
-- Ready for Supabase, Vercel Postgres, or standard PostgreSQL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Films Table
CREATE TABLE IF NOT EXISTS films (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    year INTEGER,
    description TEXT,
    runtime TEXT,
    license_url TEXT NOT NULL,
    license_name TEXT NOT NULL DEFAULT 'Public Domain Mark 1.0',
    license_type TEXT NOT NULL DEFAULT 'PD',
    creator TEXT,
    ia_identifier TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    backdrop TEXT,
    rights_checked BOOLEAN NOT NULL DEFAULT true,
    genres TEXT[] DEFAULT '{}',
    director TEXT,
    featured BOOLEAN DEFAULT false,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DMCA Takedown Notices Table
CREATE TABLE IF NOT EXISTS dmca_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    work_title TEXT NOT NULL,
    film_identifier TEXT NOT NULL,
    claimant_name TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    infringement_details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'investigating', 'removed', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_films_rights_checked ON films (rights_checked);
CREATE INDEX IF NOT EXISTS idx_films_ia_identifier ON films (ia_identifier);
CREATE INDEX IF NOT EXISTS idx_films_year ON films (year);
CREATE INDEX IF NOT EXISTS idx_films_featured ON films (featured);
CREATE INDEX IF NOT EXISTS idx_films_created_at ON films (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_films_downloads ON films (downloads DESC);
CREATE INDEX IF NOT EXISTS idx_films_genres ON films USING GIN (genres);

-- Row Level Security (RLS)
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmca_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verified films ONLY
CREATE POLICY "Allow public read access to verified films"
    ON films FOR SELECT
    USING (rights_checked = true);

-- Allow service role full access for sync & admin
CREATE POLICY "Allow service role full access on films"
    ON films FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow public to submit DMCA takedown requests
CREATE POLICY "Allow public insert to dmca_requests"
    ON dmca_requests FOR INSERT
    WITH CHECK (true);

-- Allow service role to view & manage DMCA takedowns
CREATE POLICY "Allow service role full access on dmca_requests"
    ON dmca_requests FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger for auto updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_films_updated_at
BEFORE UPDATE ON films
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
