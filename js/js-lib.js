'use strict';

/**
 * This is js-lib
 * your single stop for all queries
 */
var jsLib = {
    version : 1.0,
    activeLibs : [],
    ext_libs_url : 'ext-libs/',
    /** This method can be used to configure the path from where external
     * libraries are picked
     */
    config : function (config) {
        this.ext_libs_url = config.url;
    },
    /** Initialises the jsLib with required external libraries */
    init : function (libs,callbackFunc,config) {
        var ext_libs, toString = Object.prototype.toString;
        if (libs && toString.call(libs) === '[object Array]' && libs.length > 0) {
            ext_libs = libs;
        } else {
            ext_libs = [];
            if(libs && toString.call(libs) === '[object Function]') {
                callbackFunc = libs;
            }
        }
        $$_import({
            currIndex : 0,
            fileLists : ext_libs,
            callback : callbackFunc
        });
    }
};

function $$_import (av) {
    if (av.currIndex < av.fileLists.length) {
        var currFile = av.fileLists[av.currIndex],
            fileFound = false,
            callAgain = function () {
                av.currIndex = av.currIndex + 1;
                $$_import(av);
            };
        for (var i =0, actvLibs = jsLib.activeLibs; i < actvLibs.length; i++) {
            if (actvLibs[i] == currFile) {
                fileFound = true;
            }
        }
        if (!fileFound) {
            var fileref = document.createElement("script");
            fileref.type = "text/javascript";
            if (fileref.readyState) {
                /*This is for IE*/
                fileref.onreadystatechange = function () {
                    if (fileref.readyState === "loaded" || fileref.readyState === "complete") {
                        jsLib.activeLibs.push(currFile);
                        callAgain();
                    }
                };
            } else {
                /*Everything else*/
                fileref.onload = function () {
                    jsLib.activeLibs.push(currFile);
                    callAgain();
                };
                fileref.onerror = function (e) {
                    console.error(currFile+' was not loaded!');
                    callAgain();
                };
            }
            fileref.src = jsLib.ext_libs_url+currFile + '.js?timeStamp=' + new Date().getTime();
            document.getElementsByTagName("body")[0].appendChild(fileref);
        } else {
            callAgain();
        }
    } else {
        av.callback && av.callback();
    }    
};

/**
 * This is a custom exception
 * specifically made for jsLib
 **/
var jsLibException = function (errMsg) {
    throw new Error(errMsg);
};

/**
 * This is a custom warning for jsLib
 */
var jsLibWarning = function (msg) {
    window.console.warn('jsLib Warning : '+msg);
};