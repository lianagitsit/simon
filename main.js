$(document).ready( function(){
    console.log("ready");

    var strictOn = false;
    var powerOn = false;
    var userMoves = 0;
    var buttons = ["green", "red", "yellow", "blue"];
    var sequence = [];
    const NUMBER_OF_MOVES = 15;
    var start = false;
    var userTurn = false;
    var stepsInCurrentSeries = 1;
    var myWin;
    var userMoves = 0;
    var wrongMove = false;
    var nowPlaying = false;
    var playerWon = false;
    var tempo = 1000;

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
                setTimeout(function(){
                    $("#steps").text("--");
                }, 3000);
            }
            $("#steps").addClass("blink");
        } 
        
        if (stepsInCurrentSeries > 0 &&  nowPlaying) {
            setTimeout(function(){
                $("#steps").text(stepsInCurrentSeries);
                $("#steps").removeClass("blink");
            }, 1000);
        }
    }

    // SOUND
    var wrongSound = document.getElementById("wrong-sound");
    var greenSound = document.getElementById("green-sound");
    var redSound = document.getElementById("red-sound");
    var yellowSound = document.getElementById("yellow-sound");
    var blueSound = document.getElementById("blue-sound");

    function playSound(button){
        var pressedClassTimeout = 100
        if (button === wrongMove){
            wrongSound.currentTime = 0;
            wrongSound.play();
        } else if (button === "green"){
            $("#green").addClass("pressed");
            setTimeout(function(){
                $("#green").removeClass("pressed");
            }, pressedClassTimeout);
            greenSound.currentTime = 0;
            greenSound.play();
        } else if (button === "red"){
            $("#red").addClass("pressed");
            setTimeout(function(){
                $("#red").removeClass("pressed");
            }, pressedClassTimeout);
            redSound.currentTime = 0;
            redSound.play();
        } else if (button === "yellow"){
            $("#yellow").addClass("pressed");
            setTimeout(function(){
                $("#yellow").removeClass("pressed");
            }, pressedClassTimeout);
            yellowSound.currentTime = 0;
            yellowSound.play();
        } else if (button === "blue"){
            $("#blue").addClass("pressed");
            setTimeout(function(){
                $("#blue").removeClass("pressed");
            }, pressedClassTimeout);
            blueSound.currentTime = 0;
            blueSound.play();
        }   
    }
    
    // play the sequence up until the number of steps in the current series
    function playSequence(){
        var step = 0;
        var stepsLocal = 1;

        nowPlaying = true;
        setStepCount();

        if (stepsInCurrentSeries === 4){
            tempo = 800;
        } else if (stepsInCurrentSeries === 8){
            tempo = 600;
        } else if (stepsInCurrentSeries === 12){
            tempo = 400;
        }

        var runSeries = function() {
            //console.log(stepsLocal + " step is:" + sequence[step] + " and tempo is " + tempo);
            playSound(sequence[step]);
            step++;

            if(step >= stepsInCurrentSeries){
                userTurn = true;
                userMoves = 0;
            } else {
                setTimeout(runSeries, tempo);
            }

        }
        setTimeout(runSeries, tempo);

    }

    function reset(){
        stepsInCurrentSeries = 1;
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
        var winTempo = 100;

        // play a bunch of sounds in rapid succession - yay
        var myWin = function(){
            playSound(buttons[i]);
            i++;
            if (i === buttons.length){
                i = 0;
                revolutions++;
            }
            if (revolutions < 4){
                setTimeout(myWin, winTempo);
            }
        }
        setTimeout(myWin, winTempo);

    }

    function play(e){
        var target = e.target.id;
        //console.log("user has clicked: " + target);

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
                    if (userMoves >= stepsInCurrentSeries){
                        // if it's the full series, they win!
                        if (stepsInCurrentSeries === NUMBER_OF_MOVES){
                            setTimeout(win, 500);

                        // if it's not the full series, the turn ends and another 
                        // step is added to the series
                        } else {
                            userTurn = false;
                            stepsInCurrentSeries++;
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