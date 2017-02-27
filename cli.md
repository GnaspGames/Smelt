---
layout: documentation
title: The CLI
weight: 0
nav: docs
---

The Command Line Interface (CLI)
================================

* [smelt help](#-smelt-help)
* [smelt help compile](#-smelt-help-compile)
* [smelt help config](#-smelt-help-config)
* [smelt help plugins](#-smelt-help-plugins)

$ smelt help
------------

Usage: `smelt [command] <options>`

### Commands:

    compile <path> [options]  Compile .mcc modules: <path> should be the path to an .mcc file or directory containing .mcc files
    config [options]          Create/modify user and project level configurations.
    plugins [options]         Install/manage plugins.
    help [cmd]                display help for [cmd]

### Options:

    -h, --help                Output usage information
    -V, --version             Output the version number

$ smelt help compile
--------------------

Usage: `smelt compile <path> [options]`

`<path>` should be the path to a .mcc file or directory containing .mcc files.

**Note:** Your .mcc files must match [the MCC Syntax](syntax.html).

### Options:

    -h, --help     Output usage information
    -V, --version  Output the version number
    -s, --show     Show any combined commands in the console.
    -d, --debug    Show additional debug information in the console.
    -c, --copy     Copy combined commands to system clipboard, one at a time. 
                   This prevents the writing of .oc files unless --write is also included.
    -w, --write    Write combined commands to .oc files.


$ smelt help config
--------------------

Usage:  smelt config [options]  

Create/modify user and project level configurations.

### Options:

    -h, --help           Output usage information
    -s, --show           Show what settings are currently being used.
    -l, --change-local   Change (or create) the local config file to customise behaviour in this project.
    -g, --change-global  Change (or create) the global config file to customise behaviour for all projects.

**Note:** See the [Configuration docs](configuration.html) for more information.

$ smelt help plugins
--------------------

Usage: `smelt plugins [options]`

Manage plugins.

### Options:

    -h, --help  output usage information
    --list  List all available plugins.