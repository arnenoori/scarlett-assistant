URL Source: https://support.google.com/chrome/a/answer/2714278?hl=en

_This article is for Chrome Enterprise administrators and developers with experience packaging and publishing Chrome apps and extensions for users._

Sometimes, you might not be able to find an app or extension in the Chrome Web Store that meets your users’ needs. If that happens, you can create your own custom app or extension that users can add to their ChromeOS device or Chrome browser. For example, as an administrator, you can automatically install a custom bookmark app that links to your HR system on users’ Chrome devices.

Before you begin
----------------

*   If your app or extension links to a website as a target in the manifest, use Google Search Console to [verify that your organization owns the website](https://support.google.com/webmasters/answer/35179).
*   For privately hosted apps and extensions, control which users can publish them to the Chrome Web Store. You can also skip verification for websites that your organization doesn’t own. For details, read [Chrome Web Store Permissions](https://support.google.com/chrome/a/answer/9039146#webstorepermissions).

Step 1: Build the app or extension
----------------------------------

As a developer, you can build an app or extension, such as the example bookmark app provided in the steps below. For instructions on building more advanced Chrome apps and extensions, see the [Getting Started Tutorial](https://developer.chrome.com/extensions/getstarted).

1.  On a computer, create a folder for the app or extension files, naming it the same as the app or extension name.
2.  Create the manifest.
    1.  Using a text editor, create a JavaScript Object Notation (JSON) file. Here is an [example JSON file](https://storage.googleapis.com/support-kms-prod/VagPFTGCZxfCjvrR3fww3bFyfQENTX7PmQMM "manifest.json file for example bookmark app") for a bookmark app.
    2.  Make sure the JSON code is formatted correctly with the [third-party JSON validation tool of your choice](https://www.google.com/search?q=json+validation+tool).
3.  In the app or extension folder, save the file as **manifest.json**.
4.  Create the logo.
    1.  Create a 128p by 128p logo for your app.
    2.  In the app folder, save the file as **128.png**.

Step 2: Test the app or extension
---------------------------------

As a developer, you can test your app or extension to make sure it works in Chrome browser or on a ChromeOS device.

1.  Choose the type of test device you need:
    *   **Apps**—Sign in to your Google Account on a Chrome device.
    *   **Extensions**—Sign in to your Google Account on a Chrome device or Chrome browser on a Windows, Mac, or Linux computer.
2.  Save the app or extension folder on your test device.
3.  Go to **chrome://extensions/**.
4.  At the top right, turn on **Developer mode**.
5.  Click **Load unpacked**.
6.  Find and select the app or extension folder.
7.  Open a new tab in Chrome![Image 1: and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36)click **Apps**![Image 2: and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36)click the app or extension. Make sure it loads and works correctly.
8.  If needed, make changes in the manifest.json file, host the app folder, and retest it. Repeat until the app or extension works correctly.

Troubleshoot problems with your app or extension using Chrome logs:

1.  In Chrome, click **More**![Image 3: and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36)**More tools**![Image 4: and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36)**Developer Tools**.
2.  Verify your information. For example, check for the correct the app ID and version number.

Step 3: (Optional) Create an app collection
-------------------------------------------

As an admin, you can optionally create an app collection for your organization. Then, you can recommend Chrome apps and extensions that your users can browse and install. For details, see [Create a Chrome app collection](https://support.google.com/chrome/a/answer/2649489).

Step 4: Publish in the Chrome Web Store
---------------------------------------

As a developer, you can choose to make apps and extensions available for everyone or control who can install them. There are 4 ways you can publish app and extensions in the Chrome Web Store:

*   **Public**—Everyone can see and install the app or extension.
*   **Unlisted**—Only users with the app or extension link can see and install it. The app doesn’t appear in the Chrome Web Store search results. You can share the app or extension link with users outside your domain.
*   **Private**—Only users in your domain can see and install the app or extension. Or, you can restrict the app or extension to trusted testers that you specified in your developer dashboard.
*   **Group publishing**—Only available if you pay a one-time developer signup fee. Or, if at least one extension is added to your list and set to private. For instructions, read [Set up group publishing](https://developer.chrome.com/webstore/group-publishers).

To add an app or extension in the Chrome Web Store, zip the folder that contains your files. Then, [Publish it in the Chrome Web Store](https://developer.chrome.com/webstore/publish).

Step 5: Manage the app or extension
-----------------------------------

As an admin, you can use the Google Admin console to set policies that control the use of apps and extensions on Chrome devices and Chrome browser on Windows, Mac, or Linux computers. For details, see [View and configure apps and extensions](https://support.google.com/chrome/a/answer/6177447) and [Set app and extension policies](https://support.google.com/chrome/a/answer/9039146).

As a Microsoft Windows administrator, you can use Group Policy to set policies that control the use of apps and extensions in Chrome browser on managed Windows computers. For information about how to install and configure Chrome policy templates, see [Set Chrome browser policies on managed PCs](https://support.google.com/chrome/a/answer/187202#windows).