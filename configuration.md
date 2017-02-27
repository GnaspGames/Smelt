---
layout: documentation
title: Configuration
weight: 5
nav: docs
---


Custom Configuration
====================

You can override some default *Smelt* behavours using your own configuration files. 

This is done by creating a `config.json` file that can go in either your users home directory, or in the root of your project directory so that *Smelt* will use it.

The "smelt config" command
--------------------------

To help you manage your config files, you can use `smelt config`. 

There are different switches you can use:

* Adding the `--show` (or `-s`) switch outputs the 'current' settings.
* `--change-local` (or `-l`) will start the wizard to change/create a local configuration file.
* `--change-global` (or `-g`) will start the wizard to change/create a global configuration file.

The file format
---------------

Here's what the default `config.json` looks like:

    {
        "Output":
        {
            "ShowDebugInfo": false,
            "ShowCompiledCommands": false,
            "CopyCompiledCommands": false,
            "WriteCompiledCommandsToFile": true,
            "MinecraftVersion": "1.11"
        },
        "Modules":
        {
            "StartX": 0,
            "StartY": 0,
            "StartZ": 0,
            "StopX": 15,
            "StopY": 15,
            "StopZ": 15,
            "Border": 1
        },
        "Commands":
        {
            "DefaultCommandBlockType": "impulse",
            "DefaultConditionalValue": false,
            "DefaultAutoValue": true,
            "DefaultTrackOutput": false
        },
        "Markers":
        {
            "EntityType": "AreaEffectCloud",
            "SummonFileMarkers": true,
            "SummonRowMarkers": true
        }
    }

You only need to specify the settings you wish to override.

**Global** (user-level) configuration
-------------------------------------

To have settings for all projects, create a file called `[YOUR-HOME-DIRECTORY]/.smelt/config.json`.

Example on Windows: `c:\users\gnasp\.smelt\config.json`

**Local** (project-level) configuration
---------------------------------------

To have settings for one project, create a file called `[YOUR-PROJECT-DIRECTORY]/.smelt/config.json`.

Example on Windows: `c:\projects\my-amazing-map\.smelt\config.json`

