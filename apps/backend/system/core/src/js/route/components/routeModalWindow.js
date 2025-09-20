import {create} from "/src/js/components/woboxNew.js";
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

export function routeModalWindow( obj ){
    console.log( obj);
    let btnSaveTextObj = obj.dataDB ? {ru: "Сохранить", en: "Save"} : {ru: "Добавить роутинг", en: "Add route"};
    const styleTitlePoint = `
                                font-weight: bold;
                                font-size: 0.8rem;
                            `;
                            
    const cont = create("div",{
        append:[
            contInputUriAndCountParam( {reply: {obj: obj.data}, objDB: obj.dataDB } ),

            create("div",{
                append:[
                    create("div",{
                        text: "Callback",
                        style: styleTitlePoint
                    }),
                    inputCallback( {
                        reply: {
                            obj: obj.data, 
                            prop: 'callback'
                        }, 
                        objDB: obj.dataDB
                    }),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Type callback",
                        style: styleTitlePoint
                    }),
                    selectTypecallback({reply: {obj: obj.data, prop: 'typeCallback'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    inputCreateFile({reply: {obj: obj.data, prop: 'createFile'}}),
                    create("label",{
                        text: "Create file",
                        attr:{
                            for: "checkPoint"
                        },
                    })
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Type Api",
                        style: styleTitlePoint
                    }),
                    selectTypeapi({reply: {obj: obj.data, prop: 'typeApi'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Method",
                        style: styleTitlePoint
                    }),
                    selectMethod({reply: {obj: obj.data, prop: 'method'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Server",
                        style: styleTitlePoint
                    }),
                    selectServer({reply: {obj: obj.data, prop: 'server'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Folder Page(path)",
                        style: styleTitlePoint
                    }),
                    selectFolderPage({reply: {obj: obj.data, prop: 'folderPage'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Type Request",
                        style: styleTitlePoint
                    }),
                    selectTypeRequest({reply: {obj: obj.data, prop: 'typeRequest'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        text: "Description",
                        style: styleTitlePoint
                    }),
                    textareaDescription({reply: {obj: obj.data, prop: 'desc'}, objDB: obj.dataDB}),
                ]
            }),
            create("div",{
                append:[
                    inputAddToDocumentation({reply: {obj: obj.data, prop: 'addDocumentation'}}),
                    create("label",{
                        text: "Add to documentation",
                        attr:{
                            for: "checkPoint"
                        }
                    })
                ]
            }),
            create("div",{
                append:[
                    create("div",{
                        textLang: btnSaveTextObj,
                        events:{
                            click: ()=>{
                                console.log("objDataForAddRout: ", obj.data);
                                let methodFetch = "";
                                methodFetch = obj.dataDB ?  "put" : "post"
                                for(let prop in obj.data){
                                    console.log( prop );
                                    if( obj.data[prop] === "" && (prop != "uriOld" && prop != "methodOld" && prop != "uri")){
                                        alert(`Заполните: ${ prop }`);
                                        return;
                                    }
                                }

                                const headers = new Headers({
                                    'typeQuery': 'core'
                                });
                                fetch(`/api/route`,{
                                    method: methodFetch,
                                    body: JSON.stringify( obj.data ),
                                    headers: headers
                                })
                                .then( r => r.text() )
                                .then( data => {
                                    console.log( data );
                                })
                            }
                        },
                        css:`
                            .$class{
                                display: grid;
                                height: 35px;
                                width: 200px;
                                place-content: center;
                                place-items: center;
                                text-align: center;
                                border: 2px solid green;
                                border-radius: 5px;
                                color: white;
                                font-weight: bold;
                                cursor: pointer;
                                user-select: none;
                                background: green;
                            }
                            .$class:hover{
                                border: 2px solid green;
                                color: green;
                                background: white;
                            }
                        `
                    }),
                    create("div",{
                        text: "Delete",
                        events:{
                            click: ()=>{
                                const headers = new Headers({
                                    'typeQuery': 'core'
                                });
                                const body = JSON.stringify({
                                    uri: obj.data?.uriOld || obj.data?.uri || '',
                                    countParam: obj.data?.countParam || obj.data?.countParamBack || undefined
                                });
                                fetch(`/api/route`,{
                                    method: 'DELETE',
                                    body,
                                    headers
                                })
                                .then(r=>r.text())
                                .then(resp=>{
                                    console.log('delete resp:', resp);
                                });
                            }
                        },
                        css:`
                            .$class{
                                display: grid;
                                height: 35px;
                                width: 200px;
                                place-content: center;
                                place-items: center;
                                text-align: center;
                                border: 2px solid red;
                                border-radius: 5px;
                                color: white;
                                font-weight: bold;
                                cursor: pointer;
                                user-select: none;
                                background: red;
                            }
                            .$class:hover{
                                border: 2px solid red;
                                color: red;
                                background: white;
                            }
                        `
                    })
                ],
                style:`
                    display: grid;
                    justify-content: center;
                    padding: 10px;
                    gap: 10px;
                `
            })
        ]
    })

    return cont;
}