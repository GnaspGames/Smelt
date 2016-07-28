---
layout: default
title: Changes
weight: 6
nav: top
---

Smelt Change Notes
==================

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