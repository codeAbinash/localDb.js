class localDb{
    constructor(name){
        this.name = name;
        this.mainDb =[];
        this.localDbName = "lDark#4s5d" + this.name + "key2sd55";
        if(this.isNull(this.localDbName)&&arguments[1]!="new"){
            this.mainDb = JSON.parse(localStorage.getItem(this.localDbName));
        }
        else{
            this.delDb();
        }
    }
    insVal(){
        var argLen = arguments.length;
        var len = this.mainDb.length;
        var i = 0;
        if(argLen==1&&Array.isArray(arguments[0])){
            var objLen = arguments[0].length;
            for(i=0;i<objLen;i++)
                this.mainDb[len+i] = arguments[0][i];
        }
        else
            for(i=0;i<argLen;i++)
                this.mainDb[len+i] = arguments[i];
        this.save();
    }

    delDb(){
        this.delAll();
        localStorage.removeItem(this.localDbName);
    }
    //For Developer Only
    isNull(n){
        if(localStorage.getItem(n))
            return true;
        else
            return false;
    }
    getName(){
        return this.name;
    }
    getKeyName(){
        return this.localDbName;
    }
    setName(){
        if(typeof(arguments[0])=="string"){
            var x = new localDb(arguments[0]);
            x.mainDb = this.mainDb;
            x.save();
            this.delDb();
            return x;
        }
        else
            console.error("Changing name failed, Cannot read the argument in the method changeName(String_val)");
    }
    length(){
        return this.mainDb.length;
    }
    copy(){
        const len = arguments.length;
        for(var i=0;i<len;i++){
            for(var j=0;j<arguments[i].mainDb.length;j++)
                this.mainDb.push(arguments[i].mainDb[j]);
        }
        this.save();
    }
    makeConditionString(x){
        function $$(x){
            return `this.mainDb[i]['${x}']`;
        }
        function match(x){
            var list = "+-*/%&|!;=><#"
            if(list.indexOf(x)>=0)
                return true;
            else
                return false;
        }
        var txt = x+"#";
        var output = [];
        var len = txt.length;
        var s = "";
        for(var i=0;i<len;i++){
            if(match(txt[i])){
                if(s.trim().length>0)
                    output.push(s.trim());
                output.push(txt[i]);
                s="";
            }else
                s+=txt[i];
        }
        output.pop();
        len = output.length;
        var str = "";
        for(i=0;i<len;i++){
            var s = output[i];
            if(!(Number(s[0])||s[0]=="\""||s[0]=="\'"||match(s)))//If it is a number or a string
                s=$$(s);
            str+=s;
        }
        return str;
    }
    get(){
        const len = arguments.length;
        var sl = Number(arguments[0]);
        const dbLen = this.mainDb.length;
        var tmpArr = [],i = 0;
        if(sl>=0||len==0||typeof(arguments[0]=="string"))
            sl = (sl>dbLen)?dbLen:sl;
        else
            console.error("First parameter(n,...) is get() function Should be a Number (n>=0)");
        if(len==1){
            if(typeof(arguments[0])=="number")
                return this.mainDb[sl];
            else if(typeof(arguments[0]=="string")){
                var cond = arguments[0];
                return this.fromFirst(dbLen,cond);
            }
        }
        else if(len==2){
            var fl = arguments[1].toLowerCase();
            sl = (sl>dbLen)?dbLen:sl;
            if(fl=="first"||fl=="last"){
                if(fl=="first"){
                    for(i=0;i<sl;i++)
                        tmpArr.push(this.mainDb[i]);
                    return tmpArr;
                }else if(fl=="last"){
                    for(i=0;i<sl;i++)
                        tmpArr.push(this.mainDb[dbLen-sl+i]);
                    return tmpArr;
                }
            }
            else{
                var cond = arguments[1];
                var count = 0;
                for(i=0;i<dbLen;i++){
                    if(eval(this.makeConditionString(cond))){
                        tmpArr.push(this.mainDb[i]);
                        count++;
                    }
                    if(count>=sl||i==dbLen-1)
                        return tmpArr;
                }
            }
        }else if(len==3){
            fl = arguments[1].toLowerCase();
            var cond = arguments[2];
            if(fl=="first"||fl=="last"){}
            else{
                cond = arguments[1];
                fl = arguments[2].toLowerCase();
                if(fl=="first"||fl=="last"){}
                else{
                    console.error("Error in get() Check the arguments in get() function");
                    return tmpArr;
                }
            }
            if(fl=="first")
               return this.fromFirst(sl,cond);
            else if(fl=="last")
                return this.fromLast(sl,cond);
        }
        else if(len==0)
            return this.mainDb;
    }
    fromLast(num,cond){
        var tmpArr = [];
        var i;
        const sl = num;
        const dbLen = this.mainDb.length;
        var count = 0;
        for(var i=dbLen-1;i>=0;i--){
            if(eval(this.makeConditionString(cond))){
               tmpArr.push(this.mainDb[i]);
               count++;
            }
            if(count>=sl||i==0)
                break;
        }
        return tmpArr;
    }
    fromFirst(num,cond){
        var tmpArr = [];
        var i;
        const sl = num;
        const dbLen = this.mainDb.length;
        var count = 0;
        for(var i=0;i<dbLen;i++){
            if(eval(this.makeConditionString(cond))){
               tmpArr.push(this.mainDb[i]);
               count++;
            }
            if(count>=sl||i==dbLen-1)
                break;
        }
        return tmpArr;
    }
    delAll(){
        var len = this.mainDb.length;
        this.mainDb = [];
        this.save();
        return len;
    }
    del(){
        const len = arguments.length;
        var s1 = arguments[0];
        var i =0;
        var deletedItems = 0;
        const dbLen = this.mainDb.length;
        if(len==1){
            if(typeof(s1)=="number"){
                return this.deleteByIndex(Number(s1));
            }
            else if(typeof(s1)=="string"){
                return this.deleteByCond(s1);
            }
        }else if(len==2){
            var s2 = arguments[1].toLowerCase();
            s1 = (s1>dbLen)?dbLen:s1;
            if(s2=="first"||s2=="last"){
                if(s2=="first"&&s1>=0){
                    for(i=0;i<s1;i++)
                        deletedItems+=this.deleteByIndex(i);
                    return deletedItems;
                }
                else if(s2=="last"&&s1>=0){
                    for(i=dbLen-1;i>=dbLen-s1;i--)
                        deletedItems+=this.deleteByIndex(i);
                    return deletedItems;
                }

            }
        }else if(len==3){
            var fl = arguments[1].toLowerCase();
            s1 = (s1>dbLen)?dbLen:s1;
            s1--;
            var cond = arguments[2];
            if(fl=="first"||fl=="last"){}
            else{
                cond = arguments[1];
                fl = arguments[2].toLowerCase();
                if(fl=="first"||fl=="last"){}
                else{
                    console.error("Error in delete() Check the arguments in delete() function");
                    return 0;
                }
            }
            if(fl=="first"){
               return this.deleteFromFirst(s1,cond);
            }
            else if(fl=="last"){
                return this.deleteFromLast(s1,cond);
            }
        }
    }
    deleteFromFirst(n,cond){
        n = Number(n);
        return this.deleteByCond(cond,0,n);
    }
    deleteFromLast(n,cond){
        n = Number(n);
        var len = this.mainDb.length;
        return this.deleteByCond(cond,len-n-1,len-1);
    }
    deleteByIndex(index){
        this.mainDb.splice(index,1);
        this.save();
        return 1;
    }
    deleteByCond(cond,startIndex=0,lastIndex=this.mainDb.length-1){
        var count = 0;
        var dbLen = this.mainDb.length;
        var tmp = [];
        for(var i =0;i<dbLen;i++){
            if(eval(this.makeConditionString(cond))&&(i>=startIndex&&i<=lastIndex)){
                count++;
            }else{
                tmp.push(this.mainDb[i]);
            }
        }
        this.mainDb = tmp;
        this.save();
        return count;
    }
    updateByConditionNum(cond,apply,count,sf){
        var i = 0;
        var dbLen = this.mainDb.length;
        count = (dbLen>count)?count:dbLen;
        var c= 0;
        if(sf.toLowerCase()=="first"){
            for(i=0;i<count;i++){
                if(eval(this.makeConditionString(cond))){
                    eval(this.makeConditionString(apply));
                    c++;
                }
            }
        }else if(sf.toLowerCase()=="last"){
            for(i=dbLen-1;i>=dbLen-count;i--){
                if(eval(this.makeConditionString(cond))){
                    eval(this.makeConditionString(apply));
                    c++;
                }
            }
        }else{
            console.error("error in update() check the arguments in the update function()");
            return 0;
        }
        this.save();
        return c;
    }
    setAll(apply,cond){
        return this.updateByConditionNum(cond,apply,this.mainDb.length,"first");
    }
    set(){
        var len = arguments.length;
        var dbLen = this.mainDb.length,i;
        if(len==1||len==0)
            console.error("Error in update() : Check the arguments update()");
        else if(len==2){
            if(typeof(arguments[1])=="number"){
                i = arguments[1];
                eval(this.makeConditionString(arguments[0]));
                this.save();
                return 1; 
            }
            else
                return this.updateByConditionNum(arguments[1],arguments[0],dbLen,"first");
        }
        else if(len==3){
            var cond = arguments[1];
            var apply = arguments[0];
            var s3 = arguments[2];
            if(typeof(s3)=="number")
                return this.updateByConditionNum(cond,apply,s3,"first");
            else if(s3=="first"||s3=="last")
                return this.updateByConditionNum(cond,apply,dbLen,s3);
            else
                return 0;
        }else if(len==4){
            var cond = arguments[1];
            var apply = arguments[0];
            var s3 = arguments[2];
            var s4 = arguments[3];
            if(s3=="first"||s3=="last")
                return this.updateByConditionNum(cond,apply,s4,s3);
            else if(s4=="first"||s4=="last")
                return this.updateByConditionNum(cond,apply,s3,s4);
        }
    }
    save(){
        localStorage.setItem(this.localDbName,JSON.stringify(this.mainDb));
    }
    sort(){
        var len = arguments.length;
        if(len == 0){
            console.error("Arguments in the sort() method cannot be blank");
        }
        else if(len == 1){
            this.sortAsc(arguments[0]);
        }
        else if(len==2){
            var typ = arguments[1].toLowerCase();
            if(typ=="asc"||typ=="ascending"){
                this.sortAsc(arguments[0]);
            }else if(typ=="des"||typ=="descending"){
                this.sortDes(arguments[0]);
            }else{
                console.error("Pass correct argument in sort() method");
            }
        }
        return this;
    }
    sortAsc(){
        const len = arguments.length;
        const dbLen = this.mainDb.length;
        var i,j;
        if(len==1){
            for(i=0;i<dbLen;i++)
                for(j=i+1;j<dbLen;j++){
                    var c = this.mainDb[i][arguments[0]];
                    var d = this.mainDb[j][arguments[0]];
                    if(c>d){
                        var tmp = this.mainDb[i];
                        this.mainDb[i] = this.mainDb[j];
                        this.mainDb[j] = tmp;
                    }
                }
        }
    }
    sortDes(){
        const len = arguments.length;
        const dbLen = this.mainDb.length;
        var i,j;
        if(len==1){
            for(i=0;i<dbLen;i++)
                for(j=i+1;j<dbLen;j++){
                    var c = this.mainDb[i][arguments[0]];
                    var d = this.mainDb[j][arguments[0]];
                    if(c<d){
                        var tmp = this.mainDb[i];
                        this.mainDb[i] = this.mainDb[j];
                        this.mainDb[j] = tmp;
                    }
                }
        }
    }
}

export default localDb;