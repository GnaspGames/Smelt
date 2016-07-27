---
layout: default
title: README
weight: 1
nav: top
---
Smelt (beta)
==================

Install
-------
* Install [Node](https://nodejs.org).
* Run `npm install smelt-cli -g` so that the `smelt` command can be used anywhere.

[![NPM](https://nodei.co/npm/smelt-cli.png?downloads=true)](https://nodei.co/npm/smelt-cli/)

[Chat online using Discord](https://discord.gg/aDFs2pB)

How it works
------------

![How it works](./demo/smelt-demo.gif)

The Command Line Interface (CLI)
--------------------------------

The main command is `smelt compile`, used to compile your MCC files into Minecraft. 

* [Learn more about the CLI](cli.html)

### Demonstration

Download or clone the [git repository](https://github.com/GnaspGames/Smelt) to try the demo.

* Using a command line terminal, navigate to the `demo` directory included.
* Run `smelt compile demo.mcc` and then see the `demo.oc` file that is created.
* Go into Minecraft 1.9^
    * Put down a command block in most north-west corner of a spawn chunk.
	* Copy the compiled command from `demo.oc` and enter into the command block.
	* Power the command block with a button (**ON THE SIDE, NOT ON TOP**).
* See the demo command blocks appear.

Documentation
-------------

See the [Docs](documentation.html) for more information on *Smelt*'s MCC syntax, bang commands, plugins and configuration.