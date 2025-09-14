export function changeLanguage(newLang) {
    localStorage.setItem('lang', newLang);
    const event = new CustomEvent('languageChange', { detail: { lang: newLang } });
    window.dispatchEvent(event);
}
// Создание узла
export function createNode(name, element, children = null) {
    return { name, element, child: children };
}
export function build(siteMap, parent = null) {
    siteMap.forEach(item => {
        parent.appendChild(item.element);
        if (item.child) {
            build(item.child, item.element);
        }
    });
}
// Конец создания узла -------------------------------------------------------------------------------------- 

export function watch( obj ){
    let proxy = new Proxy(obj, {
        set(target, property, value) {
            target[property] = value; // Изменяем оригинальный массив
           if( target.callbackList ){
                target.callbackList.forEach((point, index) =>{
                    point.callback( point.element );
                })
           }

           if( target.writeList ){
                target.writeList.forEach((point, index) => {
                     point.element.innerHTML = proxy[point.prop];
                     if( point.callback ){
                         point.callback();
                     }
                })
            }

            console.log( target.writeList , "set");
            return true; // Успех
        },
        get(target, property) {
           //console.log( target.writeList , "get");
            return target[property]; // Возвращаем оригинальное значение
        }
    });
    proxy.callbackList = [];
    proxy.writeList = [];
    proxy.isProxy = true;
    return proxy;
}
export function checkLanguage( language = "en" ){
    if( !localStorage.getItem("lang") ){
        localStorage.setItem('lang', language);
    }
    return localStorage.getItem("lang");
}
export function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}
export function addModalWindow(title = null, info = null, fscreen = 0, listeners={}, noDisturb=undefined){
    const {closeCallback = function() {}} = listeners;
    const cont = document.querySelector("body");

    const modalBack = document.createElement("div");
    modalBack.className = 'modalBack';
    if (noDisturb) {
        modalBack.classList.add('modalNotDisturb');
    }

    const modalWindow = document.createElement("div");
    modalWindow.className = 'modalWindow';

    const modalHeader = document.createElement("div");
    modalHeader.className = 'modalHeader';

    const modalInterface = document.createElement("div");
    modalInterface.className = 'modalInterface';

    const modalClose = document.createElement("div");
    modalClose.className = 'modalClose';
    const modalSize = document.createElement("div");
    modalSize.className = 'modalSize';

    const modalWindowTitle = document.createElement("div");
    modalWindowTitle.className = 'modalWindowTitle';

    const modalWindowInfo = document.createElement("div");
    modalWindowInfo.className = 'modalWindowInfo';
    modalWindowTitle.innerHTML = title;
    if(typeof info == "string"){
        modalWindowInfo.innerHTML = info;
    }
    else{
        modalWindowInfo.append(info);
    }
    const fullSizing = "/src/img/site/modal/fullsize.svg";
    const minimize = "/src/img/site/modal/minimize.svg";
    modalClose.innerHTML = `<img class="modalInterfaceImage" src="/src/img/site/modal/close.svg" alt="close">`;
    modalSize.innerHTML = `<img class="modalInterfaceImage" src="${fscreen ? minimize : fullSizing}" alt="change size">`;
    modalBack.append(modalWindow);
    modalInterface.append(modalSize);
    modalInterface.append(modalClose);

    modalHeader.append(modalWindowTitle);
    modalHeader.append(modalInterface);

    modalWindow.append(modalHeader);
    modalWindow.append(modalWindowInfo);
    
    cont.append(modalBack);
    modalWindowInfo.wobox = {};
    modalWindowInfo.wobox.cont = cont;
    modalWindowInfo.wobox.btnClose = modalClose;
    modalWindowInfo.wobox.background = modalBack;
    modalWindowInfo.wobox.header = modalHeader;
    modalWindowInfo.wobox.title = modalWindowTitle;
    modalWindowInfo.wobox.close = ()=>{
        closeModal();
    }
    function closeModal(){
        modalBack.classList.add("none");
        closeCallback();
        if( modalWindowInfo.wobox.hasOwnProperty("closeCallback")){
            modalWindowInfo.wobox.closeCallback()
        }
        cont.removeChild(modalBack);
    }

    modalClose.addEventListener("click", ()=>{
        closeModal();
    })
    modalBack.onclick = e=>{
        if(e.target == modalBack){
            closeModal();
        }
    }
    function fModalSize(){
        if(getComputedStyle(modalWindow).position == "relative"){
            modalWindow.classList.add('modalWindowFull');
            fscreen = 1;
        }
        else{
            modalWindow.classList.remove('modalWindowFull');
            fscreen = 0;
        }
        modalSize.children[0].src = fscreen ? minimize : fullSizing;
    }
    if(fscreen == 1){
        fModalSize();
    }
    modalSize.onclick = ()=> fModalSize();
    return modalWindowInfo;
}


