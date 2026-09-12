import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vfjtsylqdwejvuuknrcq.supabase.co',
  'sb_publishable_pNmgM_5R_qU4RudePnZnBA_zR-tx75M'
);

async function test() {
  console.log("Checking users...");
  const { data: users, error: userError } = await supabase.from('users').select('*').limit(5);
  console.log("Users:", users);
  if (userError) console.error("User Error:", userError);
  
  if (users && users.length > 0) {
    const user = users[0];
    console.log("Testing insert for user:", user.id);
    const { data: project, error: insertError } = await supabase.from('projects').insert({
      user_id: user.id,
      title: `Test YouTube Insert`,
      source_type: 'youtube',
      source_url: 'https://youtu.be/3sxMkiP-tIM',
      source_duration: 100.0,
      status: 'ready'
    }).select().single();
    
    console.log("Project:", project);
    console.log("Insert Error:", insertError);
  } else {
    console.log("No users found in public.users table. This means the trigger is missing or no users exist.");
  }
}

test();
