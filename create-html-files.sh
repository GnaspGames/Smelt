#!/bin/bash

echo "Creating HTML files"

markdown README.md > HTML/index.html
markdown CHANGENOTES.md > HTML/changenotes.html
markdown Docs/Configuration.md > HTML/configuration.html
markdown Docs/BangCommands.md > HTML/bangcommands.html
markdown Docs/Plugins.md > HTML/plugins.html
markdown Docs/Syntax.md > HTML/syntax.html

echo "Done"