import {create} from "/src/js/components/woboxNew.js";

export function btn( data ){
    return create("div",{
        text: data.text ?? "Кнопка",
        events:{
            click: ( e )=>{
                data.callback( e );
            }
        },
        parent: data.parent
    })
}