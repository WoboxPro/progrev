import {select} from "/src/js/components/woboxNew.js";

export function selectTypecallback( obj ){
    let value = obj.objDB &&  obj.objDB.type_callback_id ?  obj.objDB.type_callback_id : "";

    const elem = select({
        list:[
            {text: "output", value: 1},
            {text: "page", value: 2},
            {text: "classMethod", value: 3},
            {text: "function", value: 4},
            {text: "middleware", value: 5},
        ],
        class:"select",
        defaultValue: value,
        callback: ()=>{
            obj.reply.obj[obj.reply.prop] = elem.value;
        }
    })
    obj.reply.obj[obj.reply.prop] = elem.value;
    return elem;
} 