one-command (beta)
==================
A Minecraft one-command combiner for map makers.

![How it works](./demo/one-command-demo.gif)

Install
-------
* Install [Node](https://nodejs.org).
* Run `npm install one_command -g` so that `one-command` can be used anywhere.

[![NPM](https://nodei.co/npm/one_command.png?downloads=true)](https://nodei.co/npm/one_command/)

Run it
------
* You need to have `.mcc` files using the *Input Syntax* described below.
* Run `one-command /path/to/directory/or/file.mcc`.
* Your compiled commands will be on the `.oc` files with the same name as your `.mcc` files (normally, see switches below).
* Additional switches can be used for more features:
	* Adding the `--debug` (or `-d`) switch outputs extra data into the console.
	* `--show` (or `-s`) shows the compiled commands in the console.
	* `--copy` (or `-c`) will copy the compiled commands to your clipboard (one at a time).
	<br /> This disables the creation of `.oc` files, unless `--write` is also specified.
	* `--write` (or `-w`) will force the compiled commands to be written into `.oc` files, matching the name of each module.

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

See [Docs/Syntax](Docs/Syntax.md) for more information on the *one-command* syntax.


Plugins
-------

See [Docs/Plugins](Docs/Plugins.md) for more information on what plugins are available.

Config files
------------

You can override the default settings by creating a `config.json` file that can go in either your users home directory, or in the root of your project directory
so that 'one-command' will see it when you run it. 

To have settings for all projects, create a file called `[YOUR-HOME-DIRECTORY]/one-command/config.json`.

To have settings for one project, create a file called `[YOUR-PROJECT-DIRECTORY]/one-command/config.json`.

An example of the `config.json` file is:

```
{
    "Output": {
        "ShowDebugInfo" : false,
        "ShowCompiledCommands" : false,
        "CopyCompiledCommands": false,
        "WriteCompiledCommandsToFile": true
    }
    "Commands": {
        "DefaultCommandBlockType": "impulse",
        "DefaultConditionalValue": false,
        "DefaultAutoValue": true
    }
}
``` 

You only need to specify the settings you wish to override.