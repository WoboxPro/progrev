import {create, selectBtn, CreateTable,changeLanguage, checkLanguage, select, updateWatch, watch} from "/src/js/components/woboxNew.js";
import {addModalWindow} from "/src/js/components/windowModal.js";
import { CreateTable as CreateTableNew } from "/src/js/components/woboxTable.js";

class RenderDB__STYLE{
    static get btn(){
        return `
            color: black;
            font-weight: bold;
            border:2px solid black;
            height: 35px;
            width: fit-content;
            padding: 0 10px;
            border-radius: 5px;
            cursor: pointer;
            display: grid;
            place-content: center;
            place-items: center;
            text-align: center;
            margin-top: 5px;
        `;
    }
    
}


export function renderDB( parent ){
    parent.innerHTML = "";
    // Render the development mode switcher UI first
    renderDevTypeSwitcher(parent);

    // Получаем конфиги, чтоб определить через что будет работать роутинг. Через json или через базу данных sqlite
    // по умолчанию база данных sqlite находится в папке core/db/wobox.db
    fetch("/system/core/configs/configs.json",{
        cache: "no-cache"
    })
    .then( r => r.json() )
    .then( data => {
        console.log("CONFIGS", data );
        if( data.core.typeCore == "json" ){
            console.log("Роутинг будет работать через json");
            renderJSONcore( { parent} );
            checkProjectDBJSON({parent, data});
            btnAddProjectDB({parent, data, type: "json"});
        }
        else{
            console.log("Роутинг будет работать через базу данных sqlite");
            checkCoreDB({parent: parent});
            checkProjectDB({parent: parent});
            btnAddProjectDB({parent, type: "sqlite"});
        }

    })
}


function checkProjectDBJSON( option = {} ){
    const parent = option.parent;
    const data = option.data;
    parent.append( create("div",{
        text: "<span style='border-bottom: 2px solid black;'>Базы данных проекта</span>",
        style: `
            font-weight: bold;
            font-size: 1.1rem;
            padding-bottom: 5px;
        `
    }));

    let myData = watch([]);
    fetch("/system/core/CSMR/controllers_no_route/ConnectProjectDB.php",{
        method: "POST",
        body: JSON.stringify({
            type: "json"
        })
    })
    .then( r => r.json() )
    .then( data => {
        console.log( data );
        data.forEach( (item, key) => {
            console.log( item );
            if( item.default_db == 1){
                data[key].default_db = "&#10003;"
            }
            if( item.connection_status == "Connected"){
                data[key].connection_status = "<span style='color: green;font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 6px green; display: grid; justify-items: center;'>&#8226;</span>"
            }
            else{
                data[key].connection_status = "<span style='color: red;font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 6px red; display: grid; justify-items: center;'>&#8226;</span>"
            }

        });
        updateWatch( myData, data );
    });
    const myTable = new CreateTableNew({
        columns:[
            {
              "name": "id",
              "key": "id",
              "width": "1fr",
              "hidden": true
            },
            {
              "name": "name_db",
              "key": "name_db",
              "width": "1fr",
            },
            {
              "name": "username",
              "key": "username",
              "width": "1fr",
              "hidden": true
            },
            {
              "name": "user_password",
              "key": "user_password",
              "width": "1fr",
              "hidden": true
            },
            {
              "name": "server",
              "key": "server",
              "width": "1fr",
            },
            {
              "name": "type_db",
              "key": "type_db",
              "width": "1fr",
              "hidden": true
            },

            {
              "name": "subd",
              "key": "subd",
              "width": "1fr",
            },
            {
              "name": "status_db",
              "key": "status_db",
              "width": "1fr",
              "hidden": true
            },
            {
              "name": "Default",
              "key": "default_db",
              "width": ".5fr",
              "textAlign": "center"

            },
            {
                "name": "Status",
                "key": "connection_status",
                "width": ".5fr",
                "textAlign": "center"
            },
            {
              "name": "group_db",
              "key": "group_db",
              "width": "1fr",
              "hidden": true
            },
            {
                "name": "desc_db",
                "key": "desc_db",
                "width": "1fr",
              },

          ],
        data: myData,
     
    });
    
    parent.append( myTable.container );
}



