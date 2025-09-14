import {create, CreateMenu} from "/src/js/components/woboxNew.js";
import {welcomeText} from "/system/core/src/js/route/text/welcomeText.js";


export  function renderWelcome( parentELement ){
    parentELement.innerHTML = "";
    create("div",{
        text: welcomeText,
        parent: parentELement
    });
}