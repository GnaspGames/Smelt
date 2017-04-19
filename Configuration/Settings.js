var os = require('os');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var jsonOverride = require('json-override');

var Paths = require("../Tools/Paths");

var Settings = 
{
    Current : null,
    Default: null,
    Global: null,
    Local: null,
    GlobalPath : null,
    LocalPath : null,
    GlobalExists : false,
    LocalExists : false,

    ReadConfigs : function()
    {
        Settings.GlobalPath = Paths.HomeDirectory + "/config.json";
        Settings.LocalPath = path.resolve(".smelt/config.json");
        
        // First, use the default config.json packaged with program.
        var defaultsFile = path.resolve(Paths.OcDirectory + "/Configuration/Files/defaultValues.json");
        Settings.Default = Settings.ReadJsonFile(defaultsFile);
        
        // Second, look for a GLOBAL config file to override above.
        Settings.Global = Settings.ReadJsonFile(Settings.GlobalPath);
        Settings.GlobalExists = (Settings.Global != null);
        
        // Third, look for a LOCAL specific config to override above.
        Settings.Local = Settings.ReadJsonFile(Settings.LocalPath);
        Settings.LocalExists = (Settings.Local != null);

        // Set "Current" to equal the sum of all
        Settings.Current = Settings.Default;
        if(Settings.Global != null)
            Settings.Current = jsonOverride(Settings.Current, Settings.Global, true);
        if(Settings.Local != null)
            Settings.Current = jsonOverride(Settings.Current, Settings.Local, true);
    },
    GetDescriptions : function()
    {
        var filepath = path.resolve(Paths.OcDirectory + "/Configuration/Files/descriptions.json");
        return Settings.ReadJsonFile(filepath);
    },
    GetValidValues : function()
    {
        var filepath = path.resolve(Paths.OcDirectory + "/Configuration/Files/validValues.json");
        return Settings.ReadJsonFile(filepath);
    },
    CheckValueIsValid : function(section, key, value)
    {
        isValid = false;
        var allValidValues = Settings.GetValidValues();
        var validValuesData = allValidValues[section][key];

        if(Array.isArray(validValuesData))
        {
            var validValuesArray = validValuesData;
            if(validValuesArray.indexOf(value) > -1)
                isValid = true;
        }
        else
        {
            switch (validValuesData) 
            {
                case "boolean":
                    if(typeof(value) === "boolean")
                        isValid = true;
                    break;
                case "integer":
                    if(Number.isInteger(value))
                        isValid = true;
                    break;
                case "string":
                    if(typeof(value) === "string") isValid= true;
                    break;
            }
        }

        return isValid;
    },
    ConvertInputValue : function(section, key, value)
    {
        var validValuesData = Settings.GetValidValues()[section][key];
        if (!Array.isArray(validValuesData))
        {
            switch (validValuesData) 
            {
                case "boolean":
                    // Convert to boolean type
                    if(value == "true") 
                        value = true;
                    else if(value == "false") 
                        value = false;
                    break;
                case "integer":
                    if (!isNaN(value))
                    {
                        // Convert to a number for validation.
                        var value = parseFloat(value);
                    }
                    break;
            }
        }
        return value;
    },
    ReadJsonFile : function(filePath)
    {
        var json = null;
        try 
        {
            // Look to see if configPath exists
            filePath = path.resolve(filePath);
            var contentString = fs.readFileSync(filePath);
            var contentJSON = JSON.parse(contentString);
            if(contentJSON != null)
            {
                // Found it
                json = contentJSON;
            }
        } 
        catch (err) 
        {
            // console.log(chalk.red.bold("    " + err));
            // console.log(chalk.red.bold("Not found: " + configPath + "!"));
        }
        return json;
    },
    GetConfig : function(options)
    {
        // Start with default app settings
        var template = Settings.Default;

        if(options.includeGlobal)
        {
            // If a global config exists, override default settings with this
            if(Settings.GlobalExists)
                template = jsonOverride(template, Settings.Global, true);
        }

        if(options.includeLocal)
        {
            // If a global config exists, override default settings with this
            if(Settings.LocalExists)
                template = jsonOverride(template, Settings.Local, true);
        }

        return template;
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

Settings.ReadConfigs();

module.exports = Settings;