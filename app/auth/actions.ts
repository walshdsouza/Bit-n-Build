'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isSupabaseConfigured } from '@/utils/supabase/config'

const ACCOUNT_UNAVAILABLE = 'Accounts are not configured on this deployment. You can continue to the dashboard or try the demo without signing in.'

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: ACCOUNT_UNAVAILABLE }
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
  } catch {
    return { error: 'The account service could not be reached. Please try again later.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: ACCOUNT_UNAVAILABLE }
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      }
    })
    if (error) return { error: error.message }
    if (!data.session) return { success: 'Check your email to confirm your account, then sign in.' }
  } catch {
    return { error: 'The account service could not be reached. Please try again later.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