function renderJSONcore( option = {} ){
    const parent = option.parent;
    create("div",{
        text: "<span style='border-bottom: 2px solid black;'>Фреймворк работает через json (core/configs/configs.json)</span>",
        style: `
            font-family: monospace;
            font-size: .9rem;
            padding-bottom: 5px;
        `,
        parent: parent
    });
}

// Проверяем базу данных ядра фреймворка
function checkCoreDB( option = {} ){
    const parent = option.parent;
    
    parent.append( create("div",{
        text: "<span style='border-bottom: 2px solid black;'>Ядро фреймворка</span>",
        style: `
            font-weight: bold;
            font-size: 1.1rem;
            padding-bottom: 5px;
        `
    }));
    let myTable = new CreateTable({
        columns: [
            {name: "#", width: "40px", ai: true},
            {name: "NameDB", width: "1fr"},
            {name: "SUBD", width: "60px"},
            {name: "Status", width: "50px"},
            {name: "Desc", width: "1fr"},
        ],
        parent: parent
    });

    fetch("/system/core/CSMR/controllers_no_route/CheckCoreDBController.php")
    .then( r => r.json() )
    .then( data => {
        console.log("------------- Цикл проверок базы ядра: ------------------");
        console.log("Этап 1");
        if( data == 1){
            console.log( "База данных ядра wobox.db на месте \n" );
            return 1;
        }
        else{
            console.log( "Базы данных нет! Создайте базу данных wobox.db \n" );
            return 0;
        }
    })
    .then( (r)=>{
        console.log( r );
        fetch("/system/core/CSMR/controllers_no_route/ConnectCoreDB.php")
        .then(res => res.json())
        .then(data => {
            console.log( data );
            function pointModalWindow( data ){
                /*
                    data:
                    {
                        name: <имя поинта>,
                        value: значение поинта инпут
                    }
                */
                let elemInput = "";
                const parent = create("div",{
                    append:[
                        create("div",{
                            text: `${data.name}:`,
                            style:`
                                font-weight: bold;
                            `
                        }),
                        elemInput = create("input",{
                            attr:{
                                value: data.value ?? "",
                            },
                            style:`
                                height: 30px;
                                padding: 0 5px;
                                border: 1px solid gray;
                                border-radius: 5px;
                                outline: none;
                            `
                        })
                    ]
                });
                parent.elementValue = elemInput; 
                return parent;
            }
            for(let pointRoute of data){
                function updatePointRoute(field, elemFormList) {
                    pointRoute[field] = elemFormList[field].elementValue.value;
                }
                myTable.add({
                    data:[
                        null,
                        pointRoute.name_db,
                        pointRoute.subd,
                        "<span style='color: green;font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 6px green; display: grid; justify-items: center;'>&#8226;</span>",
                        pointRoute.desc_db
                    ],
                    callback: ()=>{
                        const elemFormList = {};
                        const cont = create("div",{
                            append:[
                                elemFormList.desc_db = pointModalWindow({name: "Описание", value: pointRoute.desc_db}),
                                elemFormList.name_db = pointModalWindow({name: "Название БД", value: pointRoute.name_db}),
                                elemFormList.username = pointModalWindow({name: "Логин", value: pointRoute.username}),
                                elemFormList.user_password = pointModalWindow({name: "Пароль", value: pointRoute.user_password}),
                                elemFormList.server = pointModalWindow({name: "Сервер", value: pointRoute.server}),
                                elemFormList.subd = pointModalWindow({name: "СУБД", value: pointRoute.subd}),
                                elemFormList.table_rout = pointModalWindow({name: "Таблица роутинга", value: pointRoute.table_rout}),
                                create("div",{
                                    text: {"en": "Save", "ru": "Сохранить"},
                                    style: RenderDB__STYLE.btn,
                                    events:{
                                        click:()=>{
                                            Object.keys(elemFormList).forEach(field => {
                                                updatePointRoute(field, elemFormList);
                                            });
                                            console.log( pointRoute );
                                        }
                                    }
                                })
                            ],
                            style:`
                                display: grid;
                                gap: 5px;
                            `
                        })
                        
                        addModalWindow(pointRoute.desc_db, cont);
                    }
                });
            }
        })
    })
}

