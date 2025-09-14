import {select} from "/src/js/components/woboxNew.js";
export function selectServer( obj ){
    let value = obj.objDB &&  obj.objDB.server_id ?  obj.objDB.server_id : "";

    const elem = select({
        list:[
            {text: "Default", value: 1},
            {text: "PHP FRONT", value: 2},
            {text: "Go", value: 3},
            {text: "Node - React", value: 4},
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