const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'app/api/profiles/route.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Find and replace the specific problematic section
const oldCode = `    const { data: profile, error } = await supabase
      .from('profiles')
      .(supabase.from("profiles") as any).update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()`

const newCode = `    const { data: profile, error } = await (supabase.from('profiles') as any)
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()`

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode)
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('Syntax error fixed successfully')
} else {
  console.log('Could not find the exact problematic code snippet')
  // Check if the problematic line exists
  if (content.includes('.(supabase.from("profiles") as any).update')) {
    console.log('Found the problematic line, attempting alternative fix')
    content = content.replace(
      '.(supabase.from("profiles") as any).update',
      "(supabase.from('profiles') as any).update"
    )
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('Alternative fix applied successfully')
  }
}
