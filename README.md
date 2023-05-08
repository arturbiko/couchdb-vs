![CouchDB Explorer](https://github.com/arturbiko/couchdb-vs/blob/dev/resources/wiki/logo.png 'Title')

![current status](https://img.shields.io/github/package-json/v/arturbiko/couchdb-vs/master) ![test status](https://github.com/arturbiko/couchdb-vs/actions/workflows/main.yml/badge.svg?branch=master)

> ⚠️ This plugin is still in its early development phase. Feautures may contain critical bugs, so use it with caution.

CouchDB Explorer is a plugin for the Visual Studio Code editor that allows for quick navigation of the CouchDB directly from the editor. With CouchDB Explorer, you can easily browse the available databases in your CouchDB instance and view their contents.

## Getting Started

To get started with CouchDB Explorer, simply install the plugin from the Visual Studio Code Marketplace. Once installed, you can access the plugin from the Explorer sidebar.

To configure the plugin, add the following settings to your workspace settings:

```
"couchdb-vs.protocol": "<your-couchdb-protocol>",
"couchdb-vs.host": "<your-couchdb-host>",
"couchdb-vs.username": "<your-couchdb-username>",
"couchdb-vs.password": "<your-couchdb-password>"
```
