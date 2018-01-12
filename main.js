$(document).ready( function(){
    console.log("ready");

    var strictOn = false;
    var powerOn = false;
    var userMoves = 0;
    var buttons = ["green", "red", "yellow", "blue"];
    var sequence = [];
    const NUMBER_OF_MOVES = 5;
    var start = false;
    var userTurn = false;
    var steps = 1;
    var myVar;
    var userMoves = 0;
    var wrongMove = false;
    var nowPlaying = false;
    var playerWon = false;

    function setStepCount(){
        if (!powerOn){
            $("#steps").text("--");
        
        // flash step counter at game start and on wrong move
        } else if ((start && $("#steps").text() === "--") || wrongMove || playerWon){
            if (wrongMove){
                $("#steps").text("XX");
                wrongMove = false;
            } else if (playerWon){
                $("#steps").text("!!");
                playerWon = false;
            }
            $("#steps").addClass("blink");
        } 
        
        if (steps > 0 &&  nowPlaying) {
            setTimeout(function(){
                $("#steps").text(steps);
                $("#steps").removeClass("blink");
            }, 1000);
        }
    }

    function playSound(button){
        if (button === wrongMove){
            document.getElementById("wrong-sound").play();
        } else if (button === "green"){
            $("#green").addClass("pressed");
            setTimeout(function(){
                $("#green").removeClass("pressed");
            }, 200);
            document.getElementById("green-sound").play();
        } else if (button === "red"){
            $("#red").addClass("pressed");
            setTimeout(function(){
                $("#red").removeClass("pressed");
            }, 200);
            document.getElementById("red-sound").play();
        } else if (button === "yellow"){
            $("#yellow").addClass("pressed");
            setTimeout(function(){
                $("#yellow").removeClass("pressed");
            }, 200);
            document.getElementById("yellow-sound").play();
        } else if (button === "blue"){
            $("#blue").addClass("pressed");
            setTimeout(function(){
                $("#blue").removeClass("pressed");
            }, 200);
            document.getElementById("blue-sound").play();
        }   
    }
    
    function playSequence(){
        var step = 0;
        var stepsLocal = 1;
        nowPlaying = true;
        setStepCount();
        myVar = setInterval(function(){
            console.log(stepsLocal + " step is:" + sequence[step]);
            playSound(sequence[step]);
            step++;
            stepsLocal++;
            if(step >= steps){
                userTurn = true;
                userMoves = 0;
                clearInterval(myVar);
            }
        }, 1000);
    }

    function reset(){
        steps = 1;
        userTurn = false;
        nowPlaying = false;
        start = true;

        console.log("start");

        // generate array with the gameplay sequence
        for (var i = 0; i < NUMBER_OF_MOVES; i++){
            sequence[i] = buttons[Math.floor(Math.random() * 3)];
        }

        console.log("sequence: " + sequence);

        $("#steps").text("--");
        setStepCount();
        //playSequence();
    }

    var myWin;
    function win(){
        playerWon = true;
        nowPlaying = false;
        setStepCount();
        var i = 0;
        var revolutions = 0;
        myWin = setInterval(function(){
            playSound(buttons[i]);
            i++;
            if (i === buttons.length){
                i = 0;
                revolutions++;
            }
            if (revolutions === 4){
                clearInterval(myWin);
            }
        }, 100);


    }

    function play(e){
        var target = e.target.id;
        console.log("user has clicked: " + target);

        if (target === "power-switch"){
            $("#power-switch").toggleClass("on");
            $("#steps").toggleClass("steps-power-on");
            if (!powerOn){
                powerOn = true;
                setStepCount();
                console.log("power is on");
            } else {
                powerOn = false;
                reset();
                console.log("power is off");
            }
        }

        if (powerOn){
            if (target === "strict"){
                // if strict mode is on, turn it off; if it's off, turn it on
                strictOn ? strictOn = false : strictOn = true;
                $("#strict-light").toggleClass("strict-light-on");
                if (strictOn){
                    console.log("strict mode is on");
                } else {
                    console.log("strict mode is off");
                }
            } else if (target === "start"){

                reset();
                playSequence();
                start = false;
            } 

            if (userTurn === true){
                if (target === sequence[userMoves]){
                    playSound(target);
                    console.log("correct move");
                    userMoves++;
                    if(userMoves >= steps){
                        if (steps === NUMBER_OF_MOVES){
                            console.log("YOU WON!!!!!!");
                            win();
                        } else {
                            console.log("user turn is over");
                            userTurn = false;
                            steps++;
                            setStepCount();
                            playSequence();    
                        }
                    }
                } else if (target !== sequence[userMoves] && buttons.indexOf(target) !== -1) {
                    console.log("YOU ARE WRONG");
                    wrongMove = true;
                    playSound(wrongMove);
                    setStepCount();
                    playSequence();
                }

            }
            
        }
    }

    document.getElementById("main-wrapper").addEventListener("click", play);
})