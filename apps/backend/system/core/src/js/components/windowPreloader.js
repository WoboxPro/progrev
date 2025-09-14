export class PreloaderWindow{
    constructor(obj){
        this.parent = document.querySelector('body');
        this.myModal = document.createElement("div");
        this.opacityValue = '50%';
        this.intervalId = null; // Используется для сохранения идентификатора интервала
        this.dotCount = 0; // Счетчик точек
        this.maxDotCount = 3; // Максимальное количество точек
    }
    openWindow(){
        this.myModal.style.cssText = `
            background: black;
            display:grid;
            position: fixed;
            left:0;
            top:0;
            align-content:center;
            justify-Content: center;
            opacity:50%;
            z-index:11;
            height:100vh;
            width:100vw;
        `;
        
        const loadingText = document.createElement("div");
        loadingText.style.color = "white";
        this.myModal.appendChild(loadingText);
        this.intervalId = setInterval(() => {
            const dots = Array(this.dotCount + 1).join(".");
            const loadingString = `Идет загрузка${dots}`;
            loadingText.innerHTML = loadingString;
            this.dotCount++;
            if (this.dotCount > this.maxDotCount) {
                this.dotCount = 0;
            }
        }, 300);

        this.parent.append(this.myModal);
    }
    closeWindow(){
        // Очищаем интервал
        clearInterval(this.intervalId);

        this.parent.removeChild(this.myModal);
    }
    
}
// export class PreloaderWindow{
//     constructor(parent, opacityValue = 100){
//         this.parent = parent;
//         this.myModal = document.createElement("div");
//         this.opacityValue = opacityValue;
//     }
//     openWindow(){
//         this.myModal.style.cssText = `
//             background: black;
//             display:grid;
//             position: fixed;
//             left:0;
//             top:0;
//             align-content:center;
//             justify-Content: center;
//             opacity:${this.opacityValue}%;
//             z-index:99999;
//             height:100vh;
//             width:100vw;
//         `;
//         this.myModal.innerHTML = "<div style='color:white'> Идет загрузка... </div>";
//         this.parent.append(this.myModal);

//     }
//     closeWindow(){
//         this.parent.removeChild(this.myModal);
//     }
    
// }



// export class PreloaderWindow{
//     constructor(parent, opacityValue = 100){
//         this.parent = parent;
//         this.myModal = document.createElement("div");
//         this.opacityValue = opacityValue;
//         this.intervalId = null;
//         this.dotCount = 0;
//         this.textDownload = "Идет загрузка";
//         this.dotText = "";
//     }
//     openWindow(){
//         this.myModal.style.cssText = `
//             background: black;
//             display:grid;
//             position: fixed;
//             left:0;
//             top:0;
//             align-content:center;
//             justify-Content: center;
//             opacity:${this.opacityValue}%;
//             z-index:99999;
//             height:100vh;
//             width:100vw;
//         `;
//         this.parent.append(this.myModal);
//         this.intervalId = setInterval(() => {
//             if(this.dotCount < 3){
//                this.dotText += ".";
//                 this.dotCount++;
//             } else {
//                 this.dotCount = 0;
//                 this.dotText = "";
//             }
//             this.myModal.innerHTML = this.textDownload + this.dotText;
//         }, 100);
//     }
//     closeWindow(){
//         clearInterval(this.intervalId);
//         this.parent.removeChild(this.myModal);
//     }
// }