function btnAddProjectDB( option = {} ){
    const parent = option.parent;
    const type = option.type;
    let dataConfig = null;
    if( type == "json" ){
        dataConfig = option.data;
    }
    create("div",{
        text: "Добавить базу для проекта",
        style: RenderDB__STYLE.btn,
        parent,
        events:{
            click: ()=>{
                const cont = create("div");
                const titleInfo = create("div",{
                    parent: cont,
                    text: "Здесь можно подключать БД для проекта, в дальнейшем обращение к БД по умолчанию будет как: ConnectDB::go(), если нужно другую базу, то как ConnectDB::go('<имя базы>')"
                })
                const elementsObjList = {};
                function elemPoint( data ){
                    const cont = create("div",{
                        append:[
                            create("div",{
                                text: data.name,
                                style:`
                                    font-weight: bold;
                                `
                            }),

                        ]
                    });
                    create("input",{
                        attr:{
                            value: data.value ?? ""
                        },
                        events:{
                            input:( e )=>{
                                cont.value = e.target.value
                                console.log( cont.value );
                            }
                        },
                        onInit:( e )=>{
                           cont.value = e.value;
                           console.log( cont.value );
                        },
                        parent: cont,
                        style:`
                            border:2px solid #ddd;
                            border-radius: 5px;
                            height: 30px;
                            padding: 0 5px;
                            width: fit-content;
                            font-weight: bold;
                            color: gray;
                        `
                    })
                    return cont;

                };
                function connectDB( data = {}){
                    fetch("/system/core/CSMR/controllers_no_route/DB.php",{
                        method: "POST",
                        body: JSON.stringify({
                            server: elementsObjList.server.value,
                            user: elementsObjList.user.value,
                            password: elementsObjList.password.value,
                            port: elementsObjList.port.value,
                            base: elementsObjList.base.value,
                            type: type,
                            data: dataConfig
                        })
                    })
                    .then( r => r.text() )
                    .then( data => {
                        modalConnectSUBD.wobox.close();
                        console.log( data );
                        
                    })
                }
                function btnDB( obj ){
                    return create("div",{
                        text: obj.name ?? "Кнопка",
                        style: RenderDB__STYLE.btn,
                        events:{
                            click: ()=>{
                                connectDB();
                            }
                        }
                    })
                }
                create("div",{
                    append:[
                        elementsObjList.server = elemPoint({name: "Сервер"}),
                        elementsObjList.port = elemPoint({name: "Порт"}),
                        elementsObjList.user = elemPoint({name: "Пользователь"}),
                        elementsObjList.password = elemPoint({name: "Пароль"}),
                        elementsObjList.base = elemPoint({name: "База для подключения"}),

                        btnDB({name: "Подключить БД"})
                    ],
                    parent: cont,
                    style:`
                        display: grid;
                        justify-content: center;
                        gap: 5px;
                    `
                })
                const modalConnectSUBD = addModalWindow("Подключение к БД", cont);

            }
        }
    });
}

