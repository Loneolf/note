document.onscroll = function(){
    var scrollTop = scroll().top;
    if(scrollTop >= 250){
        getID("nav").classList.add("nav-scro")
        getID("nav-input").style.display = "block"
        getID("nav-logo-img").src="img/首页/logo.png"
    }else{
        getID("nav").classList.remove("nav-scro")
        getID("nav-input").style.display = "none"
        getID("nav-logo-img").src="img/首页/logo-w.png"
    }
    getID("head-banner").style.backgroundPositionY = scrollTop/2 +"px"    
}

getID("login").onclick = function(){
    getID("login-father").style.display = "block"
    getID("login-box").style.display = "block"
}
getID("login-close").onclick = function(){
    getID("login-father").style.display = "none"
    getID("login-box").style.display = "none"
    getID("register-box").style.display = "none"
}
getID("register").onclick = function(){
    getID("login-father").style.display = "block"
    getID("register-box").style.display = "block"
}
getID("register-close").onclick = function(){
    getID("login-father").style.display = "none"
    getID("register-box").style.display = "none"
}
turn("login-box","register-box","login-a")
turn("register-box","login-box","register-a")
function turn(oldID,newID,touchID){
    getID(touchID).onclick = function(){

        getID(oldID).style.transition = "all 1s"
        getID(oldID).style.transform = "rotateY(90deg)"
        
         
        getID(newID).style.transition = "all 1s"
        getID(newID).style.transform = "rotateY(360deg)"
        if(getID(oldID).style.transform === "rotateY(90deg)"){
            setTimeout(function(){
                getID(oldID).style.display = "none"
                getID(newID).style.display = "block"
            },1000)
        }
    }
}

function scroll(){
    if(window.pageYOffset !== null){
        return {
            left:window.pageXOffset,
            top:window.pageYOffset
            }
    }else if(Document.compatMode == "CSS1Compat"){
        return {
            left:document.documentElement.scrollLeft,
            top:document.documentElement.scrollTop
            }
    }return {
        left:document.body.scrollLeft,
        top:document.body.scrollTop
    }
}
// 封装获取id函数
function getID(id){
    return typeof id === "string" ? document.getElementById(id) : null;
}