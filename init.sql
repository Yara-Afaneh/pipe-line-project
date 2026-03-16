

CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  active TEXT DEFAULT 'true'
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  result JSONB,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, delivered, failed
  attempt INTEGER DEFAULT 1,
  response_status INTEGER,
  error TEXT,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);