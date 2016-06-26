* [Syntax](./Syntax.md)
* [BangCommands](./BangCommands.md)
* [Plugins](./Plugins.md)
* [Configuration](./Configuration.md)

Custom Configuration
====================

You can override some default *one-command* behavours using your own configuration files. 

This is done by creating a `config.json` file that can go in either your users home directory, 
or in the root of your project directory so that *one-command* will use it. 

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

To have settings for all projects, create a file called `[YOUR-HOME-DIRECTORY]/one-command/config.json`.

Example on Windows: `c:\users\gnasp\one-command\config.json`

Project-level configuration
---------------------------

To have settings for one project, create a file called `[YOUR-PROJECT-DIRECTORY]/one-command/config.json`.

Example on Windows: `c:\projects\my-amazing-map\one-command\config.json`