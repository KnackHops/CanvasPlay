const allBtns = document.querySelector(".btnContainer")
const btnImageDraw = document.querySelector(".btnImageDraw");
const btnCanvasLoop = document.querySelector(".btnCanvasLoop");
const mainCanvas = document.querySelector(".mainCanvas");
const ctx = mainCanvas.getContext("2d");
const image = new Image();
let imageHeight, imageWidth;
let balls = [];
let rAF;

/* */
const imageDrawText = ["Drop image here to draw on Canvas!","Press me to draw on canvas!"]
const canvasLoopText = ["Press me for a ball","Press me to loop on canvas!"]

const degToRad = degrees => {
    return degrees * Math.PI / 180;
}

const mathDimension = (whichValue, value) =>{
    if(whichValue==="height"){
        return ((mainCanvas.height-value)/2);
    }else if(whichValue==="width"){
        return ((mainCanvas.width-value)/2);
    }
}

const windowResize = () => {
    if(mainCanvas.height !== window.innerHeight-50 || mainCanvas.innerWidth !== window.innerWidth-120){
        mainCanvas.width = window.innerWidth - 50;
        mainCanvas.height = window.innerHeight - 120;
        imageHeight = mainCanvas.height - 10;
        imageWidth = mainCanvas.width - 10;
        
        clearCan();
        if(image.src){
            ctx.drawImage(image,mathDimension("width",image.width),mathDimension("height",image.height),image.width,image.height);
        }
    }
}

const clearCan = () => {
    if(balls.length){
        ctx.clearRect(0,0,mainCanvas.width,mainCanvas.height);
    }
    
    ctx.fillStyle = "rgba(20,170,110,1)";
    ctx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
}

const clearDefault = e => {
    return e.preventDefault();
}

const imageDraws = e => {
    
    clearDefault(e);
    
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
        
        
        image.src = reader.result;
        
        image.onload = function(){
            clearCan();
            ctx.drawImage(image,mathDimension("width",image.width),mathDimension("height",image.height),image.width,image.height);
            console.log(image.width);
            console.log(image.height);
        }
    }
    
    reader.readAsDataURL(file);
}

const rand = (min,max) =>{
    return (Math.random() * (max-min+1))+min;
}

//function newBall(){
//    ctx.beginPath();
//    ctx.fillStyle = "black";
//    ctx.arc(rand(20,mainCanvas.height-20),rand(20,mainCanvas.height-20),rand(10,20),degToRad(0),degToRad(360),false);
//    ctx.fill();
//}

class ball {
    constructor(x,y,velX,velY,size){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.size = size;
    }
    
    draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x,this.y,this.size,degToRad(0),degToRad(360));
        ctx.fill();
        ctx.closePath();
    }
    
    update = () => {
        if((this.x+this.size) >= mainCanvas.width || (this.x-this.size) <=0){
            this.velX = -(this.velX);
        }
        if((this.y+this.size) >= mainCanvas.height || (this.y-this.size) <=0){
            this.velY = -(this.velY);
        }
        
        this.x+=this.velX;
        this.y+=this.velY;
    }
    
    colliderCheck = () => {
        for(let i=0;i < balls.length;i++){
            if(balls[i]===this){
                continue;
            }
            const dx = this.x - balls[i].x;
            const dy = this.y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < this.size + balls[i].size){
                const addOrNot = Math.round(rand(0,1));
                if(addOrNot === 1){
                    if(this.velX>0){
                        this.velX+=1;
                    }else{
                        this.velX-=1;
                    }
                }else{
                    if(this.velY>0){
                        this.velY+=1;
                    }else{
                        this.velY-=1;
                    }
                }
                this.velX = -(this.velX);
                this.velY = -(this.velY);
            }
        }
    }
}

const canvasLoop = () =>{
    clearCan();
    
    balls.forEach(ball=>{
        ball.draw();
        ball.update();
        ball.colliderCheck();
    })
    
    rAF = requestAnimationFrame(canvasLoop);
}

const canvasIni = () => {
    let x = rand(20,mainCanvas.width-20);
    let y = rand(20,mainCanvas.height-20);
    let velY = Math.round(rand(-6,6));
    let velX = Math.round(rand(-6,6));
    let size = Math.round(rand(11,19));
    
    const instanceBall = new ball(x,y,velX,velY,size);
    balls.push(instanceBall);
}

const textChange = (indexDraw = 0, indexLoop=1) => {
    btnImageDraw.textContent = imageDrawText[indexDraw];
    btnCanvasLoop.textContent = canvasLoopText[indexLoop];
}

const changeBtn = e => {
    
    if(e==="initialization"){
        btnImageDraw.addEventListener("drop",imageDraws);
        btnCanvasLoop.addEventListener("click",changeBtn);
        windowResize();
        textChange();
        
        btnCanvasLoop.classList.add("btnActive");
        
        return;
    }
    
    if(e.target.classList === btnCanvasLoop.classList){
        btnImageDraw.removeEventListener("drop",imageDraws);
        btnCanvasLoop.removeEventListener("click",changeBtn);
        btnImageDraw.addEventListener("click",changeBtn);
        btnCanvasLoop.addEventListener("click",canvasIni);
        
        btnImageDraw.classList.add("btnActive");
        btnCanvasLoop.classList.remove("btnActive");
        
        textChange(1,0);
        canvasLoop();
    }else{
        window.cancelAnimationFrame(rAF);
        clearCan();
        btnImageDraw.removeEventListener("click",changeBtn);
        btnCanvasLoop.removeEventListener("click",canvasIni);
        btnImageDraw.addEventListener("drop",imageDraws);
        btnCanvasLoop.addEventListener("click",changeBtn);
        
        btnCanvasLoop.classList.add("btnActive");
        btnImageDraw.classList.remove("btnActive");
        
        textChange();
    }
}

changeBtn("initialization");

btnImageDraw.addEventListener("dragover",clearDefault);
btnImageDraw.addEventListener("dragleave",clearDefault);
btnImageDraw.addEventListener("dragenter",clearDefault);
window.addEventListener("resize",windowResize)

