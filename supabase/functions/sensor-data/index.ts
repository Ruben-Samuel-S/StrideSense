import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SensorPayload {
  heel_pressure: number
  toe_pressure: number
  asymmetry_index: number
  cop: number
  gait_phase: string
  peak_heel_pressure: number
  peak_toe_pressure: number
  timestamp: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // GET - Return latest sensor data
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (error) {
        console.error('GET error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST - Store sensor data from ESP32
    if (req.method === 'POST') {
      const payload: SensorPayload = await req.json()
      console.log('Received sensor data:', payload)

      const { error } = await supabase
        .from('sensor_data')
        .upsert({
          id: 1,
          heel_pressure: payload.heel_pressure,
          toe_pressure: payload.toe_pressure,
          asymmetry_index: payload.asymmetry_index,
          cop: payload.cop,
          gait_phase: payload.gait_phase,
          peak_heel_pressure: payload.peak_heel_pressure,
          peak_toe_pressure: payload.peak_toe_pressure,
          timestamp: payload.timestamp,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('POST error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
