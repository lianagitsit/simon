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
    var run, myWin;
    var userMoves = 0;
    var wrongMove = false;
    var nowPlaying = false;
    var playerWon = false;

    function setStepCount(){
        if (!powerOn){
            $("#steps").text("--");
        
        // flash step counter at game start, wrong move, and win
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

    // SOUND
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
    
    // play the sequence up until the number of steps in the current series
    function playSequence(){
        var step = 0;
        var stepsLocal = 1;

        nowPlaying = true;
        setStepCount();

        run = setInterval(function(){
            console.log(stepsLocal + " step is:" + sequence[step]);
            playSound(sequence[step]);
            step++;
            stepsLocal++;
            if(step >= steps){
                userTurn = true;
                userMoves = 0;
                clearInterval(run);
            }
        }, 1000);
    }

    function reset(){
        steps = 1;
        userTurn = false;
        nowPlaying = false;
        start = true;

        // generate array with the gameplay sequence
        for (var i = 0; i < NUMBER_OF_MOVES; i++){
            sequence[i] = buttons[Math.floor(Math.random() * 3)];
        }

        console.log("sequence: " + sequence);

        $("#steps").text("--");
        setStepCount();
    }

    function win(){
        playerWon = true;
        nowPlaying = false;

        setStepCount();

        var i = 0;
        var revolutions = 0;

        // play a bunch of sounds in rapid succession - yay
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

        // POWER SWITCH
        if (target === "power-switch"){
            $("#power-switch").toggleClass("on");
            $("#steps").toggleClass("steps-power-on");
            if (!powerOn){
                powerOn = true;
                console.log("power is on");
            } else {
                powerOn = false;
                reset();
                console.log("power is off");
            }
        }

        if (powerOn){

            // START
            if (target === "start"){
                reset();
                start = false;
                playSequence();
            
            // STRICT MODE
            } else if (target === "strict"){
                // if strict mode is on, turn it off; if it's off, turn it on
                strictOn ? strictOn = false : strictOn = true;
                $("#strict-light").toggleClass("strict-light-on");
            } 

            // USER'S TURN
            if (userTurn === true){
                // if the user moves correctly, let them make the next move
                if (target === sequence[userMoves]){
                    playSound(target);
                    userMoves++;

                    // if they've guessed all of the steps in the current series...
                    if (userMoves >= steps){
                        // if it's the full series, they win!
                        if (steps === NUMBER_OF_MOVES){
                            win();

                        // if it's not the full series, the turn ends and another 
                        // step is added to the series
                        } else {
                            userTurn = false;
                            steps++;
                            setStepCount();
                            playSequence();    
                        }
                    }
                
                // if they make the wrong move, alert them and replay the current sequence
                } else if (target !== sequence[userMoves] && buttons.indexOf(target) !== -1) {
                    wrongMove = true;
                    playSound(wrongMove);
                    setStepCount();

                    // if strict mode is on, the game restarts with a fresh sequence
                    if (strictOn){
                        reset();
                    }

                    playSequence();
                }

            }
            
        }
    }

    document.getElementById("main-wrapper").addEventListener("click", play);
})