function cssRend(option, optionVars, newElement){
     // Генерация случайной строки из 10 букв
     const randomString = generateRandomString(10);
     const st = document.createElement('style');

     const varRegex = /@var\s+(\w+)\s*=\s*"([^"]*)";/g;
     const variables = {};
     let match;
     while ((match = varRegex.exec(option)) !== null) {
         const [, name, value] = match;
         variables[name] = value.trim();
     }
     for(const mix in variables){
         const mixinPlaceholder = `@${mix}`;
         option = option.replaceAll(new RegExp(mixinPlaceholder, 'g'), variables[mix]);
     }
     const mixinRegex = /@mixin\s+(\w+)\s*\{([\s\S]+?)\}/g;
     
     let mixin;
     const mixins = {};
     
     while ((mixin = mixinRegex.exec( option )) !== null) {
         const [, name, content] = mixin;
         mixins[name] = content.trim();
     }
     console.log( mixins );
     
     option = option.replaceAll(/\$class/g, randomString);
     for(const mix in mixins){
         const mixinPlaceholder = `@${mix}`;
         option = option.replaceAll(new RegExp(mixinPlaceholder, 'g'), mixins[mix]);
     }
     const tn = document.createTextNode( option );
     document.getElementsByTagName('head')[0].appendChild(st);
     st.append(tn);
     newElement.classList.add( randomString );
}
export function create(element, option = {}){

    let newElement;
    const listSvgElements = [
        "svg",
        "circle",
        "rect",
        "path",
        "text",
        "textPath",
        "defs",
        "marker",
        "line",
        "polygon",
        "fillRect"
    ];

    
    option = {
        style: option.style || null,
        text: option.text || null,
        parent: option.parent || null,
        prepend: option.prepend || null,
        class: option.class || null,
        id: option.id || null,
        append: option.append || null,
        attribute: option.attribute || option.attr || null,
        attr: option.attr || null,
        root: option.root || null,
        events: option.events || null,
        symbiosis: option.symbiosis || null,
        hand: option.hand || null,
        after: option.after || null,
        mode: option.mode || null,
        textContent: option.textContent || null,
        codeSVG: option.codeSVG || null,
        hoverStyle: option.hoverStyle || null,
        hoverAttr: option.hoverAttr || null,
        handNew: option.handNew || null,
        css: option.css || null,
        cssVars: option.cssVars||null,
        textLang: option.textLang||null,
        onInit: option.onInit||null
    }

    let selectElement = false;
    for(let typeElement of listSvgElements){
        if(typeElement == "svg" && option.codeSVG != null){
            const parser = new DOMParser();
            const doc = parser.parseFromString(option.codeSVG, "image/svg+xml");
            newElement = doc.querySelector("svg");
            selectElement = true;
            break;
        }
        else if(typeElement == element){
            const ns = "http://www.w3.org/2000/svg"
            newElement = document.createElementNS(ns, element);
            selectElement = true;
            break;
        }
    }
    if(!selectElement){
        newElement = document.createElement(element);
    }
    newElement.wobox = {};

    if(option.events){
       for(let i in option.events){
          // console.log(i);
           if(Array.isArray(option.events[i])){
                for(let ii in option.events[i]){
                    newElement.addEventListener(i, ( event )=>{
                        option.events[i][ii](event);
                    })
                }
           }
           else{
                newElement.addEventListener(i, (event)=>{
                    option.events[i](event);
                })
           }
       } 
    }
    if(typeof option.text === 'object' && option.text !== null){
        option.textLang = option.text;
    }
    else if(option.text && !option.textLang){
        newElement.innerHTML = option.text;
    }
    if(option.onInit){
        option.onInit( newElement );
    }

    if(option.textLang && localStorage.getItem('lang') !== null){
        //textLang = localStorage.getItem('lang');
        const textLang = localStorage.getItem('lang') || 'en';
        newElement.innerHTML = option.textLang[textLang];
        window.addEventListener('languageChange', (event) => {
            console.log( event );
            const newLang = event.detail.lang;
            if (option.textLang[newLang]) {
                newElement.innerHTML = option.textLang[newLang];
            }
        });
    }

    if(option.textContent){
        newElement.textContent = option.textContent;
    }
    if(option.root){
        newElement.wobox.root = option.root;
    }
    else{
        newElement.wobox.root = newElement;
    }
    if(option.append){
        for(let val of option.append){
            newElement.append(val);
        }
    }

    if(option.style){
        if(Object.prototype.toString.call(option.style) === '[object String]') newElement.style.cssText = option.style;
        else if(Object.prototype.toString.call(option.style) === '[object Object]') Object.assign(newElement.style, option.style);
        else console.log("Функция $add - неверный тип данных для стилей");
    }

    if(option.class){
        if(typeof option.class == "object"){
            for(let cl of option.class){
                newElement.classList.add(cl);
            }
        }
        else{
            option.class = option.class.replaceAll(" ","")
            option.class = option.class.split(",")
            for(let cl of option.class){
                newElement.classList.add(cl);
            }
        }
    }
    if( option.css ){
        cssRend(option.css, option.cssVars, newElement);
    }

    if( option.hoverStyle ){
        const randomString = generateRandomString(10);
        const st = document.createElement('style'),
        tn = document.createTextNode(`
            .${randomString}:hover{
                border: 2px solid blue;
            }
        `);
        document.getElementsByTagName('head')[0].appendChild(st);
       // console.log( document.getElementsByTagName('head')[0]);
        st.append(tn);
        newElement.classList.add( randomString );
        //console.log( st );
    }
    if(option.id){
        newElement.id = option.id;
    }
    if(option.parent){
        option.parent.append(newElement);
    }

    if(option.prepend){
        option.prepend.prepend(newElement);
    }

    if(option.attribute){
        for(let attr in option.attribute){
            newElement.setAttribute(attr, option.attribute[attr])
        }
    }
    if(option.hoverAttr){

        newElement.addEventListener("mouseover",(e)=>{
            //console.log( "ok" );
            //console.log("event:", e)
            for(let attr in option.hoverAttr){
                newElement.setAttribute(attr, option.hoverAttr[attr])
                console.log(attr);
            }
        }, true) 
        newElement.addEventListener("mouseout",(e)=>{
            console.log( "ok" );
            console.log("event:", e)
            for(let attr in option.attr){
                newElement.setAttribute(attr, option.attr[attr])
                //console.log(attr);
                
            }
        }, true) 
    }
    newElement.wobox.parent = newElement;
    let objProxy;
    if(option.hand){
        if( typeof option.hand.watch === 'object' && option.hand.watch !== null && !Array.isArray(option.hand.watch) ){
            option.hand.watch.writeList.push({
                element: newElement,
                prop: option.hand.prop,
                oldValue: newElement.textContent,
                callback: option.hand.callback
                
            });
            newElement.oninput = ( e )=>{
                option.hand.watch[option.hand.prop] = e.target.value;
            }
            if(option.hand.suppressUpdate){
                return;
            }
            newElement.textContent = option.hand.watch[option.hand.prop];
            newElement.value = option.hand.watch[option.hand.prop];
            return;
        }

        option.hand.watch.callbackList.push( {element: newElement, callback:option.hand.callback} );
        if( option.hand.initCallback ){
            option.hand.callback( newElement );
        }

    }
    else{
        newElement.wobox.proxy = false;
        newElement.hand = false;
        newElement.proxy = false;

    }
    return newElement;
}


