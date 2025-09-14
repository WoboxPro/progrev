import {create, CreateMenu, changeLanguage, checkLanguage, select, updateWatch, watch} from "/src/js/components/woboxNew.js";
import { addModalWindow } from "/src/js/components/windowModal.js";

export function btn( options ){
    const btn = create("button",{
        text: options.text,
        events: {
            click: ( e ) => {
                options.callback( e )
            }
        },
        class: options.class ? options.class : "btn",
    })
    if ( options.parent ) {
        options.parent.appendChild( btn )
    }
    return btn
}
export function btnBack( options ){
    const btn = create("div",{
        text: {ru: "назад", en: "back"},
        class: "btnBack",
        events: {
            click: ( e ) => {
                options.callback()
            }
        }
    })
    return btn;
}
