var id_empty;
var num_moves;
var isCompleted = false;
var time=0;
var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

window.addEventListener("load", startTimer, false);

function startTimer()
{
    window.setInterval("updateTime()", 1000);
} 

function updateTime()
{ 
    ++time;
    document.getElementById("time").innerHTML =time +" (seconds)";
} 

function startPuzzle() {
    num_moves = 0;
    isCompleted = false;

    for(var i=0; i < 16; i++) {
        var tmp = document.getElementById(i);
        tmp.className = "cell ";
    }

    randomNumber = nums.sort(function () { return (Math.round(Math.random())-0.5);});
    while(!Problem.prototype.is_solvable(randomNumber)) {
        randomNumber = nums.sort(function () { return (Math.round(Math.random())-0.5);});
    }

    for(var i=0; i < 16; i++) {
        var tmp = document.getElementById(i);
        if(randomNumber[i] == 16) {
            tmp.className = "cell empty";
            tmp.innerHTML = "";
            id_empty = i;
        }
        else
            tmp.innerHTML = randomNumber[i];
    }

}
function easyGame(){
    if(isCompleted)
    {
        window.location.reload();
    }
    clearMoveList();
    time = 0;
    num_moves = 0;
    document.getElementById("moves").innerHTML = num_moves;
    for(var i=0; i < 16; i++) {
        var tmp = document.getElementById(i);
        if(i == 14) {
            tmp.className = "cell empty";
            tmp.innerHTML = "";
            id_empty = i;
        }
        else if(i == 15) {
            tmp.className = "cell";
            tmp.innerHTML = "15";
        }
        else{
            tmp.innerHTML = i+1;
            tmp.className = "cell";
        }
    }
}


function clickCell(x)
{
    if(isCompleted)
        return;

    if(x.id != id_empty+'') {
        var emptyI = Math.floor(id_empty/4);
        var emptyJ = id_empty % 4;
        var id_selected = Number(x.id);
        var selectedI = Math.floor(id_selected/4);
        var selectedJ = id_selected % 4;
        
        if((Math.abs(emptyI - selectedI) == 1 && emptyJ == selectedJ) ||
           (Math.abs(emptyJ - selectedJ) == 1 && emptyI == selectedI)) {

            document.getElementById(id_empty).className = "cell";
            document.getElementById(id_empty).innerHTML = x.innerHTML;
            
            createMoveList(x);

            x.className = "cell empty";
            x.innerHTML = '';
            
            id_empty = id_selected;
            num_moves++;

            document.getElementById("moves").innerHTML = num_moves;
            

            
            if(isDone()){
                isCompleted = true;
                var alertBox = document.getElementById("alert-message");
                if(num_moves > 1){
                    alertBox.innerHTML = "CONGRATS! It took you: " + num_moves+" moves";
                }
                else{
                    alertBox.innerHTML = "CONGRATS! It took you: " + num_moves+" move";
                }
                alertBox.style.display = 'block';
            }
        }
    }
}

function isDone() {
    return document.getElementById('0').innerHTML == '1' &&
        document.getElementById('1').innerHTML == '2' &&
        document.getElementById('2').innerHTML == '3' &&
        document.getElementById('3').innerHTML == '4' &&
        document.getElementById('4').innerHTML == '5' &&
        document.getElementById('5').innerHTML == '6' &&
        document.getElementById('6').innerHTML == '7' &&
        document.getElementById('7').innerHTML == '8' &&
        document.getElementById('8').innerHTML == '9' &&
        document.getElementById('9').innerHTML == '10' &&
        document.getElementById('10').innerHTML == '11' &&
        document.getElementById('11').innerHTML == '12' &&
        document.getElementById('12').innerHTML == '13' &&
        document.getElementById('13').innerHTML == '14' &&
        document.getElementById('14').innerHTML == '15';
}


function createMoveList(x){
    var movetitleValue = x.innerHTML;
    //creating list of moves
    var tileRowMoved = Math.round((id_empty+1)/4);
    var tileColumnMoved = ((id_empty+1)%4);
    var ol = document.getElementById("moves-list");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode("You moved title "+movetitleValue+" to ("+tileRowMoved+","+tileColumnMoved +" )"));
    ol.appendChild(li);
}

function clearMoveList(){
    var ol = document.getElementById("moves-list");
    ol.innerHTML="";    
}

function lastClick() {
    var curr_state = currentState();
    var problem = new Problem(curr_state);
    var sol = Solver.a_star_search(problem);
    var result = "<ol>";
    for(var i = 0; i < sol.length; i++) {
        var n = moveNumb(sol[i],curr_state);
        curr_state = problem.result(sol[i],curr_state);
        result += "<li>move " + n + "</li>";
    }
    result += "</ol>";
    document.getElementById("steps").innerHTML = result;
}


function currentState() {
    var result = [];
    for(var i = 0; i < 16; i++) {
        var tmp = document.getElementById(String(i)).innerHTML;
        if(tmp == '') {
            result[i] = 16;
        }
        else {
            result[i] = Number(tmp);
        }
    }
    return result;
}

function moveNumb(action,state) {
    var i = state.indexOf(16);
    switch(action) {
    case Action.up:
        return state[Util.index(Util.x(i),Util.y(i) - 1)];
    case Action.down:
        return state[Util.index(Util.x(i),Util.y(i) + 1)];
    case Action.right:
        return state[Util.index(Util.x(i) + 1,Util.y(i))];
    case Action.left:
        return state[Util.index(Util.x(i) - 1,Util.y(i))];
    }
}

Array.prototype.clone = function() { return this.slice(0); };
Array.prototype.swap = function(i1,i2) {
    var copy = this.clone();
    var tmp = copy[i1];
    copy[i1] = copy[i2];
    copy[i2] = tmp;
    return copy;
};


var Problem = function(start_state) {
    this.init_state = start_state;
    return this;
}

Problem.prototype.is_solvable = function(start) {
    start = start.clone();    start.splice(start.indexOf(16), 1);
    start[15] = 16;
    var count = 0;
    for(var i = 0; i < 15; i++) {
        if(start[i] != i+1) {
            count++;
            var j = start.indexOf(i+1);
            start[j] = start[i];
            start[i] = i+1;
        }
    }
    return count % 2 == 0;
}

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 500);
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 500);
}