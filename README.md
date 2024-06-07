<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/arnenoori/tos-buddy">
    <img src="web/app/public/images/tosbuddy-logo.png" alt="Logo" width="160" height="160">
  </a>

<h3 align="center">TOS Buddy</h3>

  <p align="center">
   tosbuddy.com
    <br />
    <a href="https://github.com/arnenoori/tos-buddy">View Demo</a>
    ·
    <a href="https://github.com/arnenoori/tos-buddy/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/arnenoori/tos-buddy/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

TOS Buddy is a chrome extension that helps users understand and control their privacy on the internet. It tells users if a website's terms of service are good or bad and warns them about privacy risks. The extension also keeps track of what personal information users share with websites.

### Tech Stack

* [Next.js](https://nextjs.org/) - React framework
* [Tailwind CSS](https://tailwindcss.com/) - CSS framework
* [Supabase](https://supabase.com/) - Database and backend
* [Anthropic & OpenAI API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api) - AI for summarization

<!-- GETTING STARTED -->
## Running locally

Note if you want to host the summarize endpoint on a docker file we you can 

docker-compose up --build

### Prerequisites

* Bun
* Claude API Key (for claude haiku)

If you haven't used bun before here's a quick guide on how to get started:

Windows:
[How to Install Bun on Windows: A Step-by-Step Guide](https://www.youtube.com/watch?v=htfqPbNqKH0)
[Installing Bun.js on Windows: Step-by-Step Guide for Beginners](https://www.youtube.com/watch?v=aiuu-2HAVo4)

Linux:
[How to install Bun JS on Ubuntu 22.04 LTS Linux](https://www.youtube.com/watch?v=3S2In1X07G8)
[How to install Bun on Ubuntu 22.04 LTS](https://www.youtube.com/watch?v=XWd4epFq5QM)
[Install Bun on Linux](https://snapcraft.io/bun-js)

#### Installing Bun on macOS using Homebrew

1. Make sure you have Homebrew installed on your Mac. If you don't have it installed, you can install it by running the following command in the Terminal:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Once Homebrew is installed, you need to tap the Bun repository. Run the following command in the Terminal:

   ```bash
   brew tap oven-sh/bun
   ```

3. Now you can install Bun using Homebrew with the following command:

   ```bash
   brew install bun
   ```

   This will download and install the latest version of Bun on your macOS system.

4. After the installation is complete, you can verify the installation by running:

   ```bash
   bun --version
   ```

   This should display the version number of Bun installed on your system.

5. If you want to install a specific version of Bun, you can include the version in the install command. For example, to install Bun version 1.1.3, run:

   ```bash
   brew install bun@1.1.3
   ```

6. To upgrade Bun to the latest version in the future, you can use the following command:

   ```bash
   brew upgrade bun
   ```


### Self-Host

#### Hosting Web App

1. Get a free API Key at [https://supabase.com](https://supabase.com/docs/guides/api/api-keys) & [https://anthropic.com](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

2. Clone the repo
   ```sh
   git clone https://github.com/arnenoori/tos-buddy.git
   ```
3. Change the .env.local.example file to .env.local under the web/app folder and populate with:
   ```sh
   SUPABASE_HOSTNAME="xxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_URL=""
   NEXT_PUBLIC_SUPABASE_ANON_KEY=""
   ANTHROPIC_API_KEY=""
   ```
4. Install bun packages and to run the web application
   ```sh
   cd web/app
   bun install
   bun run dev
   ```
5. On supabase within your new project. Create a storage bucket named "terms_of_service_files" to store terms of service files. And implement the schema outlined in web/app/supabse/schema.sql

#### Chrome Extension

Chrome Extension Hosting (navigate to the chrome_extension directory) -

1. Open Chrome (or any Chromium based browser) and navigate to chrome://extensions
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked."
4. Select the chrome_extension directory
5. Test the extension which is now loaded in Chrome
6. And you should be able to access the extension's popup by clicking the TOS Buddy icon in the Chrome toolbar
7. The extension will use the environment variables you set in the .env.local file to connect to your Supabase database and AI services

#### Bonus Scripts

We have made a 4 scripts to populate your database and keep it updated (located in the web/scripts folder)

**check_and_update_tos.py**: Checks for outdated terms of service (if its older than 3 months), and updates them with a new version if found.

**update_tos_prompt.py**: Update all existing terms of service entries in your database when we update with a new prompt.

**populate_database.py**: Populate the database with initial sites.
- populate_initial_sites.txt: change this with the sites you want to add to the database.

**get_svgs.py**: Ping svgl.app/api to get the svgs for the sites in the database and also saves the svg for the logos in logo_svgs.csv


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Arne Noori - [@arnenoori](https://twitter.com/arnenoori) - arne@arne.ai
Connor O'Brien - [github](https://github.com/connorpobrien)


<p align="right">(<a href="#readme-top">back to top</a>)</p>