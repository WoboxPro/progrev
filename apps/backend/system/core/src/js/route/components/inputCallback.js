import {create, CreateMenu, changeLanguage, select} from "/src/js/components/woboxNew.js";
export function inputCallback( obj ){
    let value = obj.objDB &&  obj.objDB.callback ?  obj.objDB.callback : "";
    
    const elem = create("input",{
        style:`
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 3px;
            width: 100%;
            font-family: monospace;
        `,
        attr:{
            value: value
        },
        events:{
            input: (e) => {
                obj.reply.obj[obj.reply.prop] = elem.value;
            }
        }
    })
    obj.reply.obj[obj.reply.prop] = elem.value;
    return elem;
}