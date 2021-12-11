import {removeArrayValue} from "./util.js"
class EventPublisher{
    
    constructor(){
        this._subscribers=[];
    }

    add(listener){
        this._subscribers.push(listener);
    }

    remove(listener){
        removeArrayValue(this._subscribers,listener);
    }

    notify(source=null, params=null){
        for (const subscriber of this._subscribers){
            subscriber(source, params);
        }
    }

    clear(){
        this._subscribers=[];
    }
}

export default EventPublisher;