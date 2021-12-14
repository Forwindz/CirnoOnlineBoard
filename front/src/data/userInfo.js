import EventPublisher from "../utils/Events.js";
class UserInfo {
    constructor(uid) {
        this.uid = uid
        this.representColor = "#000"
        this.nick = "User"
    }
    //TODO: add more like nick name or avatar color
}


class UserList {
    constructor() {
        this.addUserEvent = new EventPublisher();
        this.removeUserEvent = new EventPublisher();
        this.users = {};
    }

    setUsers(users){ // same as this.users
        this.clearUsers();
        let keys = Object.getOwnPropertyNames(users)
        for (let k of keys){
            this.addUser(users[k])
        }
    }

    clearUsers(){
        let keys = Object.getOwnPropertyNames(this.users)
        for (let k of keys){
            this.removeUser(k)
        }
    }

    addUser(user) {//add user info
        if (user instanceof Array) {
            for (const u of user) {
                this.addUser(u);
            }
            return;
        }
        this.users[user.uid] = user;
        this.addUserEvent.notify(this,this.users[user.uid])
    }

    removeUser(uid) { //input uid, not userinfo
        if (this.users.hasOwnProperty(uid)){
            this.removeUserEvent.notify(this,this.users[uid])
            delete this.users[uid];
        }
    }

    length() {
        return user.length;
    }

    // sychnoize the attribute with user list
    bindAttr(attr){
        this.addUserEvent.add((source,e)=>{
            cursorData.add(e)
        });
        this.removeUserEvent.remove((source,userInfo)=>{
            let i=0;
            console.log(source);
            console.log(userInfo);
            for (;i<attr.length;i++){
              if(attr[i].uid==userInfo.uid){
                break;
              }
            }
            if(i<attr.length){
              attr = attr.splice(i,1);
            }
        });
    }
}

export { UserInfo, UserList }