export function selectBtn( obj ){
    let nameBtn = obj.name ? obj.name : "&#183;&#183;&#183;"
    let widthBtn = obj.name ? "auto" : "25px";
    let padding = obj.name ? "0 5px" : "0";
    return create("div",{
        append: [
            create("div",{
                text: nameBtn,
                events: {
                    click: (e)=>{
                        const parentPointUser = e.srcElement.parentNode;
                        if(parentPointUser.childElementCount > 1){
                            //parentPointUser.
                            if(getComputedStyle(parentPointUser.childNodes[1]).display == "none"){
                                parentPointUser.childNodes[1].style.display = "block"
                                console.log("none")
                            }
                            else{
                                parentPointUser.childNodes[1].style.display = "none"
                                console.log("not none")

                            }
                        }
                        else{
                            const mainList = create("div",{
                                css:`
                                    .$class{
                                        position: absolute;
                                        right: 6px;
                                        background: white;
                                        padding: 5px;
                                        box-shadow: 0 0 3px gray;
                                        border-radius: 5px;
                                        margin-top: 2px;
                                        z-index: 1;
                                    }
                                    .$class >div{
                                        cursor: pointer;
                                        padding: 2px 5px;
                                        user-select: none;
                                    }
                                    .$class > div:hover{
                                        background: #ddd;
                                    }
                                `
                            });
                            for(const pointList of obj.list){
                                create("div",{
                                    text: pointList.text,
                                    parent: mainList,
                                    events:{
                                        click: ()=>{
                                            pointList.callback();
                                            e.srcElement.parentNode.childNodes[1].style.display = "none";

                                            if(obj.rename == true){
                                                console.log( e.srcElement.parentNode.childNodes[0].innerText = pointList.text );
                                            }
                                        }
                                    }
                                })
                            }
                            parentPointUser.append( mainList );
                        }
                    }
                },
                css:`
                    .$class{
                        font-weight: bold;
                        width: ${widthBtn};
                        padding: ${padding};
                        height: 25px;
                        display: grid;
                        place-content: center;
                        border: 2px solid #5F96D6;
                        border-radius: 5px;
                        cursor: pointer;
                        color: #5F96D6;
                        position: relative;
                        user-select: none;
                    }
                    .$class:hover{
                        border: 2px solid red;
                        color: red;
                    }
                `
            })
        ]
    })
}

