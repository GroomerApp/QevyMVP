import { serve } from 'inngest/next';
import { inngest } from '@/jobs/client';

// Job functions register here as tracks implement them (B4, B5, B6).
export const { GET, POST, PUT } = serve({ client: inngest, functions: [] });
