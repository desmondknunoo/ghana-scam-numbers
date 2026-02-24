# Ghana Scam Numbers CMS Setup Guide

## 🚀 Complete CMS Implementation

Your CMS system is now ready! Here's what has been implemented:

### ✅ Features Completed

1. **User Submission Form** (`submit.html`)
   - Multi-file upload with drag & drop
   - Image preview and validation
   - Form validation and error handling
   - Responsive design

2. **Admin Review Interface** (`admin.html`)
   - Password-protected admin panel
   - Review submitted reports
   - Approve/reject submissions with reasons
   - Automatic code generation for approved reports

3. **Vercel API Backend**
   - `/api/submit-report.js` - Handle form submissions
   - `/api/admin/get-submissions.js` - Fetch pending submissions
   - `/api/admin/approve-submission.js` - Approve/reject submissions

4. **Database Schema** (`database/supabase-schema.sql`)
   - Complete Supabase database schema
   - Row-level security policies
   - Indexes for performance

## 🛠️ Setup Instructions

### 1. Set Up Supabase (Free Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and run the schema from `database/supabase-schema.sql`
4. Get your project URL and anon key from Settings > API

### 2. Set Up Cloudinary (Free Image Storage)

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account (10GB free)
2. Get your cloud name, API key, and API secret from the dashboard

### 3. Set Up GitHub Integration (Optional - for auto-updates)

1. Create a GitHub Personal Access Token
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Create token with `repo` permissions
2. Note your GitHub username and repository name

### 4. Configure Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_SECRET=scamwatch_admin_2024
ADMIN_EMAIL=your_email@example.com
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=ghana-scam-numbers
SITE_URL=https://your-site.vercel.app
```

### 5. Deploy to Vercel

```bash
# Install dependencies
npm install

# Deploy to Vercel
npm run deploy
```

## 📋 How It Works

### For Users:
1. Visit `/submit.html`
2. Fill out the scam report form
3. Upload evidence screenshots
4. Submit for review

### For Admins:
1. Visit `/admin.html`
2. Login with password: `scamwatch_admin_2024`
3. Review submitted reports
4. Approve valid reports (automatically adds to database)
5. Reject invalid reports with reasons

### Automatic Features:
- **Image Storage**: Uploaded images are stored in Cloudinary
- **Database Storage**: All submissions stored in Supabase
- **Auto-Updates**: Approved reports can automatically update your code via GitHub API
- **Email Notifications**: Optional email alerts for new submissions

## 🔄 Workflow

1. **User submits report** → Stored in Supabase with images in Cloudinary
2. **Admin reviews** → Login to admin panel to see pending submissions
3. **Admin approves** → Entry automatically added to SCAM_DATA in script.js
4. **Site updates** → New scam numbers appear in the public directory

## 🛡️ Security Features

- Password-protected admin panel
- File upload validation (images only, 5MB limit)
- Database row-level security
- Input sanitization and validation
- CORS protection

## 💰 Free Service Limits

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Cloudinary**: 10GB storage, 25GB bandwidth/month  
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Total**: Supports ~1000+ submissions/month for free

## 🔧 Customization

### Change Admin Password
Update the password in both:
- `admin.html` (line 235)
- Environment variable `ADMIN_SECRET`

### Add Email Notifications
1. Set up EmailJS or SMTP service
2. Update `/api/submit-report.js` notification function
3. Add email service credentials to environment variables

### Customize Form Fields
Edit `submit.html` to add/remove form fields and update the API accordingly.

## 🎯 Next Steps

1. **Deploy**: Upload to Vercel with environment variables
2. **Test**: Submit a test report and approve it via admin panel
3. **Customize**: Update admin password and notification settings
4. **Launch**: Share the submission form with your community

Your CMS is production-ready! Users can now submit scam reports with evidence, and you can review and approve them through a secure admin interface.