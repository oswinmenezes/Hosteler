import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://aaswsxxbjfrgdpzdricm.supabase.co'
const supabaseKey = "sb_publishable_ifQeJx97Zfrw7dUnbkqtIQ_xv_LIS1h"
export const supabase = createClient(supabaseUrl, supabaseKey)