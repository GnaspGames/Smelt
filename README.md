one-command (beta)
==================
A Minecraft one-command combiner for map makers.

![How it works](https://github.com/GnaspGames/one-command/raw/master/demo/one-command-demo.gif)

Install
-------
* Install Node and `npm`.
* Run `npm install one_command -g` so that `one-command` can be used anywhere.

[![NPM](https://nodei.co/npm/one_command.png)](https://www.npmjs.com/package/one_command)

Run it
------
* You need to have `.mcc` files using the *Input Syntax* described below.
* Run `one-command /path/to/directory/or/file.mcc`.
	* Addng `--debug` outputs extra data into the console.
	* Adding `--output-command` outputs the compacted command to the console.
* Your combined commands will be on the `.oc` files with the same name as your `.mcc` files.

Demonstration
-------------

Download or clone the git repository to try the demo.

* Use a console to navigate to the `demo` directory included.
* Run `one-command demo.mcc` and then see the `demo.oc` file that is created.
* Go into Minecraft 1.9^
    * Put down a command block in most north-west corner of a spawn chunk.
	* Enter the command
	* Power the command block with a button (**NOT ON TOP**) of the command block.
* See the demo command blocks appear.

Input Syntax
------------

There are 4 different types of lines used in the input syntax.

### 1. The new row line (starting with "#")

Each of these starts a new row of command blocks. 

Any text found after the initial "#" is used to generate a "row marker" (a hidden marker armorstand with the text as the CustomName). 

This helps to recognise rows of command blocks in your Minecraft world.

A line with no text after the "#" can be used to create a gap between your command block rows. No row marker will be created.

### 2. The JSON line (using "{" and "}", always on one line)

For example `{"type":"repeating","auto":"true"}`. 

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

This is used to define a 'marker' ArmorStant to be summoned at the same location as each command block to follow. Each marker ArmorStand will have the tag provided as the value of `markerTag`. 

This can be useful for targetting a specific command block, or for setting up a random option system.

Possible values are any string that can be used as a scoreboard tag. e.g. `{"markerTag":"randomPowerup"}`.

Use `{"markerTag":""}` to reset this option and stop ArmorStands from appearing in coming command blocks. 

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

### 3. The command line (starting with "/")

Each of these commands is converted into the game, and the command-blocks executing them will use the properties 
from the previous JSON tags.

You can use anything on these lines that can be put into a command block in the game.

### 4. The bang command line (starting with "!")

These lines are used to call custom commands built into one-command, or available via plugins (see "Plugins" below).

This bang commands will in turn generate a collection of standard commands to be imported into your world.

One example would be the `!math` command, which can be used as follows:

```
!math <objective>.<selector> <operator> <expression>
```

For example:

```
/scoreboard objectives add money dummy
/scoreboard players set lotteryPot money 1337
!math money.@r += (money.lotteryPot - 10) / 2
```

### Wrapping Lines ###

Sometimes you might want a command to wrap to the next line because it's just too long. To do this, put the "\" as the END of a line to let one-command know that the command is continuing on the next line.

Example:

```
/say I've got something really lengthy to say. It's going to take a while. It might not squeeze \
on to one line.
```

### Everything else

Other than that, if a line doesn't start with a "#", "{", "/" or "!" then it will be ignored and you can put whatever 
you want. Good for notes.

### Example:

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
Then a conditional repeating command block, with auto also set to true (inherited from last JSON tag), 
running the `/say repeatThing exists!` command. Then two non-conditional chain command blocks, with auto 
still set to true as before (still using the previous value, not overwritten in last JSON tag line), running 
the following commands: `/say repeatThing still running!` and `/say repeatThing finised!`.

Then a new line of command blocks is started. First an inpulse command block, with auto set to false, which 
would run the command `/say TEST` when executed. This is followed by two chain command blocks (still not conditional, 
since it's still false from the previous reference), but now auto has been set to true, and they would run the following 
commands when the impulse command is executed; `/say TEST 2` and `/say TEST 2`.

Plugins
-------

Now one-command also supports plugins! These can be used to expand the available "bang commands". There will be some bang commands built into one-command, but you can add others. 

Plugins need to be installed into a `/oc-plugins/` directory alongside the .mcc files you plan on processing. You can see an example of this in the `demo` directory included in the git repository for this project. There is a `sayred.js` plugin in the `oc-plugins` directory. You can see this being used in the `plugin-demo.mcc` file.

Plugins can also declare *setup* .mcc files that need to be installed into your world for the commands generated by the plugin to work correctly. 

***Warning:*** The work on plugins will continue and so the API for plugins is subject to change a lot in this early development. 
