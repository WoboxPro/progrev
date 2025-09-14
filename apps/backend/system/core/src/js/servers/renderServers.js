import {create, CreateMenu, changeLanguage, checkLanguage, select, updateWatch, watch, build} from "/src/js/components/woboxNew.js";
import { CreateTable } from "/src/js/components/woboxTable.js";


export function renderServers( contRender ){
    contRender.innerHTML = "";
    const contRenderServers = create("div", {
        parent: contRender,

    })

    let dataServers = watch([]);
    const table = new CreateTable({
        label: "Servers",
        data: dataServers,
    })
    contRenderServers.appendChild(table.container);

    const mocks = [
        {
            name: "Master server",
            ip: "localhost",
            port: 8080,
            place: "Docker",
            status: "<span style='color: green; font-weight: bold; font-family: monospace;'>&#8226;online</span>",
            pathKey: "master"
        },
        {
            name: "Go server",
            ip: "Go",
            port: 8081,
            place: "Docker",
            status: "<span style='color: green; font-weight: bold; font-family: monospace;'>&#8226;online</span>",
            pathKey: "go"
        },
        {
            name: "Test server",
            ip: "Test",
            port: 8082,
            place: "Docker",
            status: "<span style='color: red; font-weight: bold; font-family: monospace;'>&#8226;No connection</span>",
            pathKey: "test"
        }
    ]
    updateWatch(dataServers, mocks);

    function getServers(){
        fetch("/system/core/CSMR/controllers_no_route/ServersController.php")
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
    }
    getServers();
    const contBtns = create("div", {
        parent: contRenderServers,
    })

    const btnMaster = create("button", {
        parent: contBtns,
        text: "Add server",
        onclick: () => {
            console.log("Master server");
        }
    })
    // const siteMap = [
    //     {
    //         name: "Таблица серверов",
    //         element: table.container,
    //     }
    // ]



    // build(siteMap, contRender);

}