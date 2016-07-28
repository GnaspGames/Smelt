var chalk = require('chalk');

var VersionCheck = 
{
    Query : function()
    {
        var cv;
        var needle = require('needle');
        var self = this;

        function req(method, url) {
            var data, callback, isJSON;
            if (typeof(arguments[2]) === 'function') callback = arguments[2]; else (data = arguments[2], callback = arguments[3]);
            isJSON = (function() {
                if (typeof(data) === 'object') if (data.qs) return (delete data.qs, false); else return true;
                return false;
            })();
            return needle.request(method, url, data, { multipart: (typeof(data) === 'object' && !!data.file), headers: messageHeaders(), json: isJSON }, callback);
        }

        function messageHeaders() {
                var r = {
                    "accept": "*/*",
                    "accept-encoding": "gzip, deflate",
                    "accept-language": "en-US;q=0.8",
                    "dnt": "1",
                    "user-agent": "Smelt-CLI (https://smelt.gnasp.com, " + cv + ")"
                };
                return r;
            }
        
        /*Version check*/
        try {
            cv = require('./package.json').version;
            req('get', "https://registry.npmjs.org/smelt-cli", function(err, res) {
                if (err) return;
                try { uv = res.body['dist-tags'].latest; } catch(e) {return;}
                if (cv !== uv)
                {
                    console.log(chalk.red.bold("\n  [WARNING]: Your verion of Smelt (" + cv + ") is out of date. Please update to version " + uv + ".")); 
                    console.log("  Command to update: " + chalk.bold("npm install smelt-cli -g")); 
                }
            });
        } 
        catch(e) 
        {
            console.log(e);
        }
    }
};

module.exports = VersionCheck;
	
    
