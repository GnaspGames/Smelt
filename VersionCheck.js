var chalk = require('chalk');
var semver = require('semver');


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
            var usingPreRelease = cv.includes("pre");
            req('get', "https://registry.npmjs.org/smelt-cli", function(err, res) {
                if (err) return;
                var latestVersion, preVersion = null;
                try { latestVersion = res.body['dist-tags'].latest; } catch(e) {return;}
                try { preVersion = res.body['dist-tags'].pre; } catch(e) {return;}
                
                // IF using is using a pre-release and the latestVersion is old that newest pre-release, 
                // then check against newest pre-release.
                if(usingPreRelease && semver.lt(latestVersion, preVersion))
                    latestVersion = preVersion;

                // If the current version is less than (lt) the latest version
                if(semver.lt(cv, latestVersion))
                {
                    console.log(chalk.red.bold("\n  [WARNING]: Your verion of Smelt (" + cv + ") is out of date. Please update to version " + latestVersion + ".")); 
                    console.log("  Command to update: " + chalk.bold("npm install smelt-cli -g")); 
                    console.log("  Check for more information: " + chalk.bold("http://smelt.gnasp.com/changenotes.html")); 
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
	
    
