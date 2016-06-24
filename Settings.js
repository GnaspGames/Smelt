var os = require('os');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var jsonOverride = require('json-override');

var Program = require("./Program");

var Settings = 
{
    Current : null,
    Default: null,
    Global: null,
    Local: null,

    ReadConfigs : function()
    {
        // First, use the default config.json packaged with program.
        var defaultsFile = path.resolve(Program.OcDirectory + "/config.json");
        Settings.Default = Settings.ReadConfigFile(defaultsFile);
        
        // Second, look for a GLOBAL config file to override above.
        Settings.Global = Settings.ReadConfigFile(Program.HomeDirectory + "/config.json");
        
        // Third, look for a LOCAL specific config to override above.
        Settings.Local = Settings.ReadConfigFile("oc-config.json");

        // Set "Current" to equal the sum of all
        Settings.Current = Settings.Default;
        if(Settings.Global != null)
            Settings.Current = jsonOverride(Settings.Current, Settings.Global, true);
        if(Settings.Local != null)
            Settings.Current = jsonOverride(Settings.Current, Settings.Local, true);
    },
    ReadConfigFile : function(configPath)
    {
        var settings = null;
        try 
        {
            // Look to see if configPath exists
            configPath = path.resolve(configPath);
            var configString = fs.readFileSync(configPath);
            var configJson = JSON.parse(configString);
            if(configJson != null)
            {
                // Found it
                settings = configJson;
            }
        } 
        catch (err) 
        {
            // console.log(chalk.red.bold("    " + err));
            // console.log(chalk.red.bold("Not found: " + configPath + "!"));
        }
        return settings;
    },
    OutputDebugInfo: function()
    {
        if(Settings.Current.Output.ShowDebugInfo)
        {
            console.log(chalk.bold("\n\n* Using settings:"))
			console.log("  " + JSON.stringify(Settings.Current, null, 4));
        }
    }
}

module.exports = Settings;