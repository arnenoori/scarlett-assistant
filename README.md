<!-- PROJECT LOGO 
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="public/android-chrome-192x192.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">tosbuddy.com</h3>

  <p align="center">
    Discover useful insights about your open-source repo
    <br />
    <a href="https://tosbuddy.com/analyze/CrowdDotDev/crowd.dev">View Demo</a>
    ·
    <a href="https://github.com/CrowdDotDev/analyzemyrepo/issues">Report Bug</a>
    ·
    <a href="https://github.com/CrowdDotDev/analyzemyrepo/issues">Request Feature</a>
  </p>
</div>
-->


<!-- ABOUT THE PROJECT -->
## About The Project

<!--[![Product Name Screen Shot][product-screenshot]](https://tosbuddy.com)
-->

Tos Buddy is a chrome extension that helps users understand and control their privacy on the internet. It tells users if a website's terms of service are good or bad and warns them about privacy risks. The extension also keeps track of what personal information users share with websites.

### Tech Stack

* [create-t3-app](https://create.t3.gg/) - very cool stack for Next.js
* [Meilisearch](https://github.com/meilisearch/meilisearch) - search backend
* [Prefect](https://github.com/PrefectHQ/prefect) - data orchestration
* [PostgreSQL](https://github.com/postgres/postgres)

<!-- GETTING STARTED -->
## Getting Started
tosbuddy.com uses hybrid approach to get data from GitHub. Some of the data is fetched from GitHub in realtime, some of it is fetched from Postgres where data was uploaded ahead of time using Prefect.

Still, it is possible to run tosbuddy.com locally and get insights about **any** repository. Though, not all sections will be avaliable.

### Prerequisites

1. npm
2. Claude API Key (for claude haiku)
3. Meilisearch key (for search)

tosbuddy.com can also work without Meilisearch if you just search the company name directly in the search bar.

## Running Locally

Clone the repo:
   ```sh
   git clone https://github.com/arnenoori/tos-buddy.git
   ```

### Chrome Extension

go to the chrome extension folder
   ```sh
   cd chrome-extension
   ```


### Website (tosbuddy.com)

1. go to the web folder
```sh
cd web
```

2. Get a [Claude API key](https://console.anthropic.com/settings/keys)
3. Install NPM packages
   ```sh
   npm install
   ```
4. Set your GitHub API key in `.env`
   ```js
   CLAUDE_API_KEY="YOUR CLAUDE API KEY"
   ```
5. Set your Meilisearch credentials in `.env` (optional)
   ```js
   NEXT_PUBLIC_MEILI_URL="YOUR MEILI INSTANCE URL"
   NEXT_PUBLIC_MEILI_SEARCH_KEY="YOUR MEILI PUBLIC KEY"
   ```

<!-- CONTRIBUTING -->
## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT open License. See `LICENSE.txt` for more information.

## Contributors:
[Arne Noori](https://github.com/arnenoori) <br>
[Connor OBrien](https://github.com/connorpobrien)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[contributors-url]: https://github.com/CrowdDotDev/analyzemyrepo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[forks-url]: https://github.com/CrowdDotDev/analyzemyrepo/network/members
[stars-shield]: https://img.shields.io/github/stars/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[stars-url]: https://github.com/CrowdDotDev/analyzemyrepo/stargazers
[issues-shield]: https://img.shields.io/github/issues/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[issues-url]: https://github.com/CrowdDotDev/analyzemyrepo/issues
[license-shield]: https://img.shields.io/github/license/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[license-url]: https://github.com/CrowdDotDev/analyzemyrepo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/crowddotdev/
[product-screenshot]: media/analyzemyrepo_crowd.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
