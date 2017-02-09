/**
 * Library : All Validation Utils
 * Inspired from is.js
 */
var _is = {
    /** Negatory interface */
    not : {},
    /** Any operator */
    any : {},
    /** And operator */
    all : {}
};

//Default Regex Library for IS
_is.defaults = {
    alphabet : /^[a-zA-Z\s]*$/g,
    alphaNumeric : /^\w*$/g,
    email : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i,
    url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i
};

//Create a custom regex operation custom to your application
_is.addCustomRegex = function (name, input, flags) {
    try {
        _is.defaults[name] = new RegExp(input, flags);
        generateRegexes();
    } catch(e) {
        jsLibException('Could not add the Regex\n'+e);
    }
}
_is.addCustomRegex.supportedInterface = [];

/*
// Example how to configure a custom Regex 
var name = 'js-lib';
_is.addCustomRegex('myName',name,'i');
//    name of method __^     ^   ^
//    String/Regex   ________|   |
//    Flag for regex ____________|
console.log(_is.myName('Js-liB')); //returns true
*/

//For dynamically generating regex operations in IS module
function generateRegexes() {
    _is.defaults.iterate(function (key, value) {
        _is[key] = function (input) {
            if (_is.not.blank(input)) {
                return value.test(input);
            } else {
                return false;
            }
        };
    });
};
generateRegexes();

//is given input defined
_is.defined = function (input) {
    return input||input===0?true:false;
};

//check if the given array/object is empty
_is.empty = function (input) {
    if(_is.defined(input)){
        var length = 0;
        input.iterate(function () {
            length++;
        });
        return length>0?false:true;
    } else {
        return true;
    }
};

//checks if the given input is an Array
_is.array = function (input) {
    if(_is.defined(input)){
        return input.getType() === 'Array'?true:false;
    } else {
        return false;
    }
};

//checks if the given input is an json Object
_is.jsonObject = function (input) {
    if(_is.defined(input)){
        return input.getType() === 'Object'?true:false;
    } else {
        return false;
    }
};

//checks if the input is blank/white-spaces
_is.blank = function (input) {
    if (_is.defined(input)){
        if (input.getType() === 'String') {
            return input.trim() === ''?true:false;
        } else {
            jsLibException('Blank operation can only be performed on String');
        }
    } else {
        return true;
    }
};

//checks if the input is a number
_is.number = function (input) {
    if (_is.defined(input)) {
        return input.getType()==='Number'?true:false;
    } else {
        return false;
    }
};

//checks if the object is mutable or not
_is.mutable = function (input) {
    return !Object.isFrozen(input);
};

//checks for HTML5 Apis

//checks for HTML5 storage support
_is.storageSupported = function () {
    return 'localStorage' in window && window['localStorage'] !== null;
};
_is.storageSupported.supportedInterface = ["not"];

//checks for HTML5 location support
_is.locationSupported = function () {
    return "geolocation" in navigator;
};
_is.locationSupported.supportedInterface = ["not"];

//checks for HTML5 web worker support
_is.workerSupported = function () {
    return 'Worker' in window && window['Worker'] !== null;
};
_is.workerSupported.supportedInterface = ["not"];

//checks for HTML5 web notification
_is.notificationSupported = function () {
    return "Notification" in window && window['Notofication'] !== null;
};
_is.notificationSupported.supportedInterface = ["not"];

// is a given value function?
_is['function'] = function(value) {    // fallback check is for IE
    return value.getType() === 'Function' || typeof value === 'function';
};

//define all interfaces for relevant API
(function setInterfaces() {
    var options = _is,
        slice = Array.prototype.slice,
        hasOwnProperty = Object.prototype.hasOwnProperty;
    //defining a not operator
    function not(func) {
        return function() {
            return !func.apply(null, arguments);
        };
    }
    //defining an any operator
    function any(func) {
        var op = false;
        return function () {
            arguments.iterate(function (each) {
                op = op||func.call(null, each);
            });
            return op;
        }
    }
    //defining an all operator
    function all(func) {
        var op = true;
        return function () {
            arguments.iterate(function (each) {
                op = op&&func.call(null, each);
            });
            return op;
        }
    }
    for (var option in options) {
        if (hasOwnProperty.call(options, option) && _is['function'](options[option])) {
            if (!options[option].supportedInterface) {
                options[option].supportedInterface = ['not','any','all']
            }
            options[option].supportedInterface.iterate(function (supportedAPI) {
                if (supportedAPI === 'not') {
                    _is.not[option] = not(_is[option]);
                }
                if (supportedAPI === 'any') {
                    _is.any[option] = any(_is[option]);
                }
                if (supportedAPI === 'all') {
                    _is.all[option] = all(_is[option]);
                }
            });
        }
    }
})();