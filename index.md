---
layout: default
title: Home
weight: 1
nav: top
---

Smelt
=====

How to install
--------------

Smelt is a command line interface (CLI) tool, so you need to use command line on your computer.

* First, install [Node](https://nodejs.org) on your computer.
* Then, in a command line prompt run `npm install smelt-cli -g` so that the `smelt` command can be used.

> Want to live on the *cutting edge*? Try the [pre-release version](prereleases.html).

### Installation statistics

[![NPM](https://nodei.co/npm/smelt-cli.png?downloads=true)](https://nodei.co/npm/smelt-cli/)

### Need more help?

* [Ask for help on the Discord channel](https://discord.gg/aDFs2pB)

How it works (animated gif)
---------------------------

A visual example of how Smelt works:

![How it works](./images/smelt-demo.gif)

**Please note** the animated gif above shows an old version; the `smelt events.mcc` command would now be `smelt compile events.mcc`.

The Command Line Interface (CLI)
--------------------------------

The main command is `smelt compile`, used to compile your MCC files into Minecraft. 

* [Learn more about the CLI](cli.html)

Demonstration
-------------

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

*Note:* Run `smelt compile demo.mcc --copy` and instead of a `.oc` file being created, the compiled command will be put copied into your clipboard.

Documentation
-------------

See the [Docs](docs.html) for more information on *Smelt*'s MCC syntax, bang commands, plugins and configuration.
