import {create} from "/src/js/components/woboxNew.js";
import {countUrlSegments} from "/system/core/src/js/global/countUrlSegments.js";

export function contInputUriAndCountParam( obj ){
    let value = obj.objDB &&  obj.objDB.uri ?  obj.objDB.uri : "";
    obj.reply.obj['uriOld'] = value;
    let valueCountSegments = obj.objDB &&  obj.objDB.uri ? countUrlSegments( obj.objDB.uri ) : 0
    obj.reply.obj['countParam'] = obj.objDB &&  obj.objDB.countParam ?  obj.objDB.countParam : ""
    obj.reply.obj['countParamBack'] = obj.objDB &&  obj.objDB.countParamBack ?  obj.objDB.countParamBack : ""
    const parentElem = create("div");
    create("div",{
        text: "URI",
        style:`
            font-weight: bold;
            font-size: 0.8rem;
        `,
        parent: parentElem
    });
    const inputElem = create("input",{
        attr:{
            style:`
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 3px;
                width: 100%;
                font-family: monospace;
            `,
            value: value
        },
        events:{
            input: (e) => {
                console.log("paramCount: ", countUrlSegments(e.target.value))
                paramCountInfo.innerHTML = "paramCount: " + countUrlSegments(inputElem.value);
                parentElem.childNodes[3].childNodes[1].value = countUrlSegments(inputElem.value);
                obj.reply.obj['uri'] = inputElem.value;
                obj.reply.obj['countParam'] = countUrlSegments(inputElem.value);
                obj.reply.obj['countParamBack'] = countUrlSegments(inputElem.value);
            }
        },
        parent: parentElem
    });
    
    const paramCountInfo = create("div",{
        text: "",
        style:`font-size: .6rem;`,
        parent: parentElem
    });
    create("div",{
        append:[
            create("div",{
                text: "<b>check count param:</b> ",
                style: `font-size: .6rem;`
            }),
            create("input",{
                attr:{
                    type: "number",
                    value: valueCountSegments ? valueCountSegments :0
                },
                style: `width: 50px;`,
                events:{
                    input: (e)=>{
                        console.log( "new new new" );
                        obj.reply.obj['countParamBack'] = e.target.value;
                    }
                }
            })
        ],
        parent: parentElem
    });

    obj.reply.obj['uri'] = inputElem.value;
    obj.reply.obj['countParam'] = 0;
    obj.reply.obj['countParamBack'] = 0;    
    return parentElem;
}