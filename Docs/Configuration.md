* [Syntax](./Syntax.md)
* [BangCommands](./BangCommands.md)
* [Plugins](./Plugins.md)
* [Configuration](./Configuration.md)

Custom Configuration
====================

You can override some default *Smelt* behavours using your own configuration files. 

This is done by creating a `config.json` file that can go in either your users home directory, 
or in the root of your project directory so that *Smelt* will use it. 

The file format
---------------

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

User-level configuration
------------------------

To have settings for all projects, create a file called `[YOUR-HOME-DIRECTORY]/.smelt/config.json`.

Example on Windows: `c:\users\gnasp\.smelt\config.json`

Project-level configuration
---------------------------

To have settings for one project, create a file called `[YOUR-PROJECT-DIRECTORY]/.smelt/config.json`.

Example on Windows: `c:\projects\my-amazing-map\.smelt\config.json`