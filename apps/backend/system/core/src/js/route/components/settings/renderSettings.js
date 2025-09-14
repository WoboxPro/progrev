import {create, selectBtn, select, CreateTable} from "/src/js/components/woboxNew.js";
import {btn} from "/system/core/src/js/global/ui.js";
import {addModalWindow} from "/src/js/components/windowModal.js";

export function renderSettings( parent ){
    parent.innerHTML = "";
    parent.append( create("div",{
        text: "<span style='border-bottom: 2px solid black;'>Настройки</span>",
        style: `
            font-weight: bold;
            font-size: 1.1rem;
            padding-bottom: 5px;
        `
    }));

    create("div",{
        text:"Доступ к панели администратора",
        style: `
            font-weight: bold;
        `,
        parent
    })
    create("div",{
        text:"Сервера",
        style: `
            font-weight: bold;
        `,
        parent
    })
    let myTable = new CreateTable({
        columns: [
            {name: "#", width: "40px", ai: true},
            {name: "Server", width: "1fr"},
            {name: "Secret key", width: "1fr"},
            {name: "Desc", width: "1fr"},
        ],
        parent: parent
    });

    // create("div",{
    //     text:"Сервера",
    //     style: `
    //         font-weight: bold;
    //     `,
    //     parent
    // });

    // btn({
    //     text: "R",
    //     callback: ()=>{
    //         alert(321);
    //     },
    //     parent
    // })
}