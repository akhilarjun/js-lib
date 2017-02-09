jsLib.config({
    url : 'js/ext-libs/' 
});
jsLib.init(['proto-lib','is-lib'],function () {
    console.log('Done!\nActive Libraries :',jsLib.activeLibs);
});