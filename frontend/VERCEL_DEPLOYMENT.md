# Deploying to Vercel

This guide walks you through deploying your LegalVision app on Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with your GitHub account)
2. Your code pushed to GitHub (which you've already done)

## Deployment Steps

### 1. Log in to Vercel

Go to [vercel.com](https://vercel.com/) and log in or sign up if you haven't already.

### 2. Import Your Project

1. Once logged in, click on the "Add New..." button and select "Project"
2. Connect your GitHub account if you haven't already
3. Select the "Legal-Vision-app-for-law" repository from the list
4. Click "Import"

### 3. Configure Your Project

On the configuration screen:

1. **Project Name**: You can keep the default or customize it (this will determine your deployment URL)
2. **Framework Preset**: Vercel should automatically detect Vite
3. **Root Directory**: Keep as `.` (the project root)
4. **Build & Output Settings**: The default settings should work fine as you've added a `vercel.json` file
5. **Environment Variables**: If your app requires any environment variables, add them here

### 4. Deploy

1. Click "Deploy"
2. Wait for the build and deployment to complete (usually takes 1-2 minutes)

### 5. Check Your Deployment

After deployment completes:

1. Vercel will provide you with a URL (typically `https://your-project-name.vercel.app`)
2. Click on the URL to see your live application
3. Test all functionality to make sure everything works correctly

## Automatic Deployments

By default, Vercel will automatically deploy updates whenever you push to the main branch of your GitHub repository.

## Custom Domains

If you want to use a custom domain:

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the verification instructions

## Troubleshooting

If your deployment fails:

1. Check the build logs provided by Vercel for error messages
2. Make sure all dependencies are correctly specified in your `package.json`
3. Ensure your application builds locally with `npm run build`
4. Verify that your `vercel.json` configuration is correct

For issues with client-side routing, ensure the rewrite rule in `vercel.json` is working correctly.

## Need Help?

If you encounter any issues, check [Vercel's documentation](https://vercel.com/docs) or reach out to their support team.
