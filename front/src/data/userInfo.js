
class UserInfo {
    constructor(uid) {
        this.uid = uid
    }
    //TODO: add more like nick name or avatar color
}


class UserList {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        if (user instanceof Array) {
            for (const u of user) {
                this.addUser(u);
            }
            return;
        }
        this.users[user.uid] = user;
    }

    removeUser(user) {
        delete this.users[user.uid];
    }

    length() {
        return user.length;
    }
}

export { UserInfo, UserList }