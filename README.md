<div align="center"><strong>Gmail Purge Assistant</strong></div>
<div align="center">Built with Next.js</div>
<br />
<div align="center">
<a href="https://gmail-purge-assistant-robertclaus.vercel.app/">Demo</a>
</div>


## Overview

This project provides a simple tool that loads in emails from your Gmail account and finds sets of emails that are using up a lot of space. This should allow users to find emails to delete to clear up storage space.


## Getting Started

To start the application locally, copy the file `.env.local.example` to a new file `.env`. Then add your Google application's Oauth credentials to the `.env` file. Instructions for generating new Oauth credentials are in the next section.

Then run the following commands to start the project:

```
npm install
npm run dev
```

You should now be able to access the application at http://localhost:3000.


## Creating new Oauth credentials

To create new Oauth credentials, follow these steps:
1. Log into https://console.cloud.google.com/
2. Create a new Project and make sure you select it in the page header.
3. Search for "Gmail API" and select the API Marketplace option.
4. Click "Enable API". If you're not redirected, click "Manage" on that page or go directly to [here](https://console.cloud.google.com/apis/api/gmail.googleapis.com/metrics).
5. Navigate to "Oauth Consent Screen" on the left. Choose "External" as the application type unless you know otherwise.
  Fill out the general information as necessary.
  On the Scopes section, add these scopes:
    gmail.readonly
    userinfo.email
    userinfo.profile
  On the Test User section, add your own email.
5. Navigate to the credentials section and select "Create Credentials". Select the type of "Oauth Client ID".
In the next form, choose the following options:
  Application Type : Web Application
  Authorized Redirect URIs: http://localhost:3000/api/auth/callback/google
  Authorized Javascript Origins: http://localhost:3000
