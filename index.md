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


Smelt CLI
---------

The main command is `smelt compile`, used to compile your MCC files into Minecraft. 

* You need to have `.mcc` files using the *MCC Syntax* described below.
* Run `smelt compile /path/to/directory/or/file.mcc`.
* Your compiled commands will be on the `.oc` files with the same name as your `.mcc` files (normally, see switches below).
* Additional switches can be used for more features:
	* Adding the `--debug` (or `-d`) switch outputs extra data into the console.
	* `--show` (or `-s`) shows the compiled commands in the console.
	* `--copy` (or `-c`) will copy the compiled commands to your clipboard (one at a time).
	<br /> This disables creation of `.oc` files, unless `--write` is also specified.
	* `--write` (or `-w`) will force the compiled commands to be written into `.oc` files, matching the name of each module.

In addition, there is also `smelt config` and `smelt plugins`, please see the *Configuration* and *Plugins* documentation for more information.

Demonstration
-------------

Download or clone the git repository to try the demo.

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