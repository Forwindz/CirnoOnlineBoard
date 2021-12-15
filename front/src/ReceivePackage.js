import { self } from "./useCanvas";
import gdata from "./data/rawData";
import UserCanvasState from "./UserCanvasState";
import {fetchPacket} from "./socketManager"

gdata.userStates = {};

gdata.userList.addUserEvent.add((source,info)=>{
    if(info.uid == gdata.uid){
        gdata.userStates[info.uid] = self.selfUserState;
        gdata.userStates[info.uid].uid = gdata.uid;
        return;
    }
    gdata.userStates[info.uid] = new UserCanvasState(info.uid);
    gdata.userStates[info.uid].uid = info.uid;
});

gdata.userList.removeUserEvent.add((source,info)=>{

});

//fetch packs
async function dome() {
    function delay(num) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, num)
        })
    };
    
    while(true) {
        let pack = fetchPacket()
        if(pack!=null){
            let userState = gdata.userStates[pack.uid];
            //console.log("Process package")
            userState.processPackage(pack);
            //console.log(userState);
            //console.log(gdata.canvasStack);
            if(gdata.canvasDirty){
                self.drawLine();
                gdata.canvasDirty=false;
            }
        }
        await delay(0.001);
    }
}

dome()

export {dome}