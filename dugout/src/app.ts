import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/ping', (c) => {
  return c.text('ping')
})

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);