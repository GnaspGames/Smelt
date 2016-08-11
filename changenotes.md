---
layout: default
title: Changes
weight: 6
nav: top
---

Smelt Change Notes
==================

Version 0.9.2
-------------

* Major changes to how plugins work. The [plugins](plugins.html) documentation has been updated
  to reflect the changes.
    * **Note:** This has been done to be backwards compatible with old plugins. In time that compatibility will be removed.
* Variables can now be 'used' like `/say Hello $name` **in addition to** being used like `/say Hello ${name}`
    * The syntax without brackets can only be used with the variable is **not** being used as part of a word.
      `/say $nameIsCool` will not work for the `$name` variable, using `/say ${name}IsCool` will work.

Version 0.9.1
-------------

* Fix issue with "bang-commands-setup.mcc" not using latest syntax changes.

Version 0.9.0
-------------

* **BREAKING CHANGE:** Variables are used differently now:
    * To use a variable, it must be referenced like this: `/say Hello ${name}`
    * Defining the variable is still the same: `$name = Gnasp`
* Added two new possible `type` values that can used in JSON properties:
    * `repeating-chain` will cause the next command block to be a repeating one, and then after that chain command blocks.
    * `impulse-chain` likewise means one impulse command block, then chain command blocks.
    * *Note:* this feature will not work when passing an options object in plugins.

Version 0.8.3
-------------

* Fixed: [Issue #41](https://github.com/GnaspGames/Smelt/issues/41) - Parsing Indentations with “Tab” working incorrectly

Version 0.8.2
-------------

* Fixed: [issue with !math command](https://github.com/GnaspGames/Smelt/pull/47).

Version 0.8.1
-------------

* Fixed: [Issue #45](https://github.com/GnaspGames/Smelt/issues/45) - Lines containing a URL ignored due to //
    * Comment removing has been improved now.
* Fixed: [Issue #46](https://github.com/GnaspGames/Smelt/issues/46) - Variables should be trimmed`

Version 0.8.0
-------------

* Introducing Variables!
    * See the [syntax#variables documentation](http://smelt.gnasp.com/syntax.html#variables) for more info.
* Multiline commands supported. 
    * **BREAKING CHANGE**: Backslash (`\`) feature removed.
    * **BREAKING CHANGE**: Now JSON blocks need a `>` character preceding them. 
      You MCC code will need to be updated.
    * JSON, Minecraft commands, and Bang commands can now span multiple lines.
        * Any new line starting with a trigger character (`#`,`>`,`/`,`!`,`$`) 
          will finalise the previous line.
* C-style and C++-style commenting now supported. See example below.

Example:

    // Declare variables - single line comment
    $Name=Johann
    $NameAndTitle=Mr $Name
    $Message=Hello $Name

    #Start
    >{"type":"impulse",
      "auto":true}
    /say $Name
        >{"type":"chain"}
        /say $Message
        /*
            Example of a multiline comment
        */ 
        $Message=Goodbye $NameAndTitle
        /say $Message // The message has changed!

Output:

    [@] Johann
    [@] Hello Johann
    [@] Goodbye Mr Johann


Many thanks to [Johann/Skaran](https://twitter.com/SkaranYT) for is contributions towards these features!

Version 0.7.5
-------------

* Fixed a line endings bug issue that stopped Smelt working on Linux OS.

Version 0.7.4
-------------

* Added a version check to encourage you to update if your version of Smelt is out of date.

Version 0.7.3
-------------

* Updated some of the help output. `smelt help`, `smelt help compile` etc.
    * More details found in the [CLI documentation](http://smelt.gnasp.com/cli.html)

Version 0.7.2
-------------

* Improved the use of `smelt config --change-local` and `smelt config --change-global` to be faster to use.
    * Includes adding a description and validation for each setting.
* Changed the name of the configuration setting `SummonLineMarkers` to `SummonRowMarkers` because the term 'row' is what's been used elsewhere.
    * NOTE: This might require some users to run `smelt config --change-local` or `smelt config --change-global` again to correct their own config files.