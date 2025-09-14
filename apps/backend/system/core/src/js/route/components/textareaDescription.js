import {create, CreateMenu, changeLanguage, select} from "/src/js/components/woboxNew.js";
export function textareaDescription( obj ){
    let value = obj.objDB &&  obj.objDB.description_rout ?  obj.objDB.description_rout : "";

    const elem = create("textarea",{
        attr:{
            style:`
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 3px;
                width: 100%;
                font-family: monospace;
                height: 50px;
            `
        },
        events:{
            input: (e) => {
                obj.reply.obj[obj.reply.prop] = elem.value;

            }
        },
    });
    elem.textContent = value;
    obj.reply.obj[obj.reply.prop] = elem.value;
    return elem;
} 