import {create, CreateMenu} from "/src/js/components/woboxNew.js";

import {addModalWindow} from "/src/js/components/windowModal.js";
export class CreateTable{
    

    constructor( obj ){

        this.count = 1;
        this.index = null;
        this.styleColumns = "";
        this.cont = create("div",{
            parent: obj.parent
        });
        const title = create("div",{
            parent: this.cont
        });
        let row = null;
        this.primary = "";
        this.primaryIndex = "";
        
        obj.columns.forEach( (column, index) =>{
            this.styleColumns += column.width + " ";

            row = create("div",{
                parent: title,
                text: "<b>" + column.name + "</b>",
            })
            if(column.primary){
                this.primary = column.primary;
                this.primaryIndex = index;
                row.wobox.primary = true;
                row.wobox.primaryIndex = index;
            }
            if(row.wobox){
                row.wobox.root = this.cont;
            }
            else{
                row.wobox = {};
                row.wobox.root = this.cont;
            }
        
        })

        title.wobox = {};
        title.wobox.primary = this.primary;
        title.wobox.primaryIndex = this.primaryIndex;
        title.style.cssText = `
            display: grid;
            grid-template-columns: ${this.styleColumns};
            gap:10px;
        `;
    }
    add( obj ){
        const rowCont = create("div",{
            css:`
                .$class{
                    display: grid;
                    grid-template-columns: ${this.styleColumns};
                    gap:10px;
                }
                .$class:hover{
                    color: yellow;
                }
                .$class > div{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

            `,
            parent: this.cont
        })
        if( obj.callback ){
            rowCont.addEventListener("click",()=>{
                obj.callback();
            })
            rowCont.style.cursor = "pointer";
        }
        rowCont. wobox = {};
        this.index = obj.data[3];
        rowCont.wobox.userId = this.index;
        obj.data.forEach((value, index)=>{

            if(value instanceof HTMLElement){
                rowCont.append( value );
                value.wobox = {};
                value.wobox.index = this.index;
            }
            else{
                const elem = create("div",{
                    parent: rowCont,
                    text: index == 0 ? `<b>${this.count++}</b>` : value
                })
                elem.wobox = {};
                elem.wobox.index = this.index;
            }
        })
        if(rowCont.wobox){
            rowCont.wobox.root = this.cont;
            rowCont.wobox.index = this.index;
        }
        else{
            rowCont.wobox = {};
            rowCont.wobox.root = this.cont;
            rowCont.wobox.index = this.index;
        }
    }
    remove( obj ){

    }
    move( obj ){

    }
}




// changeLanguage("ru");
// onclick = ()=>{
//     changeLanguage("en");
// }














// import {create, selectBtn, select} from "/src/js/components/woboxNew.js";
// import {addModalWindow} from "/src/js/components/windowModal.js";
// export class CreateTable{


//     constructor( obj ){
//         // {
//         //     columns: [
//         //         {name: "#", width: "40px", ai: true},
//         //         {name: "ФИО", width: "3fr"},
//         //         {name: "Должность", width: "1fr"},
//         //         {name: "ID", width: "90px", primary: true},
//         //         {name: "", width: "25px"},
//         //     ]
//         //     parent: resultReserve.elementListPoint
//         // }
//         this.count = 1;
//         this.index = null;
//         this.styleColumns = obj.columnsWidth.join(" ");
//         this.cont = create("div",{
//             parent: obj.parent
//         });
//         const title = create("div",{
//             style: `
//                 display: grid;
//                 grid-template-columns: ${this.styleColumns};
//                 gap:10px;
//             `,
//             parent: this.cont
//         });
//         for(let column of obj.columns){
//             create("div",{
//                 parent: title,
//                 text: "<b>" + column.name + "</b>"
//             })
//         }
//         title.style.cssText = ``;
//     }














//     add( obj ){
//         const rowCont = create("div",{
//             style: `
//                 display: grid;
//                 grid-template-columns: ${this.styleColumns};
//                 gap:10px;
//             `,
//             parent: this.cont
//         })
//         rowCont. wobox = {};
//         this.index = obj.data[3];
//         rowCont.wobox.userId = this.index;
//         obj.data.forEach((value, index)=>{

//             if(value instanceof HTMLElement){
//                 rowCont.append( value );
//                 value.wobox = {};
//                 value.wobox.index = this.index;
//             }
//             else{
//                 const elem = create("div",{
//                     parent: rowCont,
//                     text: index == 0 ? `<b>${this.count++}</b>` : value
//                 })
//                 elem.wobox = {};
//                 elem.wobox.index = this.index;
//             }
//         })
//     }
//     remove( obj ){
   
//     }
//     move( obj ){

//     }
// }
