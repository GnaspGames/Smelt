one-command (beta)
==================
A Minecraft one-command combiner for map makers.

![How it works](https://github.com/GnaspGames/one-command/raw/master/demo/one-command-demo.gif)

Install
-------
* Install Node and `npm`.
* Run `npm install one_command -g` so that `one-command` can be used anywhere.

Run it
------
* You need to have `.mcc` files using the *Input Syntax* described below.
* Run `one-command /path/to/directory/or/file.mcc`.
	* `one-command /path/to/file.mcc debug` outputs extra data into the console.
	* `one-command /path/to/file.mcc output-command` outputs the compacted command the console.
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

There are 3 different types of lines used in the input syntax.

### 1. The NEW line (starting with "#")

Each of these starts a new line of command blocks. 

Any text found after the initial "#" is used to generate a "line marker" (a hidden marker armorstand with the text as the CustomName). 

This helps to recognise lines of command blocks in your Minecraft world.

Use a line with no text after the "#" to create a gap between your command block lines. No line marker will be created.

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

### 3. The command line (starting with "/")

Each of these commands is converted into the game, and the command-blocks executing them will use the properties 
from the previous JSON tags.

You can use anything on these lines that can be put into a command block in the game.

### Everything else

Other than that, if a line doesn't start with a "#", "{", or "/" then it will be ignored and you can put whatever 
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
