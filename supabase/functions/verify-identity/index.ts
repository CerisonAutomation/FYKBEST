import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createSupabaseClient(req)
    const { documentType, documentNumber } = await req.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    console.info(`Verifying identity for user: ${user.id} - Type: ${documentType}`)

    // IDENTITY VERIFICATION LOGIC (Simulated)
    // In production, you would integrate with Persona, Onfido, or Jumio.
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing

    const isSuccess = documentNumber.length >= 5 // Simple heuristic for demo

    if (isSuccess) {
      // Update profile verification status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_status: 'verified',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ status: 'verified', message: 'Identity successfully verified.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    return new Response(
      JSON.stringify({
        status: 'rejected',
        message: 'Verification failed. Please check document details.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
