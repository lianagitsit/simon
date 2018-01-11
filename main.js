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

    function setStepCount(){
        setTimeout(function(){
            $("#steps").text(steps);
        }, 1000);
    }

    function playSound(button){
        if (button === "green"){
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

    function play(e){
        var target = e.target.id;
        console.log("user has clicked: " + target);

        if (target === "power-switch"){
            powerOn ? powerOn = false : powerOn = true;
            $("#power-switch").toggleClass("on");
            $("#steps").toggleClass("steps-power-on");
            if (powerOn){
                console.log("power is on");
            } else {
                console.log("power is off");
                $("#steps").text("--");
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
                start = true;
                console.log("start");
                // generate array with the gameplay sequence
                for (var i = 0; i < NUMBER_OF_MOVES; i++){
                    sequence[i] = buttons[Math.floor(Math.random() * 3)];
                }

                // flash step counter - add CSS class for this?
                $("#steps").toggle();
                setTimeout( function(){
                    $("#steps").toggle();
                }, 200);

                setStepCount();

                // press the button
               /* if (sequence[steps - 1] === "red"){
                    setTimeout(function(){
                        //$("#red").toggleClass("pressed");
                        document.getElementById("red-sound").play();
                        console.log(steps + " step is:" + sequence[steps - 1]);
                        //$("#red").toggleClass("pressed");
                        // set the number of steps the user has to do
                        

                    }, 1000);
                    userTurn = true;
                }*/

                console.log("sequence: " + sequence);

                var myVar;
                var step = 0;
                
                function playSequence(){
                    myVar = setInterval(function(){
                        console.log(steps + " step is:" + sequence[step]);
                        playSound(sequence[step]);
                        step++;
                        //steps++;
                        if(step >= steps){
                            userTurn = true;
                            clearInterval(myVar);
                        }
                    }, 1000);

                }

                playSequence();


                /*for (var step = 0; step < 6; step++){
                    setTimeout(function(){
                        playSound(sequence[step]);
                        console.log(steps + " step is:" + sequence[steps - 1]);
                    }, 1000);
                }*/
            } 

            var userMoves = 0;

            if (userTurn){
                playSound(target);
                if (target === sequence[userMoves]){
                    console.log("correct move");
                    userMoves++;
                    if(userMoves === steps){
                        console.log("user turn is over");
                        userTurn = false;
                        steps++;
                        setStepCount();
                    }

                }

            }
            
        }
    }

    document.getElementById("main-wrapper").addEventListener("click", play);
})