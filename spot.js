const charSets = {
    numeric: "0123456789",
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    greek: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
    runes: "ᚠᚥᚧᚨᚩᚬᚭᚻᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛤ",
    braille: "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿",
}

const spotSettings = {
    spotGridSize: 5,
    charSet: charSets.braille,
    currentSpot: null,
    targetChar: null,
    timer: 15000,
    required: 5, // Set to 4 required successes for a round
    currentScore: 0,
};

let spotGridSize = 5;
let spotInterval;
let currentSpotTarget;
let preventClick = false;
let onClickAudio = new Audio("https://cdn.discordapp.com/attachments/946377425246355488/1324932109160415314/tilesuccess_7uCwFged.mp3?ex=6779f2ae&is=6778a12e&hm=ffcfa880a691a96daf15d550c4258948528b79c12d81ccbb2d26f96d6acf1e54&");
let successAudio = new Audio("https://cdn.discordapp.com/attachments/946377425246355488/1324932109520867397/complete_Cfdf1yoy.mp3?ex=6779f2ae&is=6778a12e&hm=dec337afeed34ccb1e02c4f4075e0804fff1f439194a38cd482fe83f4c1d8931&");
let failedAudio = new Audio("https://cdn.discordapp.com/attachments/946377425246355488/1324932109877379102/failed_xU2uSMHP.mp3?ex=6779f2af&is=6778a12f&hm=e029961d9bff3564f5665b47e03bfdb76cc1a7d0458a2da9c0ab10748dcfee86&");
let startAudio = new Audio("https://cdn.discordapp.com/attachments/946377425246355488/1324930314241577003/startgame_ZcF1jnRU.mp3?ex=6779f102&is=67789f82&hm=797cb339ceb358e0a76de0bf1f36a76066ab81e4ee30678c550d0891caba5945&");

function createSpotGrid(gridSize) {
    let squares = gridSize * gridSize;
    let addSquare = "";
    let gridTemplate = "";
    
    $("#spot-grid").empty();

    for (let i = 0; i < squares; i++) {
        addSquare += `<div class="spot-grid-square" data-spot="${i}"><div class="spot-square-text">?</div></div>`

        if (i % gridSize == 0) {
            gridTemplate += `1fr `;
        }
    }
   
    $("#spot-grid").append(addSquare);
    $("#spot-grid").css({"grid-template-columns": gridTemplate, "grid-template-rows": gridTemplate});
}
    
function updateSpotSquares() {
    clearInterval(spotInterval);
    spotInterval = setInterval(() =>{
        const randomSquare = Math.floor(Math.random() * spotSettings.spotGridSize*spotSettings.spotGridSize);
        if (randomSquare == spotSettings.currentSpot) return

        const randomChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
        if (randomChar == spotSettings.targetChar) return

        $(`[data-spot=${randomSquare}] .spot-square-text`).fadeOut(300, function() {
            $(`[data-spot=${randomSquare}] .spot-square-text`).text(randomChar);
            $(`[data-spot=${randomSquare}] .spot-square-text`).fadeIn(300)
        })
    }, 30)
}

function resetSpotTimer() {
    $("#spot-timer-bar-inner").css("width", "100%").animate({
        width: "0%",
    }, {
        duration: spotSettings.timer,
        complete: () => {
            endSpotGame(false);
        }
    });
}

function startSpotGame(settings) {
    startAudio.play();
    activeGame = "spot";
    settings.gridSize > 10 ? 10 : settings.gridSize;

    spotSettings.spotGridSize = settings.gridSize;
    spotSettings.charSet = charSets[settings.charSet];
    spotSettings.timer = settings.timeLimit;
    spotSettings.required = settings.required;

    createSpotGrid(settings.gridSize);
    displayScreen("spot", "start");
    $("#spot-timer-bar-inner").css("width", "100%");
    $("#spot-container").fadeIn();
     spotSettings.targetChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
    $("#spot-target").text(spotSettings.targetChar)
   
    spotSettings.currentSpot = Math.floor(Math.random() * spotSettings.spotGridSize*spotSettings.spotGridSize);
    
    updateSpotSquares();

    $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).text(spotSettings.targetChar);

    startTimeout = setTimeout(() => {
        if (activeGame == "spot") {
            hideScreen();
            $("#spot-grid").show();
            $("#spot-timer-container").show();
            $("#spot-target").fadeIn();
            $("#spot-timer-bar-inner").css("width", "100%");
            
            $("#spot-timer-bar-inner").animate({
                width: "0%",
            }, {
                duration: spotSettings.timer,
                complete: () => {
                    endSpotGame(false)
                }
            })
        }
    }, 4000);

}

