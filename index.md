---
layout: default
title: Home
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

![How it works](./images/smelt-demo.gif)

The Command Line Interface (CLI)
--------------------------------

The main command is `smelt compile`, used to compile your MCC files into Minecraft. 

* [Learn more about the CLI](cli.html)

### Demonstration

Try to demo to see how it works:

* Install Smelt first (see above).
* [Download and unzip](https://github.com/GnaspGames/Smelt-Demo/archive/master.zip) or [git clone](https://github.com/GnaspGames/Smelt-Demo) the Smelt-Demo project.
* Using a command line terminal, navigate to the directory you saved/cloned Smelt-Demo into.
* Run `smelt compile demo.mcc` and then see the `demo.oc` file that is created.
* Go into Minecraft 1.9^
    * Put down a command block in most north-west corner of a spawn chunk.
	* Copy the compiled command from `demo.oc` and enter into the command block.
	* Power the command block with a button (**ON THE SIDE, NOT ON TOP**).
* See the demo command blocks appear.
* *Note:* Run `smelt compile demo.mcc --copy` and instead of a `.oc` file being created, 
   the compiled command will be put copied into your clipboard.

Documentation
-------------

See the [Docs](documentation.html) for more information on *Smelt*'s MCC syntax, bang commands, plugins and configuration.