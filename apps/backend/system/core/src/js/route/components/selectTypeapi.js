import {select} from "/src/js/components/woboxNew.js";

export function selectTypeapi( obj ){
    let value = obj.objDB &&  obj.objDB.type_api_id ?  obj.objDB.type_api_id : "";

    const elem = select({
        list:[
            {text: "page", value: 1},
            {text: "api", value: 2},
            {text: "command", value: 3},
            {text: "test", value: 4}
        ],
        class:"select",
        defaultValue: value,
        
        callback: ()=>{
            obj.reply.obj[obj.reply.prop] = elem.value;
        }
    });
    obj.reply.obj[obj.reply.prop] = elem.value;
    return elem;

} 