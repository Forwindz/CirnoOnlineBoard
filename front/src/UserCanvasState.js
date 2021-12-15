import gdata from './data/rawData'

class UserCanvasState{

    constructor(){
        this.lineWidth = '10'
        this.strokeColor = 'rgba(0,0,0,0.6)'
        this.path={};
        this.path.pos=[];
        this.stack = [];
        this.uid = 0;
    }

    //brute force
    

    pushToStack(pushedPath){
        for(let i = gdata.canvasStack.length-1;i>=0;i--){
            let s =gdata.canvasStack[i];
            if(s.stime<=pushedPath.stime){
                gdata.canvasStack.splice(i,0,pushedPath);
                for(let j=i+1;j<gdata.canvasStack.length;j++){
                    gdata.canvasStack[j].globalIndex++;
                }
                this.stack.push(pushedPath);
                pushedPath.globalIndex = i;
                return;
            }
        }
        pushedPath.globalIndex = 0;
        this.stack.push(pushedPath);
        gdata.canvasStack.push(pushedPath);
    }

    popStackLast(){
        if(this.stack.length==0){
            return null;
        }
        //console.log(gdata.canvasStack);
        //console.log(this.stack);
        let lastPath = this.stack[this.stack.length-1];
        gdata.canvasStack.splice(lastPath.globalIndex,1);
        for(let j=lastPath.globalIndex;j<gdata.canvasStack.length;j++){
            gdata.canvasStack[j].globalIndex--;
        }
        this.stack.pop();
        //console.log(lastPath);
        //console.log(gdata.canvasStack);
        //console.log(this.stack);
        return lastPath;
    }

    
    onMouseDown(e){
        this.path.width = this.lineWidth;
        this.path.color = this.strokeColor;
        this.path.pos = [];
        this.path.pos.push({ x:e.data.x, y:e.data.y })
        this.path.stime = e.stime;
        this.pushToStack(this.path)
        gdata.canvasDirty=true;
    };

    undoMouseDown(e){
        this.popStackLast();
        gdata.canvasDirty=true;
    };

    onMouseMove(e){
        if(e.data.isDragging){
            this.path.pos.push({ x:e.data.x, y:e.data.y });
            gdata.canvasDirty=true;
        }
        
        gdata.userList.users[this.uid].x=e.data.x;
        gdata.userList.users[this.uid].y=e.data.y;
    }
    
    undoMouseMove(e){
        if(e.data.isDragging){
            this.path.pop();
            gdata.canvasDirty=true;
        }
    }


    onMouseUp(e){
        this.path = {}
    }

    undoMouseUp(e){
        this.path=stack[-1];
    }

    onLineWidthChange(e){
        this.lineWidth = e.data.newv;
    }

    undoLineWidthChange(e){
        this.lineWidth = e.data.oldv;
    }
    
    onStrokeColorChange(e){
        this.strokeColor = e.data.newv;
    }
    
    undoStrokeColorChange(e){
        this.strokeColor = e.data.oldv;
    }

    onRevoke(e){
        this.popStackLast();
        gdata.canvasDirty=true;
    }

    onClear(e){
        this.stack=[];
        gdata.canvasStack = [];
        gdata.canvasDirty=true;
    }

    undoRevoke(e){
        //meaningless, skip
    }

    undoClear(e){
        //meaningless, skip
    }

    
    processPackage(e){
        let funcName = e.data.eventName;
        if(e.undo==true){
            funcName = "undo"+funcName;
        }else{
            funcName = "on"+funcName;
        }
        //console.log("Invoke "+funcName);
        this[funcName](e);
    }

}

export default UserCanvasState;