function checkProjectDB( option = {} ){
    const parent = option.parent;
    parent.append( create("div",{
        text: "<span style='border-bottom: 2px solid black; cursor: pointer;'>Базы данных проекта  <span style='font-family:monospace; font-size:0.8rem; color: gray;'> [DOCUMENTATION] </span></span>",
        style: `
            font-weight: bold;
            font-size: 1.1rem;
            padding-bottom: 5px;
            margin-top: 20px;
        `
    }));
    fetch("/system/core/CSMR/controllers_no_route/ConnectProjectDB.php")
    .then(res => res.json())
    .then(data => {
        console.log( data );
        for( let pointData of data){
            let status = "";
            let defaultDB = "";
            if( pointData.connection_status == "Connected"){
                status = "<span style='color: green;font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 6px green; display: grid; justify-items: center;'>&#8226;</span>"
            }
            else{
                status = "<span style='color: red;font-weight: bold; font-size: 1.2rem; text-shadow: 0 0 6px red; display: grid; justify-items: center;'>&#8226;</span>"
            }
            if( pointData.default_db == 1){
                defaultDB = "&#10003;"
            }

            myTableProject.add({
                data:[
                    null,
                    pointData.name_db,
                    pointData.subd,
                    status,
                    pointData.server,
                    defaultDB,
                    pointData.desc_db
                ]
            });
        }

    });
    let myTableProject = new CreateTable({
        columns: [
            {name: "#", width: "40px", ai: true},
            {name: "NameDB", width: "1fr"},
            {name: "SUBD", width: "60px"},
            {name: "Status", width: "50px"},
            {name: "Server", width: "1fr"},
            {name: "Default", width: "50px"},
            {name: "Desc", width: "1fr"},
        ],
        parent: parent
    });

    create("div",{
        text: "Развернуть базу для роутинга",
        style: RenderDB__STYLE.btn,
        parent,
        events:{
            click: ()=>{
                const cont = create("div");
                const titleInfo = create("div",{
                    parent: cont,
                    text: "Необходимо подключиться с СУБД, введите данные для подключения, дальше нужно создать базу данных для роутинга, все создается автоматически(необходимо лишь дать название базе данных). В данной базе данных развернется ядро роутинга как для фрейморка Wobox, так же и для Вашего проекта. В данный момент поддерживается mysql"
                })
                const elementsObjList = {};
                function elemPoint( data ){
                    const cont = create("div",{
                        append:[
                            create("div",{
                                text: data.name,
                                style:`
                                    font-weight: bold;
                                `
                            }),

                        ]
                    });
                    create("input",{
                        attr:{
                            value: data.value ?? ""
                        },
                        events:{
                            input:( e )=>{
                                cont.value = e.target.value
                                console.log( cont.value );
                            }
                        },
                        onInit:( e )=>{
                           cont.value = e.value;
                           console.log( cont.value );
                        },
                        parent: cont,
                        style:`
                            border:2px solid #ddd;
                            border-radius: 5px;
                            height: 30px;
                            padding: 0 5px;
                            width: fit-content;
                            font-weight: bold;
                            color: gray;
                        `
                    })
                    return cont;

                };
                function connectSUBD( data = {}){
                    fetch("/system/core/CSMR/controllers_no_route/ConnectSUBD.php",{
                        method: "POST",
                        body: JSON.stringify({
                            server: elementsObjList.server.value,
                            user: elementsObjList.user.value,
                            password: elementsObjList.password.value,
                            port: elementsObjList.port.value,
                            base: elementsObjList.base.value,
                        })
                    })
                    .then( r => r.text() )
                    .then( data => {
                        modalConnectSUBD.wobox.close();
                        console.log( data );
                        
                    })
                }
                function btnDB( obj ){
                    return create("div",{
                        text: obj.name ?? "Кнопка",
                        style: RenderDB__STYLE.btn,
                        events:{
                            click: ()=>{
                                connectSUBD();
                            }
                        }
                    })
                }
                create("div",{
                    append:[
                        elementsObjList.server = elemPoint({name: "Сервер"}),
                        elementsObjList.port = elemPoint({name: "Порт"}),
                        elementsObjList.user = elemPoint({name: "Пользователь"}),
                        elementsObjList.password = elemPoint({name: "Пароль"}),
                        elementsObjList.base = elemPoint({name: "Придумайте название базы данных"}),
                        create("div",{
                            append:[
                                create("label",{
                                    append:[
                                        create("input",{
                                            attr:{
                                                type: "checkbox",
                                                checked: true
                                            }   
                                        }),
                                        create("span",{
                                            text: "Роутинг ядра фреймворка"
                                        })
                                    ]
                                }),
                                create("label",{
                                    append:[
                                        create("input",{
                                            attr:{
                                                type: "checkbox",
                                                checked: true
                                            }   
                                        }),
                                        create("span",{
                                            text: "Роутинг проекта"
                                        })
                                    ]
                                })

                            ],
                            style:`
                                display: grid;
                            `
                        }),
                        btnDB({name: "Создать роутинг"})
                    ],
                    parent: cont,
                    style:`
                        display: grid;
                        justify-content: center;
                        gap: 5px;
                    `
                })
                const modalConnectSUBD = addModalWindow("Подключение к СУБД", cont);

            }
        }
    
    });
}

