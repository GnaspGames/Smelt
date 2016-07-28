Command Blocks
--------------

Impulse: command_block
Repeating: repeating_command_block
Chain: chain_command_block

Damage values:
 0 down (also 6 & 14)
 1 up (also 7 & 15)
 2 north
 3 south
 4 west
 5 east

 8 down conditional
 9 up conditional
 10 north conditional
 11 south conditional
 12 west conditional
 13 east conditional

Block positions
---------------

~1 ~-3 ~1 // east
~2 ~-3 ~1 // east
~3 ~-3 ~1 // east
~4 ~-3 ~1 // east
~5 ~-3 ~1 // east
~6 ~-3 ~1 // east
~7 ~-3 ~1 // east
~8 ~-3 ~1 // east
~9 ~-3 ~1 // east
~10 ~-3 ~1 // east
~11 ~-3 ~1 // east
~12 ~-3 ~1 // east
~13 ~-3 ~1 // east
~14 ~-3 ~1 // facing up
~1 ~-2 ~1 // west
~2 ~-2 ~1 // west
~3 ~-2 ~1 // west
~4 ~-2 ~1 // west
~5 ~-2 ~1 // west
~6 ~-2 ~1 // west
~7 ~-2 ~1 // west
~8 ~-2 ~1 // west
~9 ~-2 ~1 // west
~10 ~-2 ~1 // west
~11 ~-2 ~1 // west
~12 ~-2 ~1 // west
~13 ~-2 ~1 // west
~14 ~-2 ~1 // facing up

REDDIT POST:

***Smelt*** by Gnasp
------------------------------------------

**Smelt** is a CLI tool used to compile Minecraft commands into combined-command installers.

Designed specifically for map makers who organise their command-blocks on a spawn-chunks "board".

It allows you to write out all of your commands in .mcc files (using a special syntax) and then converts each file into combined commands (in .oc files) to import into your world.

Each .mcc file should represent the command-blocks in a one-chunk area.

You need [Node](https://nodejs.org/en/) to install, then install using Node package manager:

`npm install smelt-cli -g`

Find out more at 

* [smelt.gnasp.com](http://smelt.gnasp.com)
* [Example GIF](https://raw.githubusercontent.com/GnaspGames/smelt/master/demo/smelt-demo.gif)
* [Github repo](https://github.com/GnaspGames/smelt)
* [Report bugs & submit ideas](https://github.com/GnaspGames/smelt/issues)


Steps to update USER settings to Smelt
--------------------------------------

`cd ~`

Run same commands as per project

Steps to update a project to Smelt
----------------------------------

`mkdir .smelt`

`mv one-command/* .smelt/`

`rm -rf one-command/`





