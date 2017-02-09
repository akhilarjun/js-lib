/**
 * Generic : Method returns you the type of object you passed
 */
Object.prototype.getType = function () {
    return Object.prototype.toString.call(this).replace(/[\[\]]/g,'').split(' ')[1];
}

/**
 * Generic : Iterate through the collection <Array/Object>
 */
Object.prototype.iterate = function (logic) {
    if (!logic) {
        jsLibWarning("No Iteration Logic Is Provided");
        return;
    }
    var typeOfObj = this.getType(),
        iterateForArray = function (toIterate, logic) {
            for (var i = 0; i < toIterate.length; i++) {
                logic(toIterate[i]);
            }
        },
        iterateForObject = function (toIterate, logic) {
            for (var key in toIterate) {
                if (toIterate.hasOwnProperty(key)) {
                    logic(key, toIterate[key]);
                }
            }
        };
    switch (typeOfObj) {
        case 'Array':
            iterateForArray(this, logic);
            break;
        case 'Arguments':
            iterateForArray(this, logic);
            break;
        case 'Object':
            iterateForObject(this, logic);
            break;
        default:
            jsLibException("Non Iteratable Object");
            break;
    }
}

// Example For Iterate
/*
var ex = [
            {firstName: 'John', lastName: 'Doe', age: 25}, 
            {name: 'Leo', age: 24, address: 'Los Angeles'}
        ];
ex.iterate(function (each) {
    console.log(each.getType());
    each.iterate(function (key, value) {
        console.log('|->',key,': '+ value);        
    });
});
*/