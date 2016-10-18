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

### Versions 1.1.0-pre1 to 1.1.0-pre4

* New configuration `MinecraftVersion` setting to add support for 1.11 commands (Work in progress)
* New configuration `Modules` settings (`StartX`, `StopX` etc) for specifying module sizes (see example below).
* `DefaultTrackOutput` setting and new `trackOutput` JSON property support. 
    * A `false` value adds `TrackOutput:0b` to command blocks. `true` doesn't add anything.
* Output command length and percentage into terminal for easy reference.
* Fix marker entites being 1 block too high (introduced during pre-releases only)
* Change the conditional corners feature to use `SuccessCount:0b`.
    * A long term fix is required.
* Large refactoring of some code. Bugs may have been added.

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







