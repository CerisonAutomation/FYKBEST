import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createSupabaseClient(req)
    const { prompt, type, context } = await req.json()

    // Get user info from auth header
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    console.info(`AI Assistant request from user: ${user.id} - Type: ${type}`)

    let responseText = ''

    // AI Assistant LOGIC
    if (type === 'auto-reply-suggestion') {
      // In a real prod environment, you'd call OpenAI/Gemini here.
      // For this high-fidelity prototype, we use King's specialized logic.
      const suggestions = [
        "That sounds like a wonderful plan! I'm free this weekend.",
        "I'd love to learn more about your interests. Shall we grab a coffee?",
        'King suggests we check out the new rooftop lounge downtown.',
        "I'm quite busy today, but I can certainly make time for you tomorrow evening.",
      ]
      responseText = suggestions[Math.floor(Math.random() * suggestions.length)]
    } else {
      responseText = `AI Assistant Assistant: I've processed your prompt "${prompt}" and I'm ready to help you find your king.`
    }

    return new Response(
      JSON.stringify({
        text: responseText,
        metadata: { model: 'assistant-v1', latency: '45ms' },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
