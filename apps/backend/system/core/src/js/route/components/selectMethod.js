import {select} from "/src/js/components/woboxNew.js";
export function selectMethod( obj ){
    let value = obj.objDB &&  obj.objDB.method_id ?  obj.objDB.method_id : "";
    obj.reply.obj['methodOld'] = value;
    const elem = select({
        list:[
            {text: "ALL",    value: 1},
            {text: "GET",    value: 2},
            {text: "POST",   value: 3},
            {text: "PUT",    value: 4},
            {text: "DELETE", value: 5},
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