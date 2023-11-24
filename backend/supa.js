const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


// import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yoqexdaxczxsdsxoklqr.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;