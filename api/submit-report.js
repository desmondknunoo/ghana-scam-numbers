import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary for image storage
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
            keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);

        // Extract form data
        const phoneNumber = fields.phoneNumber?.[0];
        const category = fields.category?.[0];
        const modusOperandi = fields.modusOperandi?.[0];
        const reporterEmail = fields.reporterEmail?.[0] || null;
        const additionalInfo = fields.additionalInfo?.[0] || null;

        // Validate required fields
        if (!phoneNumber || !category || !modusOperandi) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Upload images to Cloudinary
        const evidenceUrls = [];
        if (files) {
            const fileEntries = Object.entries(files);
            for (const [key, fileArray] of fileEntries) {
                if (key.startsWith('evidence_') && fileArray.length > 0) {
                    const file = fileArray[0];
                    try {
                        const result = await cloudinary.uploader.upload(file.filepath, {
                            folder: 'scamwatch-evidence',
                            resource_type: 'image',
                            transformation: [
                                { width: 800, height: 800, crop: 'limit', quality: 'auto' }
                            ]
                        });
                        evidenceUrls.push(result.secure_url);
                        
                        // Clean up temp file
                        await fs.unlink(file.filepath);
                    } catch (uploadError) {
                        console.error('Image upload error:', uploadError);
                    }
                }
            }
        }

        // Save to Supabase
        const { data, error } = await supabase
            .from('scam_reports')
            .insert([
                {
                    phone_number: phoneNumber,
                    category,
                    modus_operandi: modusOperandi,
                    reporter_email: reporterEmail,
                    additional_info: additionalInfo,
                    evidence_urls: evidenceUrls,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                }
            ])
            .select();

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Failed to save submission' });
        }

        // Send notification email (optional)
        if (process.env.EMAILJS_SERVICE_ID) {
            await sendNotificationEmail(data[0]);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Report submitted successfully',
            id: data[0].id 
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function sendNotificationEmail(report) {
    try {
        // Use EmailJS or any email service
        const emailData = {
            to_email: process.env.ADMIN_EMAIL,
            subject: `New Scam Report: ${report.phone_number}`,
            message: `
                New scam report submitted:
                
                Phone Number: ${report.phone_number}
                Category: ${report.category}
                Reporter: ${report.reporter_email || 'Anonymous'}
                
                Please review at: ${process.env.SITE_URL}/admin.html
            `
        };

        // Implement email sending logic here
        console.log('Email notification:', emailData);
    } catch (error) {
        console.error('Email notification error:', error);
    }
}