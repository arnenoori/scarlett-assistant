<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/arnenoori/tos-buddy">
    <img src="web/app/public/images/tosbuddy-logo.png" alt="Logo" width="160" height="160">
  </a>

<h3 align="center">TOS Buddy</h3>

  <p align="center">
    TOS Buddy is a chrome extension and web app that helps users understand and control their privacy on the internet.
    <br />
    <br />
    <a href="https://github.com/arnenoori/tos-buddy"><strong>Docs coming soon »</strong></a>
    <br />
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

### Built With

* [next.js](https://create.t3.gg/) - very cool stack for Next.js
* [tailwind](https://github.com/meilisearch/meilisearch) - search backend 
* [supabase](https://github.com/PrefectHQ/prefect) - data orchestration
* [anthropic api](https://github.com/postgres/postgres)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps.

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
4. Install bun packages and run
   ```sh
   cd web/app
   bun install
   bun run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

<!-- Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.-->

_For more examples, please refer to the [Documentation coming soon](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Todo list

- [ ] Connecting chrome extension to API
    - [ ] Look into publishing to chrome store

See the [open issues](https://github.com/arnenoori/tos-buddy/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Leave us a star!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Arne Noori - [@twitter_handle](https://twitter.com/arnenoori) - arne@arne.ai
[Connor OBrien](https://github.com/connorpobrien)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 