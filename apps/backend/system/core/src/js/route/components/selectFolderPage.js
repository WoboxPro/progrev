import {select} from "/src/js/components/woboxNew.js";
export function selectFolderPage( obj ){
    let value = obj.objDB &&  obj.objDB.path_page_id ?  obj.objDB.path_page_id : "";

    const elem = select({
        list:[
            {text: "Default", value: 1},
        ],
        class:"select",
        defaultValue: value,
        callback: (e)=>{
            obj.reply.obj[obj.reply.prop] = elem.value;
        }
    })
    obj.reply.obj[obj.reply.prop] = elem.value;
    return elem;
} 