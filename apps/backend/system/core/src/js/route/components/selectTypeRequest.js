import {select} from "/src/js/components/woboxNew.js";

export function selectTypeRequest( obj ){
    let value = obj.objDB &&  obj.objDB.type_request_id ?  obj.objDB.type_request_id : "";

    const elem = select({
        list:[
            {text: "Response", value: 1},
            {text: "Redirect", value: 2},
        ],
        class:"select",
        defaultValue: value,
        callback: (e)=>{obj.reply.obj[obj.reply.prop] = elem.value;}
    });

    obj.reply.obj[obj.reply.prop] = elem.value;

    return elem;
} 