function endSpotGame(win) {
    if (activeGame != "spot") return;

    clearInterval(spotInterval);
    $("#spot-timer-bar-inner").stop();

    if (win) {
        if (spotSettings.currentScore >= spotSettings.required) {
            successAudio.play();
            $("#spot-timer-bar-inner").stop();
            $("#spot-grid").hide();
            $("#spot-timer-container").hide();
            $("#spot-target").hide();
            displayScreen("spot", "success");

            setTimeout(() => {
                hideScreen();
                resetSpot(); // Fully reset the game
                spotSettings.currentScore = 0; // Reset score for the next round

                // Change target character set to Braille
                spotSettings.charSet = charSets.braille;

                // Start a new round with Braille targets
                startSpotGame({
                    gridSize: spotSettings.spotGridSize,
                    charSet: "braille", // Switch to Braille
                    timeLimit: spotSettings.timer,
                    required: spotSettings.required,
                });
            }, 2000); // Short delay for the success screen
        } else {
            // Continue the game with a new target and reset the timer
            let newTargetChar;
            do {
                newTargetChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
            } while (newTargetChar === spotSettings.targetChar);

            spotSettings.targetChar = newTargetChar;
            $("#spot-target").fadeIn(spotSettings.targetChar);

            let newSpotTarget;
            do {
                newSpotTarget = Math.floor(Math.random() * spotSettings.spotGridSize * spotSettings.spotGridSize);
            } while (newSpotTarget === spotSettings.currentSpot);

            spotSettings.currentSpot = newSpotTarget;
            $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).text(spotSettings.targetChar);

            updateSpotSquares();
            resetSpotTimer();
        }
    } else {
        failedAudio.play();
        $("#spot-timer-bar-inner").stop();
        $("#spot-grid").hide();
        $("#spot-timer-container").hide();
        $("#spot-target").hide();
        displayScreen("spot", "failTime");

        setTimeout(() => {
            hideScreen();
            $.post(`https://${scriptName}/endGame`, JSON.stringify({ success: win }));
            resetSpot(); // Reset game on failure
        }, 2000);
    }
}


function resetSpot() {
    hideScreen();
    clearInterval(spotInterval);
    $("#spot-timer-bar-inner").stop();
    $("#spot-grid").hide();
    $("#spot-timer-container").hide();
    $("#spot-target").hide();
    spotSettings.currentScore = 0;
}

$("#spot-grid").on("click", ".spot-grid-square", function () {
    if ($(this).data("spot") == spotSettings.currentSpot && !preventClick) {
        onClickAudio.play();
        spotSettings.currentScore++;

        if (spotSettings.currentScore >= spotSettings.required) {
            endSpotGame(true); // Trigger success when required score is reached
            return;
        }

        $("#spot-timer-bar-inner").stop();
        $("#spot-timer-bar-inner").css("width", "100%");
        preventClick = true;

        let newSpotTarget;
        do {
            newSpotTarget = Math.floor(Math.random() * spotSettings.spotGridSize * spotSettings.spotGridSize);
        } while (newSpotTarget == spotSettings.currentSpot);

        let randomChar;
        do {
            randomChar = spotSettings.charSet[Math.floor(Math.random() * spotSettings.charSet.length)];
        } while (randomChar == spotSettings.targetChar);

        clearInterval(spotInterval);

        $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).fadeOut(400, function () {
            $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).text(randomChar);
            $(`[data-spot=${spotSettings.currentSpot}] .spot-square-text`).fadeIn(400);
            spotSettings.currentSpot = newSpotTarget;
            $(`[data-spot=${newSpotTarget}] .spot-square-text`).text(spotSettings.targetChar);
            updateSpotSquares();
            preventClick = false;

            resetSpotTimer();
        });
    }
})