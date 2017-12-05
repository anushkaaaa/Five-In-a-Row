
window.onload = init;
//Establish the server connection
var socket = new WebSocket("ws://localhost:8080/FiveInARow/actions");
var name ;
var PlayerId;
var me = true;
var chessBoard = [];
var over = false;
var cflag = false;
var disable;
//Winning array
var wins = [];
//Logic for winning the game
var myWin = [];
var computerWin = [];
var enableMove;

//Function handles the game rules
function callChess() {
    for (var i=0; i< 16; i++) {
	wins[i] = [];
	for (var j=0; j<16; j++) {
            wins[i][j] = [];
	}
    }

    //Statistics conditions for winning the game
    var count = 0;
    //All win the line
    for (var i=0; i<16; i++) {
        for (var j=0; j<12; j++) {
            for (var k=0; k<5; k++) {
                wins[i][j+k][count] = true;
            }
            count++;
        }
    }
    
    //List all winners
    for (var i=0; i<16; i++) {
	for (var j=0; j<12; j++) {
            for (var k=0; k<5; k++) {
		wins[j+k][i][count] = true;
            }
	count++;
	}
    }
    
    //Diagonally win all the game
    for (var i=0; i<12; i++) {
	for (var j=0; j<12; j++) {
            for (var k=0; k<5; k++) {
		wins[i+k][j+k][count] = true;
            }
            count++;
	}
    }
    
    //Anti-diagonal win game
    for (var i=0; i<12; i++) {
	for (var j=15; j>3; j--) {
            for (var k=0; k<5; k++) {
		wins[i+k][j-k][count] = true;
            }
	count++;
	}
    }
    for (var i=0; i<count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
    }

    for (var i=0; i<16; i++) {
	chessBoard[i] = [];
	for (var j=0; j<16; j++) {
            chessBoard[i][j] = 0;
	}
    } 
    
    //creating grid for the game
    var canvas = document.getElementById("chess");
    var context = canvas.getContext('2d');

    for(var i=0; i<16; i++) {
	context.moveTo(20 + 40 * i, 20);
	context.lineTo(20 + 40 * i, 620);
	context.moveTo(20, 20 + 40 * i);
	context.lineTo(620, 20 + 40 * i);
	context.strokeStyle = "#cc9966";
	context.stroke();
    }
    
    //Function to handle onclick event of canvas
    canvas.onclick = function(e) {
        //enableMove alters the move between players
        if(enableMove){
            if (over){
		return;
            }
		var x = e.offsetX,
			y = e.offsetY,
			i = Math.floor(x / 40),
			j = Math.floor(y / 40);
		if (i<16 && j<16 && chessBoard[i][j]==0){
                    oneStep(i, j, me);
                    chessBoard[i][j] = 1;
                    disable=!disable;

                    for (var k=0; k<count; k++) {
			if(wins[i][j][k]) {
                            myWin[k]++;
                            computerWin[k] = 6;
                            if(myWin[k]===5) {
                                over = true;
                                cflag = true;
                            }
			}
                    }
                    //over flag is set to true when the winning comdition is satisfied and send the coordinated to server
                    if(!over){
                        userMove(i,j,me,cflag,disable);
                        enableMove = false;
                    }
                    //Sends the players move coordinates to server
                    else{
                        userMove(i,j,me,cflag,disable);
                        enableMove = false;
                    }
		}
                //Handeles the double click on allready occupied location
                else{
                    alert("Select Another location");
                    userMove(i,j,me,cflag,disable);
                    enableMove = true;
                }
        }else{
            alert("Wait for opponents move");
        }
    };

//Sets the color of ball based on players
    function oneStep(i, j, role) {
	var canvas = document.getElementById('chess');
	var context = canvas.getContext('2d');
	context.beginPath();
	context.arc(20 + 40 * i, 20 + 40 * j, 15, 0, 2 * Math.PI);
	context.closePath();
	if (role) {
            var gradient = context.createRadialGradient(20 + 40 * i, 20 + 40 * j, 5, 20 + 40 * i, 20 + 40 * j, 15);
            gradient.addColorStop(0, "#cccccc");
            gradient.addColorStop(1, "#000000");
            context.fillStyle = gradient;
	} else {
            var gradient = context.createRadialGradient(20 + 40 * i, 20 + 40 * j, 5, 20 + 40 * i, 20 + 40 * j, 15);
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#cccccc");
            context.fillStyle = gradient;
	}
	context.fill();
    }
};