/**
 * Renders a UI component to switch the development status (e.g., 'local' vs 'prod').
 * Fetches the current status from typeDev.json and provides a dropdown to change it.
 * @param {HTMLElement} parent The parent element to append the switcher UI to.
 */
function renderDevTypeSwitcher(parent) {
    const container = create('div', {
        style: `
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        `
    });

    const title = create('div', {
        text: 'Режим работы',
        style: `
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 1.1rem;
        `
    });

    const formContainer = create('div', {
        style: `
            display: flex;
            align-items: center;
            gap: 10px;
        `
    });
    
    container.append(title, formContainer);
    parent.append(container);

    // Fetch the current config to build the select menu
    fetch("/system/core/configs/typeDev.json", { cache: "no-cache" })
        .then(r => r.ok ? r.json() : Promise.reject('File not found or unreadable'))
        .then(data => {
            const currentStatus = data.status;
            const statusOptions = data.typeDevList;

            if (!statusOptions || !Array.isArray(statusOptions)) {
                formContainer.textContent = 'Ошибка: список режимов (typeDevList) не найден в typeDev.json.';
                return;
            }

            const selectEl = create('select', {
                style: `
                    padding: 8px;
                    border-radius: 3px;
                    border: 1px solid #ccc;
                    min-width: 150px;
                    font-size: 1rem;
                `
            });

            statusOptions.forEach(opt => {
                const optionEl = create('option', { value: opt, text: opt });
                if (opt === currentStatus) {
                    optionEl.selected = true;
                }
                selectEl.append(optionEl);
            });

            const saveButton = create('div', {
                text: 'Загрузить',
                style: RenderDB__STYLE.btn // Reuse existing style
            });
            
            saveButton.onclick = () => {
                const newStatus = selectEl.value;
                saveButton.textContent = 'Сохранение...';
                saveButton.style.pointerEvents = 'none';
                saveButton.style.opacity = '0.7';

                fetch('/system/core/CSMR/controllers_no_route/UpdateDevType.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                })
                .then(r => r.json())
                .then(response => {
                    if (response.success) {
                        // Reload the entire DB view to reflect changes
                        renderDB(parent);
                    } else {
                        alert('Ошибка сохранения: ' + response.message);
                        saveButton.textContent = 'Сохранить';
                        saveButton.style.pointerEvents = 'auto';
                        saveButton.style.opacity = '1';
                    }
                })
                .catch(err => {
                    alert('Произошла критическая ошибка сети.');
                    console.error(err);
                    saveButton.textContent = 'Сохранить';
                    saveButton.style.pointerEvents = 'auto';
                    saveButton.style.opacity = '1';
                });
            };

            formContainer.append(selectEl, saveButton);

        }).catch(err => {
            console.error("Не удалось загрузить typeDev.json:", err);
            const errorDiv = create('div', { 
                text: 'Ошибка: Не удалось загрузить файл конфигурации typeDev.json.', 
                style: 'color: red;' 
            });
            container.append(errorDiv);
        });
}