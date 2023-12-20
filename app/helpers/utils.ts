

const GB = 1000000000;
const MB = 1000000;
const KB = 1000;

export function fileSizePretty(
    bytes: number
) {
    if(bytes > GB){
        return ""+Math.round(100*bytes/GB)/100+"GB";
    }
    if(bytes > MB){
        return ""+Math.round(100*bytes/MB)/100+"MB";
    }
    if(bytes > KB){
        return ""+Math.round(100*bytes/KB)/100+"KB";
    }
    return ""+bytes+"B";

}