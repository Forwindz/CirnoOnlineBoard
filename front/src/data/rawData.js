import { UserList,UserInfo } from "./userInfo.js";

class Data{
    constructor(){
        this.userList = new UserList();
        this.uid = null;
        this.canvasStack = [];
        this.canvasDirty = false;
    }
    
}

var gdata = new Data();

export default gdata;