export  function select( obj ){
    obj.style ? obj.style : `width: auto; border: 1px solid #ddd;`;
    obj.callback ? obj.callback : null;
    obj.class ? obj.callback : "";
    const cont = create("select",{
        style: obj.style,
        events: {
            input: obj.callback
        },
        class: obj.class

    })
    //console.log("obj: ", obj);
    //console.log( "valueDEF:  ",obj.defaultValue )
    for(let optionElement of obj.list){
        // console.log("optionElement: ",optionElement);
        // console.log( optionElement.value, " / ", obj.defaultValue)
        const k = create("option",{
            text: optionElement.text,
            attr:{
                value: optionElement.value,
                
            },
            parent: cont
        })
        optionElement.value == obj.defaultValue ? k.selected = true : k.selected = false
    }
    return cont;
}





//////////////////////////////////
export class CreateMenu{
    constructor( obj ){
        let textLang = "en";
        if (localStorage.getItem('lang') !== null) {
            textLang = localStorage.getItem('lang');
        }
        else{

        }
        const listPointsMenu = create("div",{
            style:`
                justify-content: center;
                text-align: center;
                display: grid;
                gap: 5px;
            `
        })
        for(const point of obj.pointList){
            create("div",{
                textLang: point.textLang,
                style:`
                    cursor: pointer;
                    user-select: none;
                `,
                parent: listPointsMenu,
                events: {
                    click: ()=>{point.callback()}
                }
            });
        }
        create("div",{
            parent: listPointsMenu,
            css: `
                .$class{
                    position: absolute;
                    top: 18px;
                    right: 10px;
                }
            `,
            append:[
                selectBtn({
                    list: [
                        {text: "EN", callback: ()=>{changeLanguage("en")}},
                        {text: "RU", callback: ()=>{changeLanguage("ru")}},
                        {text: "UZ", callback: ()=>{changeLanguage("uz")}}
                    ],
                    name: localStorage.getItem("lang").toUpperCase(),
                    rename: true
                })
            ]
        })

        if(!obj.name){
            obj.name = "MENU"
        }
        this.cont = create("div",{
            append:[
                create("div",{
                    css:`
                        .$class{
                            position: relative;
                            box-shadow: 2px 0 2px gray;
                            border-radius: 0 10px 10px 0;
                            padding: 10px;
                            transition: transform 0.5s;

                        }
                    `,
                    append:[
                        create("div",{
                            text: "&#9668;",
                            css:`
                                .$class{
                                    height: 50px;
                                    width: 30px;
                                    background: #ececec;
                                    color: black;
                                    font-weight: bold;
                                    position: absolute;
                                    top: 50%;
                                    right: -30px;
                                    transform: translateY(-50%);
                                    border-radius: 0px 5px 5px 0px;
                                    display: grid;
                                    place-content: center;
                                    place-items: center;
                                    box-shadow: 2px 0px 2px gray;
                                    transition: 0.5s;
                                    cursor: pointer;
                                    transition: box-shadow 0.5s;
                                    height: 50px;
                                }
                                .$class:hover{
                                    box-shadow: 3px 0px 3px gray;
                                }
                            `,
                            events:{
                                click: (e)=>{
                                    e.srcElement.parentNode.parentNode.classList.toggle('cont1');
                                    e.srcElement.parentNode.classList.toggle('menu1');
                                }
                            }
                        }),
                        create("div",{
                            style:`
                                overflow: hidden;
                                display: grid;
                                gap: 25px;
                            `,
                            append:[
                                create("div",{
                                    text: obj.name,
                                    style:`
                                        font-size:1.2rem;
                                        font-weight: bold;
                                        text-align: center;
                                        padding: 10px;
                                    `
                                }),
                                listPointsMenu


                            ]
                        })
                    ]
                }),
                create("div",{
                    append:[
                        this.contRender = create("div",{
                            attr:{
                                "data-content": "true"
                            }
                        }),
                        create("div",{
                            text: "o",
                            css:`
                                .$class{
                                    position: absolute;
                                    top: 5px;
                                    right: 5px;
                                    height: 25px;
                                    width: 25px;
                                    display: grid;
                                    place-content: center;
                                    place-items: center;
                                    cursor: pointer;
                                    /*box-shadow: 0 0 2px red;*/
                                    border: 1px solid black;
                                    border-radius: 5px;
                                }
                            `,
                            events:{
                                click:()=>{
                                    const cont = create("div",{
                                        append:[
                                            create("div",{
                                                append:[
                                                    create("select",{
                                                        append:[
                                                            create("option",{
                                                                text: "Выбрать язык",
                                                                attr:{
                                                                    value: 0
                                                                }
                                                            }),
                                                            create("option",{
                                                                text: "English",
                                                                attr:{
                                                                    value: "en"
                                                                }
                                                            }),
                                                            create("option",{
                                                                text: "Russian",
                                                                attr:{
                                                                    value: "ru"
                                                                }
                                                            }),
                                                            create("option",{
                                                                text: "Uzbek",
                                                                attr:{
                                                                    value: "uz"
                                                                }
                                                            }),
                                                        ],
                                                        events:{
                                                            input:(e)=>{
                                                                changeLanguage(e.srcElement.value);
                                                            }
                                                        }
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                    addModalWindow("Setting", cont);
                                }
                            }
                        })
                    ],
                    css:`
                        .$class{
                            width: 100%;
                            padding: 10px 30px;
                        }
                    `,

                })
            ],
            parent: obj.parent,
            css:`
                .$class{
                    color: black;
                    background: white;
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    height: 100%;
                    transition: grid-template-columns 0.5s;
                }
            `
        })
    }
    add(){

    }
    remove(){

    }
    getMenu(){
        return this.cont;
    }

}



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
            
            row = create("b",{
                parent: title,
                append:[
                    create("div",{
                        text: column.name
                    })
                ]
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
                    color: red;
                }
                .$class > div{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

            `,
            parent: this.cont
        })
        rowCont.dataRow = obj.objData;
        if( obj.callback ){
            rowCont.addEventListener("click",()=>{
                obj.callback();
            })
            rowCont.style.cursor = "pointer";
        }
        rowCont.wobox = {};
        if( obj.key ){
            rowCont.wobox.key = obj.key;
        }
        this.index = obj.data[3];
        rowCont.wobox.userId = this.index;
        obj.data.forEach( (value, index) => {

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
        //console.log( rowCont.wobox );
        return rowCont;
    }
    remove( obj = {}){
        console.log( "test:", obj );
        for(const elem of this.cont.childNodes){
            if(elem.wobox && elem.wobox.key){
                if(elem.wobox.key == obj.key){
                    //elem.innerHTML = "<b style='color: red; font-family: monospace;'>DELETE</b>";
                    elem.style.cssText += `
                        cursor: pointer;
                        border: 2px solid red;
                        background: #ff000017;
                        border-radius: 5px;
                    `;
                }
            }
        }
    }
    move( obj ){

    }
    clear(){
        this.count = 1;
        // Находим первый дочерний элемент
        const firstChild = this.cont.firstElementChild;

        // Удаляем все дочерние элементы
        this.cont.innerHTML = '';

        // Возвращаем первый элемент обратно
        this.cont.appendChild(firstChild);

    }
}