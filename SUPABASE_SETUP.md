# Supabase Cloud Database Integration Guide

This project supports **Supabase Cloud PostgreSQL** alongside the existing database setup.

## 1. Environment Configuration

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://diwqodhpwowkovttoyry.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dK66lACZS06RnGI4iGfuSQ_TQlqGdTA
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://diwqodhpwowkovttoyry.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_dK66lACZS06RnGI4iGfuSQ_TQlqGdTA
```


---

## 2. Usage Examples

### Server Components & Next.js API Routes (Server Side)
```typescript
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('your_table').select('*')
  return <div>{JSON.stringify(data)}</div>
}
```

### Client Components (Browser Side)
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('your_table').select('*')
      if (data) setData(data)
    }
    fetchData()
  }, [])

  return <div>Data count: {data.length}</div>
}
```

### Express Backend (`backend/src/...`)
```javascript
import { supabase } from './config/supabase.js'

export const getSupabaseData = async (req, res) => {
  const { data, error } = await supabase.from('your_table').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
```

---

## 3. Middleware Integration
In Next.js, session token refresh and cookie propagation are handled by `utils/supabase/middleware.ts`.