//Sends message to the server based on user action
socket.onmessage = onMessage;
function onMessage(event) {
    var user = JSON.parse(event.data);
    if (user.action === "add") {
        PlayerId=user.id;
        disable = false;
        enableMove = true;
        document.getElementById("connectedPlayer").style.display = "block";
        printUserElement(user);
        if(user.name===name){
            document.getElementById("addUser").style.display = "none";
            if(user.id!==2){
                me=false;
                alert("Waiting for another player to connect!");
                document.getElementById("quitGame").style.display = "block";
            }else{
                alert("Click OK to start game, Player 2 will begin the game");
            }
        }   
        if(user.id === 2){
            document.getElementById("container").style.display = "block";
            document.getElementById("addUser").style.display = "none";
            document.getElementById("quitGame").style.display = "block";
            callChess();
        }
    }
    if (user.action === "quit") {
            document.getElementById("addUser").style.display = "block";
            document.getElementById("container").style.display = "none";
            document.getElementById("quitGame").style.display = "none";
            document.getElementById("connectedPlayer").style.display = "none";
            location.reload(true);
    }
    if (user.action === "move"){
        if(user.disable){
            if(name !== user.name)
            {
              enableMove = true;
            }
            var canvas = document.getElementById('chess');
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(20 + 40 * user.x, 20 + 40 * user.y, 15, 0, 2 * Math.PI);
            context.closePath();
            if (user.color) {
                var gradient = context.createRadialGradient(20 + 40 * user.x, 20 + 40 * user.y, 5, 20 + 40 * user.x, 20 + 40 * user.y, 15);
                gradient.addColorStop(0, "#cccccc");
                gradient.addColorStop(1, "#000000");
                context.fillStyle = gradient;
            } else {
                var gradient = context.createRadialGradient(20 + 40 * user.x, 20 + 40 * user.y, 5, 20 + 40 * user.x, 20 + 40 * user.y, 15);
                gradient.addColorStop(0, "#ffffff");
                gradient.addColorStop(1, "#cccccc");
                context.fillStyle = gradient;
            }
            context.fill();
            chessBoard[user.x][user.y]=1;
            if(user.cflag){
                alert("Player: "+user.name+" Win");
                document.getElementById("chess").style.visibility="hidden";
            }
            disable=false;
        }else{
            user.id--;
        }
    }
}

//Creates an object to add player
function addUser(name){
    var UserAction = {
        action: "add",
        name: name
    };
    socket.send(JSON.stringify(UserAction));
}

//Creates an object to quit game
function QuitGame(PlayerId) {
    var UserAction = {
        action: "quit",
        id: PlayerId
    };
    socket.send(JSON.stringify(UserAction));
}

//Creates an object to send the palyer move
function userMove(i,j,me,cflag,disable){
    var UserAction = {
        action: "move",
        x: i,
        y: j,
        color: me,
        cflag: cflag,
        disable:disable,
        name: name
    };
    socket.send(JSON.stringify(UserAction));
}

//Displays the player information
function printUserElement(user) {
    var content = document.getElementById("content");
    var userDiv = document.createElement("div");
    userDiv.setAttribute("id", user.id);
    userDiv.setAttribute("class", "user " + user.type);
    content.appendChild(userDiv);

    var userName = document.createElement("span");
    userName.setAttribute("class", "userName");
    userName.innerHTML = "<b>Player Name "+PlayerId+":</b> " +user.name;
    userDiv.appendChild(userName);
}

//Accepts the player information
function showForm() {
    document.getElementById("addUserForm").style.display = "block";
    document.getElementById("container").style.display = "none";
}

//Hides the player form 
function hideForm() {
    document.getElementById("addUserForm").style.display = "none";
    document.getElementById("container").style.display = "none";
    document.getElementById("quitGame").style.display = "none"; 
}

//Function is called on add player button click
function formSubmit() {
    var form = document.getElementById("addUserForm");
    name = form.elements["user_name"].value;
    if(name===""){
        alert("Enter your name!");
        return;
    }
    hideForm();
    document.getElementById("connectedPlayer").style.display= "block";
    document.getElementById("addUserForm").reset();
    addUser(name);
}

//Function is called when player clicks on end game button
function quitGame() {
    alert("Game is ending.");
    QuitGame(PlayerId);
    hideForm();
}

//Resets the UI
function init() {
    hideForm();
}