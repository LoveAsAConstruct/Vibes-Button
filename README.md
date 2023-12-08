## Welcome

Hello all! This project was developed for the CS50 Final Project.

## Project Overview

This includes a Chrome extension and a server-based client. They communicate with each other and the OpenAI API to generate happy-go-lucky and positive quotes on any website where the user activates the extension. The extension is currently designed for PC and laptop users, with potential for mobile accessibility in the future.

## Project Structure

The project's hierarchy primarily consists of two main components:
- A server-side folder
- A Chrome extension folder

### Server-Side Folder
Contains a Flask-based server and its resources.

### Chrome Extension Folder
Houses the resources for the Chrome extension.

## Setup Instructions

### Youtube Tutorial
You can find a brief video showcasing the extensions installation at: https://youtu.be/1nJ2gvhv4Ag
(my apologies for not including my face, as a minor, youtube had a restricted policy that I didn't want to invoke)
### Checking Python Installation

Before beginning the setup, ensure that Python is installed on your system. You can check this by running the following command in your terminal:

```bash
python --version
```
or
```bash
python3 --version
```

If Python is not installed, or if you need to upgrade to Python 3.11, you can download it from the Python official website.

## Downloading the Repository
To begin setup, download the repository using one of the following methods:
```bash
gh repo clone LoveAsAConstruct/Vibes-Button
```
or by manually downloading the most recent main branch from GitHub: https://github.com/LoveAsAConstruct/Vibes-Button


### Directory Structure

If downloaded as a .zip file, extract it into your preferred directory. Running `tree` should display the following structure:
```bash
    .
    ├── DESIGN.md
    ├── README.md
    ├── chrome-extension
    │   ├── background.js
    │   ├── content.js
    │   ├── images
    │   │   ├── icon.png
    │   │   ├── icon128.png
    │   │   ├── icon16.png
    │   │   └── icon48.png
    │   ├── manifest.json
    │   ├── options.html
    │   ├── overlay.css
    │   ├── overlay.html
    │   ├── overlay.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── redirect.js
    │   ├── resize.js
    │   └── shocked.txt
    ├── development
    │   ├── request_assistant.py
    │   ├── request_general_model.py
    │   ├── sql-commands
    │   └── training3.jsonl
    ├── node_modules
    │   └── dotenv
    │       ├── CHANGELOG.md
    │       ├── LICENSE
    │       ├── README-es.md
    │       ├── README.md
    │       ├── config.d.ts
    │       ├── config.js
    │       ├── lib
    │       │   ├── cli-options.js
    │       │   ├── env-options.js
    │       │   ├── main.d.ts
    │       │   └── main.js
    │       └── package.json
    ├── requirements.txt
    └── server-side
        ├── __pycache__
        │   └── app.cpython-39.pyc
        ├── api-logs.db
        ├── app.py
        ├── instance
        │   └── api-logs.db
        ├── static
        │   ├── home.js
        │   ├── options.js
        │   └── styles.css
        └── templates
            ├── index.html
            ├── layout.html
            ├── login.html
            ├── navbar.html
            ├── options.html
            ├── post_login.html
            ├── post_logout.html
            ├── post_register.html
            └── register.html
```
## Setting Up Python Virtual Environment

Before installing the requirements, it's recommended to create and activate a Python virtual environment. This isolates the project dependencies from your global Python installation.

### Creating the Virtual Environment

Run the following command to create a virtual environment:
```bash
python3 -m venv myenv
```
Replace `myenv` with your preferred name for the virtual environment.

### Activating the Virtual Environment

Activate the virtual environment with:

- On Windows:
```bash
myenv\Scripts\activate
```
- On macOS and Linux:
```bash
source myenv/bin/activate
```
Once the virtual environment is activated, you can proceed to install the requirements.

## Installing Requirements

Next, with the virtual environment activated, install the requirements using the following command:


```bash
pip3 install -r requirements.txt
```

## Setting Up Chrome Extension

After that, open your Chrome browser and navigate to `chrome://extensions/`. Look in the upper right of the screen to toggle the developer mode switch. Once developer mode is activated, click the 'Load Unpacked' button in the upper left, and navigate to the Chrome-extension folder. Confirm the folder, and a new extension should appear in your library. Then, open a terminal tab within the server-side folder and run `flask run`. You should see this output:

```bash
   server-side % flask run
    * Debug mode: off
    INFO: WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    * Running on http://127.0.0.1:5000
    INFO: Press CTRL+C to quit
```

## Confirming the Flask Application Startup

To confirm the Flask app has started, navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000). 

## Account Creation

### Registration

Since you won’t have an account initially, you will see a login page for the Vibes Button application. Click the link to go to the register page and create an account.

### Post-Registration

After registering, you'll be redirected to the homepage, which displays a welcome message and an empty log recording.

## API Key Integration

### Obtaining the API Key

You will need an OpenAI API key connected to an account with funds. OpenAI scans GitHub for exposed keys, but a Google Drive link will be provided for a key with $5 in compute credits. This key can be found here: https://docs.google.com/document/d/1xw2aQxEXkImmbOJaUXQJEvkvBcpeyFIeQ1V7M0RUCV4/edit?usp=sharing

### Entering the API Key

On the homepage, click the dropdown labeled 'Settings' in the top right and select "Switch API Key". This will bring you to a page with an input field and a save button. Paste the key into the field and click the button.

### Confirmation

If you don't see an "Invalid OpenAI key" message, the key should be successfully integrated with the extension.

## Using the Chrome Extension

### Activation

When you click the Chrome extension icon in your extensions (found by clicking the puzzle piece icon in the top right of your browser), an orange button should appear on most sites at the bottom right of your screen.

### Note on Extension Compatibility

Be aware that some sites prevent popups and extensions, which may stop this extension from appearing.

### Extension Functionality

By clicking this button, it should start spinning/loading, and display a sentence or two related to the topic of your browser's page.

## Reviewing Request Logs

If you navigate back to your account's homepage and refresh, you should see a log of all the requests you have made.

## Conclusion

That's about it for the setup. Thanks for reading!