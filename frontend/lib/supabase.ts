import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const createNoopQuery = () => {
  const result = Promise.resolve({ data: [], error: null })
  return new Proxy(
    {},
    {
      get: (_, prop) => {
        if (prop === 'then') return result.then.bind(result)
        if (prop === 'single' || prop === 'maybeSingle' || prop === 'maybeSingleOrNull') {
          return () => Promise.resolve({ data: null, error: null })
        }
        return () => createNoopQuery()
      },
    }
  ) as any
}

const createNoopClient = () => ({
  from: () => createNoopQuery(),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: null }, error: null }),
    }),
  },
  auth: {
    signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
})

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createNoopClient() as ReturnType<typeof createNoopClient>
