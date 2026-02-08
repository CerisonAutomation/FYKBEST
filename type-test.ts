import type { Database } from './types/supabase'

type ProfilesTable = Database['public']['Tables']['profiles']
type ProfilesUpdate = ProfilesTable['Update']

const testUpdate: ProfilesUpdate = {
  display_name: 'test',
  updated_at: new Date().toISOString(),
}

console.log('ProfilesUpdate type:', typeof testUpdate)
console.log('ProfilesUpdate properties:', Object.keys(testUpdate))
