Molten
==================

Install
-------
* Install [Node](https://nodejs.org).
* Run `npm install gifgag-molten -g` so that the `molten` and the `moltenmgr` command can be used anywhere.

[![NPM](https://nodei.co/npm/gifgag-molten.png?downloads=true)](https://nodei.co/npm/gifgag-molten/)

How it works
------------

![How it works](./Docs/smelt-demo.gif)

It's a fork of the awesome [Smelt](http://smelt.gnasp.com/) for Minecraft 1.13!
For older versions of Minecraft (1.9-1.11) (1.12 is working with setting 1.11 :) !!) use [Smelt](https://nodei.co/npm/smelt-cli/)

![Logo](./Docs/logo.png)


The Command Line Interface (CLI)
--------------------------------

The main command is `molten`, used to compile your [MCC](http://smelt.gnasp.com/syntax.html) files into Minecraft commands. 

See `molten --help` for more info.

To configure your project run `moltenmgr config -l`.
To set defaults, use `moltenmgr config -g`.

To list the installed [plugins](http://smelt.gnasp.com/plugins.html), run `moltenmgr plugins --list`.

The configuration directory is `~/.smelt/`.


Documentation
------------

See [the Documentation on the website of the mother project](http://smelt.gnasp.com/docs.html) for more information on *Molten*'s MCC syntax, bang commands, plugins and configuration.

Known bugs
----------

- !init command not working :(

