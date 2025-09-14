import {create, watch} from "/src/js/components/woboxNew.js";
import {addModalWindow} from "/src/js/components/windowModal.js";


export function addNewService(){
    let dataObj = {
        subjectId: 0,
        cityId: 0,
        serviseList: {}
    };
    dataObj = watch(dataObj);

    const cont = create("div");

    const regionCont = create("div",{
        parent: cont,
        append: [
            create("div",{
                text: '<span style="color: red; font-weight: bold;">*Внимание</span>: здесь Вы оформляетесь, если собираетесь работать <span style="color:#ff7a00; font-weight: bold;">сами на себя</span>! Вы не сможете указать другое имя и номер телефона, если хотите <span style="color: blue; text-decoration: underline; font-weight: bold; cursor: pointer;">работать в команде</span>, создайте через кнопку "Добавить компанию"',
                style:`
                    font-size:.8rem;
                    font-style: italic;
                `
            }),
            create("div",{
                text: 'Регион оказания услуг',
                style:`
                    font-weight: bold;
                    font-size:.9rem;
                `
            }),
            create("select",{
                onInit:( e ) => {
                    fetch(`/api/getSubjectList`)
                    .then( r => r.json())
                    .then( data => {
                        console.log( data );
                        create("option",{
                            attr:{
                                value:  '0',
                            },
                            text: 'Выбрать регион',
                            parent: e,
                            attr:{
                                value: '0'
                            },
                        });
                        data.forEach( (point, index) => {
                            let option = create("option",{
                                attr:{
                                    value:  point.subject_code_geonames,
                                },
                                text: point.name_ru,
                                parent: e,
                                attr:{
                                    'data-longitude': point.longitude,
                                    'data-latitude': point.latitude,
                                    value: point.subject_code_geonames
                                },
                            });
                        })
                    });
                },
                events:{
                    input: ( e )=>{
                        dataObj.subjectId = e.target.value;
                        console.log( dataObj );
                        console.log( JSON.stringify( dataObj , (key, value) => {
                            if (key === "isProxy" || key == 'writeList' || key == 'callbackList') {
                              return undefined;
                            }
                            return value;
                        }));


                        fetch(`/api/getCitiesListFromSubject`,{
                            method: 'post',
                            body: JSON.stringify( {subject_code: e.target.value} )
                        })
                        .then( r => r.json())
                        .then( data =>{
                            console.log( data );
                            citySelectElem.innerHTML = '';
                            create("option",{
                                text: 'Выберете регион',
                                attr:{
                                    value: 0
                                },
                                value: 0,
                                parent:citySelectElem
                            });
                            data.forEach( (point, index) =>{
                                create("option",{
                                    text: point.name_ru,
                                    attr:{
                                        value: point.geonameid
                                    },
                                    value:  point.geonameid,
                                    parent:citySelectElem
                                });

                            })
                        })
                    }
                },
                style:`
                    height: 35px;
                `
            })
        ]
    });
    let citySelectElem = '';
    const cityCont = create("div",{
        parent: cont,
        append: [
            create("div",{
                text: 'Населенный пункт',
                style:`
                    font-weight: bold;
                    font-size:.9rem;
                `
            }),
            citySelectElem = create("select",{
                append:[
                    create("option",{
                        text: 'Выберите регион',
                        attr:{
                            value: 0
                        },
                        value: 0
                    })
                ],
                style:`
                    height: 35px;
                    margin-bottom: 10px;
                `,
                events:{
                    input: ( e ) =>{
                        dataObj.cityId = e.target.value;
                        console.log( dataObj );
                        console.log( JSON.stringify( dataObj , (key, value) => {
                            if (key === "isProxy" || key == 'writeList' || key == 'callbackList') {
                              return undefined;
                            }
                            return value;
                        }));

                    }
                }
            })
        ]
    });
    const select = create("div",{
        parent: cont,
        append:[
            create("div",{
                text: 'Выберите услуги',
                style:`font-weight: bold`
            })
        ],
        style:`
            display: grid;
            gap: 10px;
        `
    });
    let actionServiceList = [
        {id: 1, text:"Прогрев Авто"},
        //{id: 2, text:"Прикурить Авто"},
        // {id: 3, text:"Пьяный водитель"},
        // {id: 4, text:"Замена колеса"},
    ];

    actionServiceList.forEach( (point, index) =>{
        // let dataObj = {
        //     subjectId: 0,
        //     cityId: 0,
        //     serviseList: []
        // };
        dataObj.serviseList[point.id] = {};
        const parentExe = create('div',{
            parent: select,
            style:`
                display: grid;
            `
        })
        create("label",{
            text: point.text,
            append:[
                create("input",{
                    attr:{
                        value: point.id,
                        type: 'checkbox'
                    },
                    value: point.id,
                    text: point.text,
                    events:{
                        input: ( e ) =>{
                            if( e.target.checked == true){
                                dataObj.serviseList[point.id].checked = true;
                            }
                            else{
                                dataObj.serviseList[point.id].checked = false;
                            }
                            console.log( dataObj );
                        }
                    }
                })
            ],
            parent: parentExe,
            style:`
                font-weight: bold;
                color: #FF7A00;
                display: grid;
                grid-auto-flow: column;
                gap: 5px;
                justify-content: start;
            `
        });
        
        const contForExeOption = create("div",{
            parent: parentExe,
            style:`
                border-left: 2px solid orange;
                padding-left:10px;
            `
        });


        create("div",{
            append:[
                create("div",{
                    text: 'Комментарий к услуге',
                    style:`font-weight: bold; font-size: .9rem;`
                }),
                create("textarea",{
                    attr:{
                        placeholder:"Оставьте комментарий"
                    },
                    events:{
                        input: ( e ) =>{
                            dataObj.serviseList[point.id].msg = e.target.value;
                        }
                    }
                })
            ],
            style:`
                display: grid;
                gap: 5px;
            `,
            parent: contForExeOption
        });

        
        create("div",{
            parent: contForExeOption,
            append:[
                create("div",{
                    text: 'Стоимость услуги',
                    style:`font-weight: bold; font-size: .9rem; padding-top: 10px;`
                }),
                create("div",{
                    append:[
                        // create("div",{
                        //     append:[
                        //         create("label",{
                        //             append:[
                        //                 create('input',{
                        //                     attr:{
                        //                         type: 'radio',
                        //                         name: 'typePrice'
                        //                     }
                        //                 })
                        //             ],
                        //             text: 'За услугу',
                        //             style:`font-size: .9rem;`
                        //         }),
                        //         create("label",{
                        //             append:[
                        //                 create('input',{
                        //                     attr:{
                        //                         type: 'radio',
                        //                         name: 'typePrice'
                        //                     }
                        //                 })
                        //             ],
                        //             text: 'За час',
                        //             style:`font-size: .9rem;`
                        //         }),
                        //     ]
                        // })
                    ]
                }),
                create("div",{
                    append:[

                        create('div',{
                            append:[
                                create("div",{
                                    text: 'От ',
                                    style:`font-size: .9rem; font-weight: bold;`
                                }),
                                create("input",{
                                    attr:{
                                        placeholder:"в руб.",
                                        max:'99999',
                                        type: 'number',
                                        step: '1'
                                    },
                                    style:`
                                        width: 5em;
                                    `,
                                    events:{
                                        input: ( e ) =>{
                                            dataObj.serviseList[point.id].sumfrom = e.target.value;
                                        }
                                    }
                                }),
                            ],
                            style:`
                                display: flex;
                                gap: 5px;
                            `
                        }),
                        create('div',{
                            append:[
                                create("div",{
                                    text: 'До ',
                                    style:`font-size: .9rem; font-weight: bold;`
                                }),
                                create("input",{
                                    attr:{
                                        placeholder:"в руб.",
                                        max:99999,
                                        type: 'number'
                                    },
                                    style:`
                                        width: 5em;
                                    `,
                                    events:{
                                        input: ( e ) =>{
                                            dataObj.serviseList[point.id].sumto = e.target.value;
                                        }
                                    }
                                }),
                            ],
                            style:`
                                display: grid;
                                gap:5px;
                                grid-auto-flow: column;
                                justify-content: start;
                                align-content: center;
                            `
                        }),
                    ],
                    style:`
                        display: flex;
                        gap:15px;
                    `
                })
            ],
            style:`
                display: grid;
                gap: 5px;

            `
        });
    });

    create("div",{
        append:[
            create("button",{
                class: "btn",
                text: "Подтвердить",
                parent: cont,
                events:{
                    click: ( e ) =>{
                        console.log( dataObj );
                        fetch(`/api/service`,{
                            method: 'post',
                            body: JSON.stringify( dataObj )
                        })
                        .then( r => r.json() )
                        .then( data => {
                            console.log( data );
                        })
                    }
                }
            })
        ],
        parent: cont,
        style:`
            display: grid;
            justify-content: center;
            padding: 15px;
        `
    });

    create("div",{
        append:[
            create("div",{
              
                text: "Предложить добавить новую услугу",
                parent: cont,
                style:`
                    color: gray;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: .8rem;
                    text-decoration: underline;
                `,
                events:{
                    click: ( e ) => {
                        const cont = create("div",{
                            style:`
                                display: grid;
                                gap: 10px;
                            `
                        });
                        const nameService = create("input",{
                            attr:{
                                placeholder: 'Название услуги'
                            },
                            parent: cont
                        });
                        const descService = create("textarea",{
                            attr:{
                                placeholder: 'Описание услуги'
                            },
                            parent: cont
                        });
                        create("button",{
                            class: "btn",
                            style: `width: 100%;`,
                            text: "Предложить",
                            parent: cont,
                            events:{
                                click: ( e ) =>{
            
                                }
                            }
                        })
                        addModalWindow('Рекомендация услуги', cont );
                    }
                }
            })
        ],
        parent: cont,
        style:`
            display: grid;
            justify-content: center;
        
        `
    })

    addModalWindow('Оказывать услугу', cont);
}