* [Syntax](./Syntax.md)
* [BangCommands](./BangCommands.md)
* [Plugins](./Plugins.md)
* [Configuration](./Configuration.md)

Smelt's MCC Syntax
==================

There are 4 different types of lines used in the *Smelt* MCC syntax.

1. **New row line (starting with "#")**. <br>
   Used to create a new row of command blocks.
2. **JSON lines (using "{" and "}", always on one line)**. <br>
   Used to set properties for the following commands.
3. **Command lines (starting with "/")**. <br>
   Used to enter Minecraft commands.
4. **Bang command line (starting with "!")**. <br>
   Used to call special commands built into *Smelt* or added via plugins.



Let's consider each of these one at a time:

## 1. The new row line (starting with "#")

Each of these starts a new row of command blocks. 

Any text found after the initial "#" is used to generate a "row marker" (a hidden marker armorstand with the text as the CustomName). 

This helps to recognise rows of command blocks in your Minecraft map.

A line with no text after the "#" can be used to create a gap between your command block rows. No row marker will be created.

## 2. The JSON line (using "{" and "}", always on one line)

For example `{"type":"repeating","auto":true}`. 

This is used to set the properties of all command blocks following until a tag is changed.

Properties available to use are: 

**"type"**

This defines the type of command block that will be used for the following commands.

Possible values are `"impulse"`, `"repeating"` or `"chain"`.

Example: `{"type":"repeating"}`

**"auto"**

This defines whether the following command blocks with be "Always active" (true), or "Require redstone" (false).

Possible values are `true` or `false`. Double quotes should not be used around values on this property.

Example: `{"auto":false}`

**"conditional"**

This defines whether the following command blocks will be "Conditional", meaning that they will only execute 
if the previous command block executes successfully. 

Possible values are `true` or `false`. Double quotes should not be used around values on this property.

Example: `{"conditional":true}`

**"executeAs"**

This defines the executing entity for all following command blocks. 

Currently this only supports one entity selector, but it may be extended to allow for more as a list.

Any valid entity selector, e.g. `{"executeAs":"@a[score_lives=0]"}`

This will be inserted before any following commands as `/execute @a[score_lives=0] ~ ~ ~ /say Hello World`.

Use `{"executeAs":""}` to reset this option.

**"markerTag"**

This is used to define a 'marker' entity (either an ArmorStand or AreaEffectCloud according to the config) to be summoned at the same location as each command block to follow. 
Each marker entity will have the tag provided as the value of `markerTag`. 

This can be useful for targeting a specific command block, or for setting up a random option system.

Possible values are any string that can be used as a scoreboard tag. e.g. `{"markerTag":"randomPowerup"}`.

Use `{"markerTag":""}` to reset this option and stop entities from being summoned in coming command blocks. 

Example use case:

```
# POWERUP OPTIONS
{"type":"impulse", "auto":false, "conditional":false}
{"markerTag":"randomPowerUp"}
    /scoreboard players set @e[name=SYSTEM] power_up_option 1
    /scoreboard players set @e[name=SYSTEM] power_up_option 2
    /scoreboard players set @e[name=SYSTEM] power_up_option 3
    /scoreboard players set @e[name=SYSTEM] power_up_option 4
    /scoreboard players set @e[name=SYSTEM] power_up_option 5
    /scoreboard players set @e[name=SYSTEM] power_up_option 6
{"markerTag":""}

# CYCLE POWERUP OPTIONS
!function CyclePowerups
    {"type":"chain", "conditional":false}
    /execute @e[type=ArmorStand,tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:0b}
    /execute @r[type=ArmorStand,tag=randomPowerUp] ~ ~ ~ blockdata ~ ~ ~ {auto:1b}
```

## 3. The command line (starting with "/")

Each of these commands is converted into the game, and the command-blocks executing them will use the properties 
from the previous JSON tags.

You can use anything on these lines that can be put into a command block in the game.

## 4. The bang command line (starting with "!")

These lines are used to call custom commands built into *Smelt* or available via plugins.

These bang commands will in turn generate a collection of standard commands to be imported into your map.

See [Docs/BangCommands](./BangCommands.md) and [Docs/Plugins](./Plugins.md) for more information.

## Wrapping Lines

Sometimes you might want a command to wrap to the next line because it's just too long. To do this, put the "\" as the END of a line to let *Smelt* know that the command is continuing on the next line.

Example:

```
/say I've got something really lengthy to say. It's going to take a while. It might not squeeze \
on to one line.
```

## Everything else

Other than that, if a line doesn't start with a "#", "{", "/" or "!" then it will be ignored and you can put whatever 
you want. Good for notes.

## Example:

```
# repeatThing
{"type":"repeating","auto":true}
/testfor @e[name=repeatThing]
	{"conditional":true}
	/say repeatThing exists!
		{"type":"chain", "conditional":false}
		/say repeatThing still running!
		/say repeatThing finised!
		
# Another line
{"type":"impulse","auto":false}
/say TEST
	{"type":"chain", "auto":true}
	/say TEST 2
	/say TEST 3
```

This will create the following command-blocks:

A repeating command block, with auto set to true, running the `/testfor @e[name=repeatThing]` command. 

Then a conditional repeating command block, with auto also set to true (inherited from last JSON tag), running the `/say repeatThing exists!` command. 

Then two non-conditional chain command blocks, with auto still set to true as before (still using the previous value, not overwritten in last JSON tag line), running  the following commands: `/say repeatThing still running!` and `/say repeatThing finised!`.

Then a new line of command blocks is started. 

First an inpulse command block, with auto set to false, which would run the command `/say TEST` when executed. 

This is followed by two chain command blocks (still not conditional, since it's still false from the previous reference), but now auto has been set to true, and they would run the following commands when the impulse command is executed; `/say TEST 2` and `/say TEST 2`.