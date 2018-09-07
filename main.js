//Canvas config
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d')
//testing
//ctx.fillRect(0,0,50,50)

//Variables globales
var score = 0;
var clones = []
var kybers = []
var interval;
var frames = 0;
var images = {
    bg:"./images/death_star.jpg",
    ahsoka: "./images/ahsoka_standby.png",
    clone:"./images/clone.png",
    ray:"./images/force_lightning.png",
    vader: "",
    kyber:"./images/kyber.png"
}

//clases
class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.image = document.createElement('img')
        this.image.src = images.bg
        this.image.onload = () => {
            this.draw()
        }
        this.music = new Audio()
        this.music.src = "http://66.90.93.122/ost/star-wars-episode-iii-revenge-of-the-sith-playstation-2-gamerip/drjjjhyt/1%20-%20mus_ui_anivictory_lp.mp3"
    }
draw(){
this.x-=2
if(this.x < -this.width ) this.x = 0
ctx.drawImage(this.image,this.x,this.y,this.width,this.height)      
ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height)      

ctx.font = "50px Verdana"
ctx.fillStyle = "white"
ctx.fillText(Math.floor(frames / 60),800,50,50);
}

} //calse Board

class Ahsoka{
    constructor(){
        this.force=[]
        this.x = 100
        this.y = 120
        this.width = 60
        this.height = 70
        this.image = new Image()
        this.image.src = images.ahsoka
        this.image.onload = () => {
            this.draw()
        }
        this.gravity = 3
        this.crash = new Audio()
        this.crash.src = ""
    }

    draw(){
        if(this.y < canvas.height - 100) this.y += this.gravity
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    crashWith(item){
        var crash = (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y)
        if(crash) this.crash.play()
        return  crash;
    }
   
      

} // clase Ahsoka
class Ray{
    constructor(x=0,y=175){
        this.x = x
        this.y = y
        this.width=150
        this.height=20
        this.image = new Image()
        this.image.src = images.ray
    }
    draw(){
        this.x+=10
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    
}

class Clone{
    constructor(){
        this.x = canvas.width - 150
        this.y = 150
        this.width = 40
        this.height = 60
        this.image = new Image()
        this.image.src = images.clone
        this.image.onload = () => {
            this.draw()
        } 
    }
    crashWith(item){
        var crash = (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y)
        if(crash) console.log('le diste')
        return crash;
    }
    draw(){
        this.x-=3
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}
class Kyber{
    constructor(x){
        this.x = x
        this.y = 0
        this.width = 20
        this.height = 20
        this.image = new Image()
        this.image.src = images.kyber
        this.image.onload = () => {
            this.draw()
        } 
    }
   
    draw(){
        this.y++
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}


//instancias

var board = new Board()
var ahsoka = new Ahsoka()
//funciones principales
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width,canvas.height)
    board.draw()
    ahsoka.draw()
    drawRays()
    //clones
    generateclones()
    drawClones()
    checkCollitions()
    raysAndClones()
    drawKybers()
    generateKybers()
    //collectKybers()
}

function start(){
    if(interval) return
    clones = []
    kybers = []
    frames = 0
    interval = setInterval(update, 1000/70)
}
function gameOver(){
    clearInterval(interval)
    ctx.font = "80px "
    ctx.fillText("Game Over", 128,512,)
    ctx.font = "50px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Press 'upkey' to restart", 50,300)
    interval = null
    board.music.pause()
}

//funciones auxiliares
function raysAndClones(){
    ahsoka.force.forEach(function(ray, rI){
        clones.forEach(function(clone, cI){
            if(clone.crashWith(ray)){
                ahsoka.force.splice(rI,1)
                clones.splice(cI,1)
            }
        })
    })
    
}



function generateclones(){
    if(frames % 20 === Math.floor(Math.random() * 200)){
    var clone = new Clone()
    clones.push(clone)

    } 
}
function generateKybers(){
    if(frames % 200 === 0){
        var x = Math.floor(Math.random() * 1024)
        kybers.push(new Kyber(x))
    }
}
function drawRays(){
    ahsoka.force.forEach(function(ray){
        ray.draw()
    })
}
function drawKybers(){
    kybers.forEach(function(kyber){
        kyber.draw()
    })
}

function drawClones(){
    clones.forEach(function(clone){
        clone.draw()
    })
}

function checkCollitions(){
    clones.forEach(function(clone){
        if( ahsoka.crashWith(clone) ){
            gameOver()
        }
    })

    kybers.forEach(function(k,id){
        if( ahsoka.crashWith(k) ){
            score++
            kybers.splice(id,1)
        }
    })
    
 
}

//los observadores

addEventListener('keydown', function(e){
   if(e.keyCode === 38 && ahsoka.y > 50){
       ahsoka.y -= 70
   } 

   if(e.keyCode === 37 && ahsoka.x > 0){
       ahsoka.x -= 10
   }
   
   if(e.keyCode === 39 && ahsoka.x < 1000){
    ahsoka.x += 10
    }


   
   if(e.keyCode === 32){
    ahsoka.force.push(new Ray(ahsoka.x, ahsoka.y+(ahsoka.height/2)))
    
   }


   if(e.keyCode === 27){
    start()
   }

   if(e.key = "Enter"){
       start()
       board.music.play()
   }

})
