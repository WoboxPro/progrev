<?php
    require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/Autoloader.php";
    require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/migration/CreateBaseForCore.php";
    require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/components/global/head.php";
?>  
<body id="cool">
    <div id="cont" class="cont"></div>

    <script type="module">
        import {create, CreateMenu, changeLanguage, checkLanguage, select, updateWatch, watch} from "/src/js/components/woboxNew.js";
        import {addModalWindow} from "/src/js/components/windowModal.js";
        import {renderWelcome} from "/system/core/src/js/route/components/renderWelcome.js";
        import {selectTypecallback} from "/system/core/src/js/route/components/selectTypecallback.js";
        import {selectTypeapi} from "/system/core/src/js/route/components/selectTypeapi.js";
        import {selectMethod} from "/system/core/src/js/route/components/selectMethod.js";
        import {selectServer} from "/system/core/src/js/route/components/selectServer.js";
        import {selectFolderPage} from "/system/core/src/js/route/components/selectFolderPage.js";
        import {selectTypeRequest} from "/system/core/src/js/route/components/selectTypeRequest.js";
        import {inputAddToDocumentation} from "/system/core/src/js/route/components/inputAddToDocumentation.js";
        import {textareaDescription} from "/system/core/src/js/route/components/textareaDescription.js";
        import {inputCreateFile} from "/system/core/src/js/route/components/inputCreateFile.js";
        import {inputCallback} from "/system/core/src/js/route/components/inputCallback.js";
        import {contInputUriAndCountParam} from "/system/core/src/js/route/components/contInputUriAndCountParam.js";
        import {routeModalWindow} from "/system/core/src/js/route/components/routeModalWindow.js";
        import {renderDB} from "/system/core/src/js/route/components/DB/renderDB.js";
        import {renderSettings} from "/system/core/src/js/route/components/settings/renderSettings.js";
        import {renderServers} from "/system/core/src/js/servers/renderServers.js";

        //import { create, watch, _div, updateWatch } from "/src/js/components/woboxNew.js";
        import { CreateTable } from "/src/js/components/woboxTable.js";
        checkLanguage();
        const createMenu = new CreateMenu( {
            name: "MENU",
            pointList:[
                {text: "Welcome", callback: ()=>{ renderWelcome( createMenu.contRender )}, textLang:{ru: "Добро пожаловать", en: "Welcome"}},
               // {text: "DashBoard", callback: ()=>{}, textLang:{ru: "Панель инструментов", en: "DashBoard"}},
                // {text: "Projects",  textLang:{ru: "Проекты", en: "Projects"} },
                {text: "DB", callback: ()=>{ renderDB( createMenu.contRender )}, textLang:{ru: "Базы данных", en: "DB"}},
                {text: "Route", callback: ()=>{ renderRoute( createMenu.contRender ) }, textLang:{ru: "Роутинг", en: "Route"}},
                {text: "DB", callback: ()=>{ renderServers( createMenu.contRender )}, textLang:{ru: "Мои сервара", en: "My servers"}},

                {text: "Settings", callback: ()=>{ renderSettings( createMenu.contRender ) } , textLang:{ru: "Настройки", en: "Settings"}},
                //{text: "CSMR", callback: ()=>{}, textLang:{ru: "CSMR", en: "CSMR"}},
                //{text: "Autoloader", callback: ()=>{}, textLang:{ru: "Автозагрузка", en: "Autoloader"}},
                //{text: "Middleware", callback: ()=>{}, textLang:{ru: "Роли и доступ", en: "Middleware"}},
                //{callback: ()=>{}, textLang:{ru: "Мои cервера", en: "My servers"}},
                //{callback: ()=>{}, textLang:{ru: "Документация", en: "Documentation"}},
                //{text: "Instruction", callback: ()=>{}, textLang:{ru: "Инструкция", en: "Instruction"}},
            ],
            parent: cont
        });
        renderWelcome( createMenu.contRender );
        function renderRoute( parent ){
            parent.innerHTML = "";
            create("div",{
                parent: parent,
                append:[
                    create("div",{
                        text: "Route",
                        style: `
                            font-weight: bold;
                            font-size: 1.2rem;
                            text-decoration: underline;
                        `
                    }),
                    create("div",{
                        append:[
                            create("div",{
                                text: "Выбрать роутинг"
                            }),
                            create("select",{
                                append:[
                                    create("option",{
                                        text: "Project",
                                        attr:{
                                            value: "project"
                                        }
                                    }),
                                    create("option",{
                                        text: "Core",
                                        attr:{
                                            value: "core"
                                        }
                                    })
                                ],
                                style:`
                                    height: 35px;
                                    border: none;
                                    border-radius: 5px;
                                    font-weight: bold;
                                    text-decoration: underline;
                                    outline: none;
                                `,
                                events:{
                                    input: ( e )=>{
                                        tableRout.clear();

                                        // let value = e.target.getAttribute("value");
                                        // console.log( e, e.target.value );
                                        console.log(e.target.value );
                                        if( e.target.value == "core"){
                                            routeTableRender( {route: "core"} );
                                        }
                                        else{
                                            routeTableRender();
                                        }

                                    }
                                },
                                onInit:()=>{
                                    routeTableRender();
                                }
                            })
                        ],
                        style:`
                            display: grid;
                            grid-auto-flow: column;
                            justify-content: start;
                            gap: 5px;
                            align-content: center;
                            align-items: center;
                        `
                    }),
                ]
            })


            const dataRout = watch([]);
            const tableRout = new CreateTable( {
                data: dataRout,
                columns:[
                            {
                                "name": "uri",
                                "key": "uri",
                                "width": "1fr",
                                "hidden": false,
                                "bold": true
                            },
                            {
                                "name": "callback",
                                "key": "callback",
                                "width": "1fr",
                                "hidden": false
                            },
                            {
                                "name": "type_callback",
                                "key": "type_callback",
                                "width": "1fr",
                                "hidden": false
                            },
                            {
                                "name": "type_api",
                                "key": "type_api",
                                "width": "1fr",
                                "hidden": false
                            },
                            {
                                "name": "method",
                                "key": "method",
                                "width": "1fr",
                                "hidden": false
                            },
                            {
                                "name": "description_rout",
                                "key": "description_rout",
                                "width": "1fr",
                                "hidden": false
                            }
                    ],
                    callback: (rowData, index, rowDataObject, option) => {
                        const cont = routeModalWindow( {data: {}, dataDB: rowDataObject} );
                        const modal = addModalWindow( rowDataObject.uri , cont);
                    }
            });
            parent.appendChild(tableRout.container);
            create("div",{
                textLang: {ru: "Добавить роутинг", en: "Add route"},
                parent: parent,
                css:`
                    .$class{
                        height: 35px;
                        padding: 0 30px;
                        border-radius: 5px;
                        border: 2px solid black;
                        display: grid;
                        place-content: center;
                        text-align: center;
                        width: 200px;
                        cursor: pointer;
                    }
                `,
                events:{
                    click: ()=>{
                        const objDataForAddRout = {};
                        const cont = routeModalWindow( {data: objDataForAddRout} );
                        const modal = addModalWindow( "Add Route" , cont);
                        modal.style.paddingBottom = "5px";
                    }
                }
            })
            function routeTableRender( data = {route: "project"}){
                fetch(`/system/core/Route.php`,{
                    method: "post",
                    body: JSON.stringify( data )
                })
                .then(r => r.json())
                .then(data => {
                    const dataForSave = {};
                    updateWatch( dataRout, data );
                })
            }

        }

    </script>
</body>
</html>