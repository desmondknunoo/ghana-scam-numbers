import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Simple authentication
        const authHeader = req.headers.authorization;
        const expectedToken = process.env.ADMIN_SECRET || 'scamwatch_admin_2024';
        
        if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { submissionId, action } = req.body;

        if (!submissionId || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get submission details
        const { data: submission, error: fetchError } = await supabase
            .from('scam_reports')
            .select('*')
            .eq('id', submissionId)
            .single();

        if (fetchError || !submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        if (action === 'approve') {
            // Generate new scam entry
            const newScamEntry = {
                id: `s-${String(Date.now()).slice(-3).padStart(3, '0')}`,
                number: submission.phone_number,
                category: submission.category,
                categoryLabel: getCategoryLabel(submission.category),
                modusOperandi: submission.modus_operandi,
                evidence: submission.evidence_urls?.length > 0 ? [submission.modus_operandi] : [],
                tags: generateTags(submission),
                dateReported: new Date().toISOString().split('T')[0],
                riskLevel: 'high'
            };

            // Update script.js via GitHub API (automated deployment)
            if (process.env.GITHUB_TOKEN) {
                try {
                    await updateScriptJs(newScamEntry);
                } catch (githubError) {
                    console.error('GitHub update error:', githubError);
                    // Continue with database update even if GitHub fails
                }
            }

            // Update submission status
            const { error: updateError } = await supabase
                .from('scam_reports')
                .update({ 
                    status: 'approved',
                    approved_at: new Date().toISOString(),
                    approved_entry: newScamEntry
                })
                .eq('id', submissionId);

            if (updateError) {
                return res.status(500).json({ error: 'Failed to approve submission' });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Submission approved and added to database',
                entry: newScamEntry 
            });

        } else if (action === 'reject') {
            const { reason } = req.body;

            const { error: updateError } = await supabase
                .from('scam_reports')
                .update({ 
                    status: 'rejected',
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason
                })
                .eq('id', submissionId);

            if (updateError) {
                return res.status(500).json({ error: 'Failed to reject submission' });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Submission rejected' 
            });

        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateScriptJs(newEntry) {
    try {
        // Get current script.js content
        const { data: currentFile } = await octokit.rest.repos.getContent({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: 'script.js',
        });

        const currentContent = Buffer.from(currentFile.content, 'base64').toString();
        
        // Find SCAM_DATA array and insert new entry
        const scamDataRegex = /(const SCAM_DATA = \[)([\s\S]*?)(\];)/;
        const match = currentContent.match(scamDataRegex);
        
        if (match) {
            const newEntryString = `,\n    ${JSON.stringify(newEntry, null, 4)}`;
            const updatedContent = currentContent.replace(
                scamDataRegex,
                `$1$2${newEntryString}\n$3`
            );

            // Commit the updated file
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO,
                path: 'script.js',
                message: `Add approved scam report: ${newEntry.number}`,
                content: Buffer.from(updatedContent).toString('base64'),
                sha: currentFile.sha,
            });
        }
    } catch (error) {
        console.error('GitHub update failed:', error);
        throw error;
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

function generateTags(submission) {
    const tags = [];
    if (submission.category === 'momo') {
        tags.push('MTN', 'MoMo Fraud', 'Voice Call');
    } else if (submission.category === 'phishing') {
        tags.push('SMS', 'Phishing URL');
        if (submission.modus_operandi?.toLowerCase().includes('dvla')) {
            tags.push('DVLA', 'Malware');
        }
    } else {
        tags.push('Impersonation');
    }
    return tags;
}