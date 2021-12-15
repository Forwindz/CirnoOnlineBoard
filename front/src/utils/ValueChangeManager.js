import {removeArrayAllValues} from "./util.js"
class AttrManager{
    /**
     * Add a listener to the property
     * This will create a property with `${name}`
     * And:
     *   `_f_${name}` to store functions (function or array of functions)
     *   `_${name}` to store actual values.
     * @param {string} name 
     * @param {function} listener 
     */
    static addPropertyListener(obj, name, listener){
        const _this = obj;
        let funcName = `_f_${name}`;
        let innerName = `_${name}`;
        if (funcName in _this && _this[funcName]){
            if (_this[funcName] instanceof Array){ // third time or more
                _this[funcName].push(listener);
            }else{ // second time to define, we create an array to store listeners
                let tempFunc = _this[funcName];
                _this[funcName]=[tempFunc, listener];//create an array of listeners
                Object.defineProperty(_this, name, {
                    get: function() {
                        return _this[innerName];
                    },
                    set: function(newValue) {
                        _this[innerName] = newValue;
                        for(const x of _this[funcName]){
                            x(newValue);
                        }
                    }
                });
            }
            return listener;
        }else
        {
            // first time to define, just assign a function 
            _this[funcName] = listener;
            _this[innerName] = _this[name];
            Object.defineProperty(_this, name, {
                get: function() {
                    return _this[innerName];
                },
                set: function(newValue) {
                    _this[innerName] = newValue;
                    if(_this[funcName]){
                        _this[funcName](newValue);
                    }
                    
                }
            });
            return listener;
        }
        
    }

    static addPropertiesListener(obj,names, listener){
        for(const name of names){
            obj.addPropertyListener(obj,name,listener);
        }
    }
    static addAllPropertiesListener(obj,listener){
        for(const name in obj){
            if(typeof obj[name] == "function" || name[0]=='_'){
                continue;
            }
            AttrManager.addPropertyListener(obj,name,listener);
        }
    }

    static removePropertyListener(obj,name,listener){
        const _this = obj;
        let funcName = `_f_${name}`;
        let funcVar = _this[funcName];
        if(funcVar instanceof Array){
            removeArrayAllValues(funcVar,listener);
        }else{
            _this[funcName] = null;
        }
    }

    static removePropertyAllListener(obj,name){
        const _this = obj;
        let funcName = `_f_${name}`;
        if(funcName in _this){
            let funcVar = _this[funcName];
            if(funcVar instanceof Array){
                funcVar = new Array();
            }else{
                _this[funcName] = null;
            }
        }
    }
}


export default AttrManager;