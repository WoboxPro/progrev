import {create, CreateMenu, changeLanguage, checkLanguage, select, updateWatch, watch} from "/src/js/components/woboxNew.js";
import { addModalWindow } from "/src/js/components/windowModal.js";

//UI
import { btnBack } from "/src/js/ui/buttons.js";


export function renderContHeader( options ){
    const contHeader = create("div",{
        class: "contHeader",
        append:[
            btnBack({
                callback: ( e ) => {
                    renderStart( {
                        parent: options.parent
                    } )
                }
            }),
            create("div",{
                text: options.text,
                info: "Заголовок меню",
                class: "titleMenu"
            })

        ]
    })
    return contHeader;
}