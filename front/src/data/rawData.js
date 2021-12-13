import { UserList,UserInfo } from "./userInfo.js";

class Data{
    constructor(){
        this.userList = new UserList();
        this.uid = null;
    }
    
}

var gdata = new Data();

export default gdata;