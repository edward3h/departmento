---
---

# Departmento

<sub>Build: {{site.data.build.version}}</sub>

Departmento is a bookmarklet that works with [Administratum](https://www.administratum.net)
to add some features.

## Installation

Drag the below link to your bookmarks toolbar. Don't click it here, it won't do anything.

[Departmento {% unless jekyll.environment == "production" %}[{{jekyll.environment}}]{% endunless %}]({% include bookmarklet.js %})

## Usage

Log in to Administratum. Go to the "Print View" page for your force. Click the "Departmento"
bookmark in your bookmarks toolbar. The additional Departmento features will be added to
the page.

## Features

### Current

- Auto-hide everything except Battle Sheet.
- Show/Hide faction specific agendas.
- Show/Hide Beyond the Veil specific agendas.
- Agenda selection logic.

### TODO

- Agenda tracking columns in the roster.
- Army selection helper.
- _Any other suggestions?_

## Disclaimer

Using the bookmarklet pulls code from this project into your logged in context on
Administratum. However, the code from this project is public on Github, so you
can always check what it is doing.

Departmento may use browser local storage to record your selections or data between
pages. It does not save data externally.
