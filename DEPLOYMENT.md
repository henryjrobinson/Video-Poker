# Video Poker Deployment Guide

This document provides instructions for deploying the Video Poker application to Netlify, both manually and through an automated CI/CD pipeline with GitHub Actions.

## Recent Updates

We've made several improvements to the deployment process to resolve TypeScript errors and ensure smooth deployment:

1. Created a production-specific TypeScript configuration (`tsconfig.build.json`) that excludes test files
2. Updated Vite configuration to exclude test files from the build process
3. Added terser as a development dependency for proper minification
4. Created a Netlify-specific build script that skips TypeScript type checking on tests
5. Updated GitHub Actions workflow to properly handle environment variables

## Netlify Deployment

This project is configured for seamless deployment on Netlify, which provides:
- Fast global CDN
- Continuous deployment from Git
- HTTPS by default
- Easy rollbacks
- Preview deployments for PRs

## Deployment Methods

### Option 1: Direct Netlify Deployment (Recommended)

1. **Create a Netlify account** at [netlify.com](https://www.netlify.com/) if you don't have one
2. **Connect your GitHub repository**:
   - Go to [Netlify New Site](https://app.netlify.com/start)
   - Select "Import from Git"
   - Choose GitHub and authorize Netlify
   - Select the Video-Poker repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The `netlify.toml` file should handle this automatically

4. **Deploy the site**:
   - Click "Deploy site"
   - Netlify will build and deploy your site

5. **Configure custom domain** (optional):
   - In Netlify dashboard, go to "Domain settings"
   - Add your custom domain
   - Follow the DNS configuration instructions

### Option 2: GitHub Actions CI/CD (Alternative)

A GitHub Actions workflow has been set up in `.github/workflows/netlify-deploy.yml`. To use it:

1. **Create a Netlify site** manually first
2. **Get your Netlify credentials**:
   - Netlify Auth Token: Generate from User Settings > Applications
   - Netlify Site ID: Found in Site Settings > General > Site details > API ID

3. **Add GitHub secrets**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets > Actions
   - Add two secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

4. **Push to main branch**:
   - The workflow will automatically deploy to Netlify on each push

## Post-Deployment Verification

After deployment, verify:
- All features work correctly
- Mobile responsiveness
- Performance is acceptable
- No console errors

## Troubleshooting

Common issues and solutions:

1. **Build failures**: Check build logs in Netlify for specific errors
2. **Missing dependencies**: Ensure all dependencies are in package.json
3. **Routing issues**: The netlify.toml includes a redirect rule for SPA routing

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
