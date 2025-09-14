export function addModalWindow(title = null, info = null, fscreen = 0, listeners={}, noDisturb=undefined, parent=null){
    const {closeCallback = function() {}} = listeners;
    if(parent == null){
        parent = document.querySelector("body");
    }
    else{
        parent = document.querySelector(parent);
    }
    const cont = parent;

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
