---
layout: documentation
title: Plugins
weight: 4
nav: docs
---

Plugins
=======

> **NEW:** <br>
  [smelt.getPreviousCommandBlock()](#smeltgetpreviouscommandblock) <br>
  [smelt.getCurrentCommandBlock()](#smeltgetcurrentcommandblock) <br>

Now *Smelt* also supports plugins! These can be used to add to the 
available "bang commands" built into *Smelt*.

Plugins need to be installed into a `/.smelt/plugins/` directory; either 
alongside the .mcc files or in your "user" directory.

You can see an example of this in the `demo` directory included in the git repository 
for this project. There is a `sayred.js` plugin in the `/.smelt/plugins/` directory. 
You can see this being used in the `demo.mcc` file.

Plugins can also declare *setup modules* as included .mcc files that need to be installed into your map 
for the plugin to work correctly. 

> ***Warning:*** The API for plugins is still a work in progress, some areas are subject to change in later versions.

Building a plugin
-----------------

Building a plugin is as easy as writing JavaScript. That's because they are written in JavaScript!

In addition, plugins are runin NodeJS, so you can also use any native node modules (such as 'util').

A basic plugin called `!sayred` would be written in a file called `sayred.js`. The code inside would be:


    var util = require("util");

    var SayRed = {}

    SayRed.Install = function(smelt)
    {
        smelt.addSupportModule("sayred-setup.mcc");
    }

    SayRed.Execute = function(smelt)
    {
        var message = smelt.args.join(" ");
        
        var command = "/tellraw @a [{\"text\":\"%s\",\"color\":\"red\"}]";
        
        smelt.addCommandBlock(util.format(command, message));
    }

    module.exports = SayRed;

Notice that the plugin receives a `smelt` object, receives command arguments via `smelt.args`, 
and uses two callback functions, `smelt.addCommandBlock()` and `smelt.addSupportModule()`.

## The `smelt` object

Here are the properties and functions available via the `smelt` object.

### smelt.args

This property is used to access the 'arguments' sent to the plugin bang command. For example:

    !start_event StartGame 20

In this above example, `smelt.args[0]` would equal "StartGame", `smelt.args[1]` would equal "20".

> Note; this is just an example, the built in `!start_event` bang command only uses 1 argument.

### smelt.settings

This property gives plugins a window into the current Smelt configuration settings. This allows plugins to use
those settings to change behavious. For example; to know if the user wants additional debug information a plugins can 
do the following:

    if(smelt.settings.Output.ShowDebugInfo)
    {
        console.log("Additional Debug Info Goes Here");
    }

### smelt.addCommandBlock(command, options)

The `addCommandBlock` function can be used many times to create the Minecraft 
commands that your plugin generates. 

The first parameter is the `command` string. 

The second parameter is optional, and can take additional `options` for 
that command simular to the JSON properties used in the `.mcc` syntax.


    smelt.addCommandBlock("/testfor Gnasp", {type:"repeating",auto:true,conditional:false});

### smelt.getPreviousCommandBlock()

This function returns a `CommandBlock` object; in this case one that represents the *previous* command block
processed. This can be used to check some of the properties on the previous command block, and to get the coordinates 
relative to the current command block. 

See [`CommandBlock`](#the-commandblock-object) below for documentation.

### smelt.getCurrentCommandBlock()

This function returns a `CommandBlock` object; in this case one that represents the *current* command block
that will be created when `addCommandBlock` is used. This can be used to check settings, such as `auto` or `conditional`,
to allow your plugin to respect the value set by the user.

See [`CommandBlock`](#the-commandblock-object) below for documentation.

### smelt.addSupportModule(filename)

The `addSupportModule` function is used to also tell *Smelt* that for this plugin to work, 
another command module needs to be installed into the map. 

The file referenced has to be included alongside your JavaScript file.

    smelt.addSupportModule("sayred-setup.mcc");

### smelt.addInitCommand(command)

This can be used to add a Minecraft command that is to be executed when the combined-command is run 
(when the MCC module is rebuild). This allows for simple support commands to be run that don't really require
a full support module (see `smelt.addSupportModule()`).

For example; This could be used to make sure that a scoreboard objective exists.

### smelt.setVariable(varName, varValue)

This is used to set variables that can be access by the MCC code after the plugin command is called. 

For example; the plugin may take a variable names as an arguments, and then by setting the value of those variables
it can be used to return multiple 'out' values without generating any command blocks.

### smelt.getVariable(varName)

This can be used to get the current value of a variable. This can be used as an alternative to accepting arguments, 
or simply to make changes to a predefined variable for some purpose.

## The `CommandBlock` object

Here are the properties and functions available on the `CommandBlock` object.

### CommandBlock.x, CommandBlock.y and CommandBlock.z

The `x`, `y` and `z` properties represent the coordinates of the resulting command block
*relative to the module executor*. 

> **Note:** The module executor is currently 1 block above the command block used to run the 
combined command. In most cases these coordinates won't be very useful. These properties will quite probably
change in a future version of Smelt. 

### CommandBlock.direction

This property holds the direction that the command block will be facing. Values can be 
either "north", "south", "east", "west", "up" or "down".

### CommandBlock.type

This property holds the "type" of the command block, as specified in the MCC JSON properties.

For example: "impulse", "repeating" or "chain". See [JSON properties](syntax.html#json-properties).

### CommandBlock.conditional

This property holds the "conditional" value (boolean) of the command block, as specified in the MCC JSON properties.

See [JSON properties](syntax.html#json-properties).

### CommandBlock.auto

This property holds the "conditional" value (boolean) of the command block, as specified in the MCC JSON properties.

See [JSON properties](syntax.html#json-properties).

### CommandBlock.getRelativeX(), CommandBlock.getRelativeY() and CommandBlock.getRelativeZ()

These functions allow access to the coordinates of the resulting command block *relative to the **current** command block*.

This can be useful to allow a command block to target one of the previous command blocks using a `blockdata` or `testforblock`
command. 