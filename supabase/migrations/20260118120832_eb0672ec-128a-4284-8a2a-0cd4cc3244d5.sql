-- Create a simple table for the latest sensor reading (only one row, overwritten each time)
CREATE TABLE public.sensor_data (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures only one row
  heel_pressure NUMERIC NOT NULL,
  toe_pressure NUMERIC NOT NULL,
  asymmetry_index NUMERIC NOT NULL,
  cop NUMERIC NOT NULL,
  gait_phase TEXT NOT NULL,
  peak_heel_pressure NUMERIC NOT NULL,
  peak_toe_pressure NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no auth required)
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Public read access" ON public.sensor_data FOR SELECT USING (true);

-- Allow anyone to insert/update (for ESP32)
CREATE POLICY "Public write access" ON public.sensor_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.sensor_data FOR UPDATE USING (true);

-- Insert initial placeholder row
INSERT INTO public.sensor_data (id, heel_pressure, toe_pressure, asymmetry_index, cop, gait_phase, peak_heel_pressure, peak_toe_pressure, timestamp)
VALUES (1, 0, 0, 0, 0, 'stance', 0, 0, now());