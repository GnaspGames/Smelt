one-command (beta)
==================
A Minecraft one-command combiner for map makers.

![How it works](demo/one-command-demo.gif)

Install
-------
* Install Node and `npm`.
* Download the ZIP and unzip, or clone with git.
* Use a console to navigate to the directory you clones/unzipped into.
* Run `npm install -g` so that `one-command` can be used anywhere.

Run it
------
* You need to have `.mcc` files using the *Input Syntax* described below.
* Run `one-command /path/to/directory/or/file.mcc`.
	* `one-command /path/to/file.mcc debug` outputs extra data into the console.
	* `one-command /path/to/file.mcc output-command` outputs the compacted command the console.
* Your combined commands will be on the `.oc` files with the same name as your `.mcc` files.

Demonstration
-------------

* Use a console to navigate to the `demo` directory included.
* Run `one-command demo.mcc` and then see the `demo.oc` file that is created.
* Go into Minecraft 1.9^
    * Put down a command block in most north-west corner of a spawn chunk.
	* Enter the command
	* Put a redstone block **ON TOP** of the command block.
* See the demo command blocks appear.

Input Syntax
------------

There are 3 different types of lines used in the input syntax.

1. The "#" line, which depicts a new line of command blocks. I might add a feature for you to add text here that would be displayed on a wooden sign.
2. The JSON tags line (e.g. `{"type":"repeating","auto":"true"}`) which is used to set the properties of all command blocks following until a tag is changed.
3. The command lines, which need to always start with a "/". Each of these commands is converted into the game, and the command-blocks executing them will use the properties from the previous JSON tags.

Other than that, if a line doesn't start with a "#", "{", or "/" then it will be ignored and you can put whatever you want. Good for notes.

Example:

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
{"type":"inpulse","auto":false}
/say TEST
	{"type":"chain", "auto":true}
	/say TEST 2
	/say TEST 3
```

This will create the following command-blocks:

A repeating command block, with auto set to true, running the `/testfor @e[name=repeatThing]` command. Then a conditional repeating command block, with auto also set to true (inherited from last JSON tag), running the `/say repeatThing exists!` command. Then two non-conditional chain command blocks, with auto still set to true as before (still using the previous value, not overwritten in last JSON tag line), running the following commands: `/say repeatThing still running!` and `/say repeatThing finised!`.

Then a new line of command blocks is started. First an inpulse command block, with auto set to false, which would run the command `/say TEST` when executed. This is followed by two chain command blocks (still not conditional, since it's still false from the previous reference), but now auto has been set to true, and they would run the following commands when the impulse command is executed; `/say TEST 2` and `/say TEST 2`.
