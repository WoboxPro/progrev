import {create, CreateMenu, changeLanguage, select} from "/src/js/components/woboxNew.js";
export function inputAddToDocumentation( obj ){
    const elem = create("input",{
        attr:{
            type: "checkbox",
            name: "checkPoint"
        },
        events:{
            input:()=>{
                obj.reply.obj[obj.reply.prop] = elem.checked;
            }
        }
    });

    obj.reply.obj[obj.reply.prop] = elem.checked;

    return elem;
}