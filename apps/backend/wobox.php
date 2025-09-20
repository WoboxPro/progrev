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
        import { CreateTable, CreateTable as CreateTableNew } from "/src/js/components/woboxTable.js";
        checkLanguage();
        const createMenu = new CreateMenu( {
            name: "MENU",
            pointList:[
                {text: "Welcome", callback: ()=>{ renderWelcome( createMenu.contRender )}, textLang:{ru: "Добро пожаловать", en: "Welcome"}},
               // {text: "DashBoard", callback: ()=>{}, textLang:{ru: "Панель инструментов", en: "DashBoard"}},
                // {text: "Projects",  textLang:{ru: "Проекты", en: "Projects"} },
                {text: "DB", callback: ()=>{ renderDB( createMenu.contRender )}, textLang:{ru: "Базы данных", en: "DB"}},
                {text: "Route", callback: ()=>{ renderRoute( createMenu.contRender ) }, textLang:{ru: "Роутинг", en: "Route"}},
                {text: "Migrations", callback: ()=>{ renderMigrations( createMenu.contRender ) }, textLang:{ru: "Миграции", en: "Migrations"}},
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
            // listen refresh events from modal actions
            window.addEventListener('routeListChanged', ()=> routeTableRender());

        }

        // ---------------- Migrations UI ----------------
        function renderMigrations(parent){
            parent.innerHTML = "";
            create("div",{
                parent,
                text: "Миграции (JSON)",
                style: `
                    font-weight: bold;
                    font-size: 1.2rem;
                    text-decoration: underline;
                    margin-bottom: 8px;
                `
            });

            const controls = create("div",{ parent, style:`display:flex; gap:8px; flex-wrap:wrap; align-items:center;` });
            const btnCreate = create("div",{
                parent: controls,
                text: {ru: "Создать миграцию", en: "Create migration"},
                style: `
                    color: black; font-weight: bold; border:2px solid black; height: 35px; padding: 0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;
                `,
                events:{ click: openCreateModal }
            });
            const btnRun = create("div",{
                parent: controls,
                text: {ru: "Выполнить pending", en: "Run pending"},
                style: `
                    color: #0a5; font-weight: bold; border:2px solid #0a5; height: 35px; padding: 0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;
                `,
                events:{ click: runPending }
            });

            const dataMigrations = watch([]);
            const table = new CreateTableNew({
                columns:[
                    { name: "version", key: "version", width: "160px" },
                    { name: "name", key: "name", width: "1fr" },
                    { name: "db", key: "dbName", width: "140px" },
                    { name: "applied", key: "applied", width: "90px", textAlign:"center" },
                    { name: "txn", key: "transactional", width: "80px", textAlign: "center" },
                    { name: "modified", key: "modifiedAt", width: "200px" }
                ],
                data: dataMigrations,
                callback: (rowData, index, rowObj) => {
                    const modal = addModalWindow(`Migration ${rowObj.version}`, create("div",{}));
                    const box = modal;
                    const cont = modal; // modal возвращает элемент-контейнер
                    const body = create("div",{ parent: cont, style:`display:grid; gap:6px; min-width:420px;` });
                    body.append(
                        create("div",{ text:`Name: ${rowObj.name}` }),
                        create("div",{ text:`DB: ${rowObj.dbName || '-'}` }),
                        create("div",{ text:`Transactional: ${rowObj.transactional}` }),
                        create("div",{ text:`Modified: ${rowObj.modifiedAt}` }),
                    );
                    const actions = create("div",{ parent: cont, style:`display:flex; gap:8px; justify-content:flex-end; margin-top:8px;` });
                    const btnDelete = create("div",{ text:"Удалить", style:`color:#b00020; border:2px solid #b00020; height:32px; padding:0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;` });
                    const btnClose = create("div",{ text:"Закрыть", style:`border:1px solid #bbb; height:32px; padding:0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;` });
                    actions.append(btnClose, btnDelete);

                    btnClose.onclick = ()=> modal.wobox.close();
                    btnDelete.onclick = ()=>{
                        if(!confirm(`Удалить миграцию ${rowObj.version}__${rowObj.name}?`)) return;
                        btnDelete.textContent='Удаление...'; btnDelete.style.pointerEvents='none';
                        fetch('/system/core/CSMR/controllers_no_route/MigrationsDelete.php',{
                            method:'POST', headers:{'Content-Type':'application/json'},
                            body: JSON.stringify({ version: rowObj.version, name: rowObj.name })
                        })
                        .then(r=>r.json())
                        .then(res=>{
                            if(res.success){ modal.wobox.close(); renderList(); }
                            else { alert(res.message||'Ошибка удаления'); btnDelete.textContent='Удалить'; btnDelete.style.pointerEvents='auto'; }
                        })
                        .catch(()=>{ alert('Сеть недоступна'); btnDelete.textContent='Удалить'; btnDelete.style.pointerEvents='auto'; });
                    };
                }
            });
            parent.append(table.container);
            renderList();

            function renderList(){
                fetch('/system/core/CSMR/controllers_no_route/MigrationsList.php', {cache:'no-cache'})
                  .then(r=>r.json())
                  .then(data=>{
                    const items = (data.items||[]).map(x=>{
                        const base = {
                            version: x.version,
                            name: x.name,
                            dbName: x.dbName || '- ',
                            applied: x.applied ? '✓' : '',
                            transactional: x.transactional ? 'true' : 'false',
                            modifiedAt: x.modifiedAt
                        };
                        // прокинем все остальные поля "как есть" для раскрытия деталей
                        return Object.assign({}, x, base);
                    });
                    updateWatch(dataMigrations, items);
                  })
                  .catch(()=>{
                    // silent
                  })
              }

            function openCreateModal(){
                const form = create("div",{ style:`display:grid; gap:8px; min-width:500px;` });
                const inputName = inputRow("Имя (lat/_)", "", /^(?:[a-zA-Z0-9_\-]+)$/);
                const inputDesc = inputRow("Описание", "");
                const inputExt = inputRow("Требуемые расширения (через запятую)", "pgcrypto,citext");
                const inputTrans = checkboxRow("Транзакционная", true);
                const dbSelectWrap = selectDbRow();
                const inputSchema = inputRow("Схема (необязательно)", "");
                const textareaUp = textareaRow("Up SQL (по одной инструкции на строку)");
                const textareaDown = textareaRow("Down SQL (по одной инструкции на строку)");
                const actions = create("div",{ style:`display:flex; gap:8px; justify-content:flex-end; margin-top:6px;` });
                const btnSave = create("div",{ text:"Сохранить", style:`color:black; font-weight:bold; border:2px solid black; height:35px; padding:0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;` });
                const btnCancel = create("div",{ text:"Отмена", style:`color:#333; border:1px solid #bbb; height:35px; padding:0 12px; border-radius:5px; cursor:pointer; display:grid; place-content:center;` });
                actions.append(btnCancel, btnSave);

                form.append(inputName.row, inputDesc.row, inputExt.row, inputTrans.row, dbSelectWrap.row, inputSchema.row, textareaUp.row, textareaDown.row, actions);
                const modal = addModalWindow("Create Migration", form);

                btnCancel.onclick = ()=> modal.wobox.close();
                btnSave.onclick = ()=>{
                    const name = inputName.get();
                    if(!name){ alert('Некорректное имя'); return; }
                    const payload = {
                        name,
                        description: inputDesc.get(),
                        requiresExtensions: inputExt.get().split(',').map(s=>s.trim()).filter(Boolean),
                        transactional: inputTrans.get(),
                        dbName: dbSelectWrap.get(),
                        schema: inputSchema.get(),
                        up: splitLines(textareaUp.get()),
                        down: splitLines(textareaDown.get())
                    };
                    btnSave.textContent = 'Сохранение...'; btnSave.style.pointerEvents='none';
                    fetch('/system/core/CSMR/controllers_no_route/MigrationsCreate.php',{
                        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
                    })
                    .then(r=>r.json())
                    .then(res=>{
                        if(res.success){ modal.wobox.close(); renderMigrations(parent); }
                        else { alert(res.message||'Ошибка'); btnSave.textContent='Сохранить'; btnSave.style.pointerEvents='auto'; }
                    })
                    .catch(()=>{ alert('Сеть недоступна'); btnSave.textContent='Сохранить'; btnSave.style.pointerEvents='auto'; });
                };

                function splitLines(t){ return (t||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean); }
                function inputRow(label, defValue = "", pattern){
                    const row = create("div",{ style:`display:grid; gap:4px;` });
                    const l = create("div",{ text: label, style:`font-weight:bold;` });
                    const i = create("input",{ attr:{ value: defValue }, style:`height:32px; padding:0 8px; border:1px solid #bbb; border-radius:4px;` });
                    row.append(l,i);
                    return { row, get:()=>{ const v=i.value.trim(); return pattern? (pattern.test(v)?v:"") : v; } };
                }
                function checkboxRow(label, defChecked=true){
                    const row = create("label",{ style:`display:flex; gap:8px; align-items:center;` });
                    const i = create("input",{ attr:{ type:'checkbox', checked: defChecked } });
                    const t = create("span",{ text: label });
                    row.append(i,t);
                    return { row, get:()=> !!i.checked };
                }
                function textareaRow(label){
                    const row = create("div",{ style:`display:grid; gap:4px;` });
                    const l = create("div",{ text: label, style:`font-weight:bold;` });
                    const a = create("textarea",{ style:`min-height:120px; padding:6px 8px; border:1px solid #bbb; border-radius:4px; font-family:monospace;` });
                    row.append(l,a);
                    return { row, get:()=> a.value };
                }
                function selectDbRow(){
                    const row = create("div",{ style:`display:grid; gap:4px;` });
                    const l = create("div",{ text: "База данных", style:`font-weight:bold;` });
                    const s = create("select",{ style:`height:32px; padding:0 8px; border:1px solid #bbb; border-radius:4px;` });
                    row.append(l,s);
                    fetch('/system/core/configs/typeDev.json', {cache:'no-cache'})
                      .then(r=>r.json())
                      .then(dev=> fetch('/system/core/configs/configs.json', {cache:'no-cache'}).then(r=>r.json()).then(cfg=>({dev,cfg})))
                      .then(({dev,cfg})=>{
                        const listName = (dev.status === 'prod') ? 'DBList_Server' : 'DBList';
                        const list = (cfg.project && cfg.project[listName]) ? cfg.project[listName] : [];
                        list.forEach(it=>{
                            const opt = document.createElement('option');
                            opt.value = it.name_db;
                            opt.textContent = `${it.name_db} (${it.subd}@${it.server})`;
                            s.append(opt);
                        });
                      })
                      .catch(()=>{
                        const opt = document.createElement('option');
                        opt.value = '';
                        opt.textContent = '—';
                        s.append(opt);
                      });
                    return { row, get:()=> s.value };
                }
            }

            function runPending(e){
                const btn = (e && e.currentTarget) ? e.currentTarget : null;
                if (btn) { btn.textContent = 'Запуск...'; btn.style.pointerEvents='none'; }
                fetch('/system/core/CSMR/controllers_no_route/MigrationsRun.php', { method:'POST' })
                  .then(r=>r.json())
                  .then(res=>{
                    if (btn) { btn.textContent = 'Выполнить pending'; btn.style.pointerEvents='auto'; }
                    if(!res.success){ alert(res.message||'Ошибка выполнения'); return; }
                    renderList();
                  })
                  .catch(()=>{ if (btn) { btn.textContent = 'Выполнить pending'; btn.style.pointerEvents='auto'; } alert('Сеть недоступна'); });
            }
        }

    </script>
</body>
</html>