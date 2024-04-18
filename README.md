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