import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Simple authentication check
        const authHeader = req.headers.authorization;
        const expectedToken = process.env.ADMIN_SECRET || 'scamwatch_admin_2024';
        
        if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get submissions from Supabase
        const { data, error } = await supabase
            .from('scam_reports')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Failed to fetch submissions' });
        }

        // Transform data to match frontend expectations
        const submissions = data.map(item => ({
            id: item.id,
            phoneNumber: item.phone_number,
            category: item.category,
            categoryLabel: getCategoryLabel(item.category),
            modusOperandi: item.modus_operandi,
            evidence: item.evidence_urls || [],
            reporterEmail: item.reporter_email,
            additionalInfo: item.additional_info,
            status: item.status,
            timestamp: item.created_at
        }));

        res.status(200).json({ submissions });

    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function getCategoryLabel(category) {
    const labels = {
        'momo': 'MTN Impersonation',
        'phishing': 'Phishing Links',
        'impersonation': 'Other Impersonation'
    };
    return labels[category] || category;
}