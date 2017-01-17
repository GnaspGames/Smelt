---
layout: default
title: Pre-releases
---

Smelt Pre-releases
==================

## 1.1.0 Pre-Releases

Work has begun on version 1.1.0.

To install a pre-release use the following command: `npm install smelt-cli@pre -g`

**Warning;** there will be bugs!

## Pre-release change notes

### Version 1.1.0-pre9

* Fix for bug with `moduleStartY` and `moduleStartZ`. ([see #82](https://github.com/GnaspGames/Smelt/issues/82)).

### Version 1.1.0-pre8

* Additional fix for the conditional corners bug. ([see #68](https://github.com/GnaspGames/Smelt/issues/68)).
    * This should also be considered the long term fix since it will now work for future layout changes.

### Version 1.1.0-pre7

* Minecraft 1.11 output is now the default output, since that's the current version of Minecraft. 
    * Use the `smelt config --change-local` command to switch to 1.9/1.10 output on a specific project.
* The physical size of a module (.mcc file) in Minecraft can now be changed **within each .mcc file**. 
    * This overrides any `Modules` settings in `config.json` files.
	* Use the following JSON properties at the start of the file:
		```
		>{
			"moduleStartX": 0,
			"moduleStartY": 0,
			"moduleStartZ": 0,
			"moduleStopX": 15,
			"moduleStopY": 15,
			"moduleStopZ": 15,
			"moduleBorder": 1
		}
		```

### Version 1.1.0-pre6

* First version of watch feature
    * The `smelt compile YOURFILE.mcc --watch` command will automatically compile the watched file(s) when they change.
	* This has only beed tested on Windows so far.
* Chain behaviour of `impulse-chain` and `repeating-chain`
    * In addition to automatically switching to chain blocks, Smelt will also automatically change to `auto:true`. 

### Version 1.1.0-pre5

* Bug fixes from 1.0.3 and 1.0.4 
* `DefaultTrackOutput` setting and new `trackOutput` JSON property support. 
    * A `false` value adds `TrackOutput:0b` to command blocks. `true` doesn't add anything.
* Output command length and percentage into terminal for easy reference.
* Fix marker entites being 1 block too high (introduced during pre-releases only)
* Change the conditional corners feature to use `SuccessCount:0b`.
    * A long term fix is required. ([see #68](https://github.com/GnaspGames/Smelt/issues/68)).
* Large refactoring of some code. Bugs may have been added.

### Versions 1.1.0-pre1 to 1.1.0-pre4

* New configuration `MinecraftVersion` setting to add support for 1.11 commands (Work in progress)
* New configuration `Modules` settings (`StartX`, `StopX` etc) for specifying module sizes (see example below).

Example of 1.1.0 pre-release `config.json`:

	{
		"Output":
		{
			"ShowDebugInfo": false,
			"ShowCompiledCommands": false,
			"CopyCompiledCommands": false,
			"WriteCompiledCommandsToFile": true,
			"MinecraftVersion": "1.10"
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







