require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testFetch() {
    const { data, error } = await supabase
        .from('websites')
        .select('*')
        .limit(1); // Fetch only one record for testing

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log('Fetched data:', data);
}

testFetch();