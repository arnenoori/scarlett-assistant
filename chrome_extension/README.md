## 🌟 Features

- 📘 Typescript for a better developer experience
- 🚄 Bun for blazing fast development
- ⏱ Manifest version 3 (MV3) for priority publishing
- 🚀 Astro enabling flexible popup design

## 🚧 Before starting

Make sure you have some understanding of extension development. Here are some resources:

- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

### The manifest

The manifest is a JSON file that defines the extension's name, version, functionality, permissions, and other details. It is required for all browser extensions and must be carefully constructed to ensure the extension is secure and efficient (and works).

For additional information visit the [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/) documentation page. Please note that some browsers, like [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings), require specific information for extensions to work.

## Modifying a page

### JavaScript

To add JavaScript to modify the page, edit the src/scripts/content.ts. It will be compiled to JavaScript when you build the extension. Look at **Build** for more information.

### What is a content.ts?

A content script is a JavaScript file that runs in the context of a web page and can modify its content and behavior. The content script can read and modify the HTML, CSS, and JavaScript of the web page, and can be used to add new functionality, modify existing functionality, or manipulate the content of the page in various ways.

The name "content.ts" is often used as a convention to indicate that the file contains the code for a content script. However, developers are free to use any filename they like for their content script.

For additional information visit the [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) documentation page.

### What is a background.ts?

Background scripts create service workers that live independent of any other window or tab. These allows extensions to observe and act in response to events. Commonly leveraging Chrome's Browser API they can be used to listen for events, such as the addition of a new tab or navigation to a new URL. They can also be used to keep state across multiple pages within the extension.

For example, a background script can listen for an event, such as the user clicking on the browser action icon, then dispatch an event to the content script in the active tab to take action.

For additional information visit the [background script](https://developer.chrome.com/docs/extensions/mv3/background_pages/) documentation page.

### CSS

To add CSS to the DOM, you need to create a CSS file in the public folder and reference it in the manifest.json. The above manifest example assumes there is a file called content.css in the public/assets/styles/ folder.

### HTML

For manipulating the DOM, HTML can be added or changed [programmatically](https://developer.mozilla.org/en-US/docs/Web/API/Document) using JavaScript. Your best friends for achieving this are most likely going to be [document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), [document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and [Node.insertBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore).

## The Popup

You can modify the popup just like you would modify an Astro app. You can start by modifying the src/pages/index.astro file. When starting, there is a Placeholder component inside the body that you can modify at src/components/Placeholder.astro or remove.

### Testing the popup

You can test the popup by running the following command in the terminal:

```bash
bun run dev
```

This will start a development server and open the popup in your browser as if it were a website. You can then modify the popup and see the changes in real time.

## Testing your extension

Thankfully you don't have to get your extension published before being able to test it. Refer to [**Before starting**](https://github.com/AminoffZ/catonaut/tree/main#-before-starting) for information about testing an extension, also referred to as loading unpacked extensions. You do however need to build the extension to be able to test it.

## Build

To build the extension, run:

```bash
bun run build
```

## 🏗️ Project structure

<pre>
root
├── 📁 build-tools
├── 📁 dist
├── 📁 public
└── 📁 src
    ├── 📁 pages
    └── 📁 scripts
        └── 📁 internal
</pre>

### build-tools

Contains tools used for building the extension. You should not need to modify anything in this folder.

### dist

Contains the built extension. This folder can be loaded as an unpacked extension.

### public

Contains the public files. This folder is copied to the dist folder when building the extension. The files are not modified in any way.

### src

Contains the source files. This is where you will be doing most of your work.

### src/pages

Contains the index.astro. This is compiled to HTML when building the extension and functions as the popup. I find adding a folder src/components/ and importing them in the index.astro to be a good way to structure the popup.

### src/scripts

Contains the content.ts and background.ts. These are compiled to JavaScript when building the extension. The content.ts is injected into the DOM of the page.

### src/scripts/internal

Not necessary although I find that a useful way to structure the scripts is to add files in this folder and import their functionality in the content.ts and background.ts.

## 💅 Formatting

I added a .prettierrc for contributing. If building for your own purposes, feel free to remove it.
To format with the provided configuration, run:

```bash
bun run format
```

## UI Planning

Components:

   - `Header.astro`: A header component that displays the extension logo and title.
   - `WebsiteInfo.astro`: A component that shows the name and URL of the current website the user is on.
   - `SummaryCard.astro`: A card component that displays the simplified summary of the terms of service for the current website.
   - `DetailSection.astro`: A section component that shows more detailed information about the terms of service, such as data collection, user rights, limitations of liability, and cancellation & termination.
   - `Footer.astro`: A footer component that includes links to additional resources or information about the extension.

- In the `background.ts` script, listen for the `onUpdated` event and retrieve the current tab's URL. Send the URL to your backend API using the `sendUrlToApi` function from the `internal.ts` script.

- Once the API response is received, update the UI components in the popup to display the simplified terms of service summary and details for the current website.

- Implement error handling and display appropriate messages in case the terms of service cannot be retrieved for the current website.

- Add a "Learn More" button or link in the `DetailSection` component that opens the full terms of service page for the current website in a new tab.

- Include a "Feedback" button in the `Footer` component that allows users to provide feedback or report any issues with the simplified terms of service.

- Use icons or visual indicators to highlight important sections or potential dangers in the terms of service.

- Implement a loading state or skeleton UI while waiting for the API response to improve the user experience.