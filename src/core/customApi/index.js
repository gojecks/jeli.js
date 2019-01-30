/*
  Custom Events (QUEUE and STACKS)
*/

function stack() {
    var _queues = [];

    var queue = function(fn) {
            _queues.push(fn);
            return _obj;
        },
        executeQueue = function() {
            var nextFn = _queues.shift() || function() {};
            nextFn.apply(nextFn, arguments);
            return _obj;
        };

    var _obj = {
        push: queue,
        pop: executeQueue
    };

    return _obj;
};

function $eventStacks() {
    var _events = {};
    this.broadcast = function(name, arg) {
        var nextFn = _events[name] || function() {};
        nextFn.apply(nextFn, arg);
    };

    this.subscribe = function(name, fn) {
        _events[name] = fn;
        return this;
    };

    this.destroy = function(name) {
        _events[name] = null;
    };

    this.bind = function(fn, arg) {
        return function() {
            fn.apply(fn, arg || []);
        }
    };
}

/*
  add the events stacks
*/
$eventStacks.prototype.stack = stack;
/*
      creating a new queue
*/
$eventStacks.prototype.queue = new stack();

//BaseFn Factory
function Base64Fn() {

    var publicApis = {};

    publicApis.encode = function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    };

    publicApis.decode = function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    return publicApis;
}

/**
 * 
 * @param {*} item 
 * @param {*} deep 
 */
function copy(item, deep) {
    var type = {};
    if ($isArray(item)) {
        type = [];
    }

    if (item && item.nodeType) {
        // DOM Node
        return item.cloneNode(true); // Node
    }

    if ($isFunction(item)) {
        return item;
    }

    if (item instanceof Date) {
        // Date
        return new Date(item.getTime()); // Date
    }

    if (item instanceof RegExp) {
        // RegExp
        return new RegExp(item); // RegExp
    }

    if (typeof item !== "object") {
        return item;
    }

    if (deep) {
        var ret;
        try {
            ret = JSON.parse(JSON.stringify(item))
        } catch (e) {
            ret = extend(type, item);
        }

        return ret;
    }

    return extend(type, item);
}

//Expect Function
/**
 * 
 * @param {*} objToInspect 
 */
function expect(objToInspect) {
    // contains
    function contains(ins) {
        //Perform Object Check
        if ($isObject(objToInspect)) {
            return objToInspect.hasOwnProperty(ins) || (ins in objToInspect);
        } else {
            return objToInspect.indexOf(ins) > -1;
        }
    }
    /**
     * 
     * @param {*} str 
     * @param {*} iteratorFn 
     */
    function search(str, iteratorFn) {
        if (!objToInspect) {
            return false;
        }

        var found = false,
            len = 0,
            trigger = function(prop) {
                if (iteratorFn && $isFunction(iteratorFn)) {
                    if (iteratorFn(objToInspect[prop], prop, len)) {
                        found = objToInspect[prop];
                    }
                } else {
                    if ($isEqual(JSON.stringify(objToInspect[prop]), JSON.stringify(str))) {
                        found = objToInspect[len];
                    }
                }
                len++;
            };

        if ($isObject(objToInspect)) {
            var ObjKeys = Object.keys(objToInspect);
            while (ObjKeys.length > len) {
                trigger(ObjKeys[len]);
            }
            ObjKeys = null;
        } else {
            while (objToInspect.length > len) {
                trigger(len);
            };
        }

        //return
        return found;
    }

    function each(iterator) {
        this.search(null, iterator);
    }

    return {
        search: search,
        contains: contains,
        each: each
    };
}