---
layout: documentation
title: Syntax
weight: 2
nav: docs
---

Smelt's MCC Syntax
==================

There are 5 different *triggers* used in the Smelt MCC syntax. 
A trigger is used to specify what will be in the following lines.

1. The *hash* **`#`** triggers a **new command block row**. <br>
   Used to create a new row of command blocks. 
   Text after the `#` is used to label the row.
2. The *right angle bracket* **`>`** trigger is for **JSON properties**. <br>
   A valid JSON string (in curly `{}` brackets) is then used 
   to set properties for the commands.
3. The *dollar* **`$`** is used to **define variables**.
4. The **`/`** *slash* is used to write **Minecraft commands**. <br>
5. The *exclamation* **`!`** trigger is used to execute **Smelt's bang commands**.

Let's consider each of these one at a time:

## **#** New command block row

Each of these starts a new row of command blocks. 

Any text found after the initial "#" is used to generate a "row marker" (a hidden marker entity with the text as the CustomName). 

This helps to recognise rows of command blocks in your Minecraft map.

A line with no text after the "#" can be used to create a gap between your command block rows. No row marker will be created.

## **>** JSON properties

After the `>` character, the rest of the content should be valid JSON using curly brackets `{}`.

For example `>{"type":"repeating","auto":true}`. 

This is used to set the properties of all command blocks following until a tag is changed.

Properties available to use are: 

**"type"**

This defines the type of command block that will be used for the following commands.

Possible values are `"impulse"`, `"repeating"` or `"chain"`.

Example: `>{"type":"repeating"}`

**"auto"**

This defines whether the following command blocks with be "Always active" (true), or "Require redstone" (false).

Possible values are `true` or `false`. Double quotes should not be used around values on this property.

Example: `>{"auto":false}`

**"conditional"**

This defines whether the following command blocks will be "Conditional", meaning that they will only execute 
if the previous command block executes successfully. 

Possible values are `true` or `false`. Double quotes should not be used around values on this property.

Example: `>{"conditional":true}`

**"executeAs"**

This defines the executing entity for all following command blocks. 

Currently this only supports one entity selector, but it may be extended to allow for more as a list.

Any valid entity selector, e.g. `>{"executeAs":"@a[score_lives=0]"}`

This will be inserted before any following commands as `/execute @a[score_lives=0] ~ ~ ~ /say Hello World`.

Use `>{"executeAs":""}` to reset this option.

**"markerTag"**

This is used to define a 'marker' entity (either an ArmorStand or AreaEffectCloud according to the config) to be summoned at the same location as each command block to follow. 
Each marker entity will have the tag provided as the value of `markerTag`. 

This can be useful for targeting a specific command block, or for setting up a random option system.

Possible values are any string that can be used as a scoreboard tag. e.g. `>{"markerTag":"randomPowerup"}`.

Use `>{"markerTag":""}` to reset this option and stop entities from being summoned in coming command blocks. 

Example use case:


    # POWERUP OPTIONS
    >{"type":"impulse", "auto":false, "conditional":false}
    >{"markerTag":"randomPowerUp"}
        /scoreboard players set @e[name=SYSTEM] power_up_option 1
        /scoreboard players set @e[name=SYSTEM] power_up_option 2
        /scoreboard players set @e[name=SYSTEM] power_up_option 3
        /scoreboard players set @e[name=SYSTEM] power_up_option 4
        /scoreboard players set @e[name=SYSTEM] power_up_option 5
        /scoreboard players set @e[name=SYSTEM] power_up_option 6
    >{"markerTag":""}

    # CYCLE POWERUP OPTIONS
    !event CyclePowerups
        >{"type":"chain", "conditional":false}
        /execute @e[tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:0b}
        /execute @r[tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:1b}


## **$** Variables

Variables can be declared, one per line, like so:

    $name=Gnasp

Then any instance of that variable after other triggers will be replaced with the value assigned.

    /say Hello $name! Good to see you.

Output: `[@] Hello Gnasp! Good to see you.`

You can even add variables values to other definitions:

    $name=Gnasp
    $nameAndTitle=Mr $name
    
    /say Good day $nameAndTitle!

Output: `[@] Good day Mr Gnasp!`

## **/** Minecraft commands

Each of these commands is converted into the game, and the command-blocks executing them will use the properties 
from the previous JSON tags.

You can use anything on these that can be put into a command block in the game.

## **!** Bang commands

These are used to call custom commands built into *Smelt* or available via plugins.

A bang command will in turn generate standard Minecraft commands to be imported into your map.

See [Docs/BangCommands](bangcommands.html) and [Docs/Plugins](plugins.html) for more information.

## Wrapping Lines

Sometimes you might want a command to wrap to the next line because it's just too long. 
Smelt now automatically expects this. Unless a trigger character is found at the beginning 
of a line, Smelt will consider each line to be a continuation of the last line. 

Example:


    /say I've got something really lengthy to say. 
    It's going to take a while. 
    It might not squeeze onto one line.

Output: `[@] I've got something really lengthy to say. It's going to take a while. It might not squeeze onto one line.`

Each concatenated line will be added to the last with an additional 
space included.

## Example:

    $name=Gnasp
    # repeatThing
    >{"type":"repeating","auto":true}
    /testfor @e[name=repeatThing]
        >{"conditional":true}
        /say repeatThing exists!
            >{"type":"chain", "conditional":false}
            /say Hi $name!
            /say repeatThing finised!
            
    # Another line
    >{"type":"impulse","auto":false}
    /say TEST
        >{"type":"chain", "auto":true}
        /say TEST 2
        /say TEST 3

This will create the following command-blocks:

* A repeating command block, with auto set to true, running the `/testfor @e[name=repeatThing]` command. 
* Then a conditional repeating command block, with auto also set to true (inherited from last JSON tag), running the `/say repeatThing exists!` command. 
* Then two non-conditional chain command blocks, with auto still set to true as before (still using the previous value, not overwritten in last JSON tag line), running  the following commands: `/say Hi Gnasp!` and `/say repeatThing finised!`.
* Then a new line of command blocks is started. 
* First an impulse command block, with auto set to false, which would run the command `/say TEST` when executed. 
* This is followed by two chain command blocks (still not conditional, since it's still false from the previous reference), but now auto has been set to true, and they would run the following commands when the impulse command is executed; `/say TEST 2` and `/say TEST 2`.