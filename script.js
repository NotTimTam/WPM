// Strings
// let strLst = [
//     `You may be an undigested bit of beef, a blot of mustard, a crumb of cheese, a fragment of an underdone potato. There's more of gravy than of grave about you, whatever you are!`,
//     `Life, although it may only be an accumulation of anguish, is dear to me, and I will defend it. Remember, thou hast made me more powerful than thyself; my height is superior to thine, my joints more supple.`,
//     `My dear, do not give way to such gloomy thoughts. Let us hope for better things. Let us flatter ourselves that I may be the survivor.`,
//     `But it's no use now to pretend to be two people! Why, there's hardly enough of me left to make one respectable person!`,
//     `No matter how dreary and gray our homes are, we people of flesh and blood would rather live there than in any other country, be it ever so beautiful. There is no place like home.`,
//     `There is an ecstasy that marks the summit of life, and beyond which life cannot rise. And such is the paradox of living, this ecstasy comes when one is most alive, and it comes as a complete forgetfulness that one is alive.`,
//     `If you shut your eyes and are a lucky one, you may see at times a shapeless pool of lovely pale colours suspended in the darkness;`,
//     `Suffering has been stronger than all other teaching, and has taught me to understand what your heart used to be. I have been bent and broken, but, I hope, into a better shape.`,
//     `It is a fair, even-handed, noble adjustment of things, that while there is infection in disease and sorrow, there is nothing in the world so irresistibly contagious as laughter and good humour.`,
//     `Jim said that bees won't sting idiots, but I didn't believe that, because I tried them lots of times myself and they wouldn't sting me.`,
//     `What you do in this world is a matter of no consequence. The question is what can you make people believe you have done.`,
//     `Now is the dramatic moment of fate, Watson, when you hear a step upon the stair which is walking into your life, and you know not whether for good or ill.`,
//     `There comes an end to all things; the most capacious measure is filled at last; and this brief condescension to evil finally destroyed the balance of my soul.`,
//     `A wonderful fact to reflect upon, that every human creature is constituted to be that profound secret and mystery to every other.`,
//     `There is no folly of the beast of the earth which is not infinitely outdone by the madness of man.`
// ];

let strLst = ['yes'];

// Variables.
let string = strLst[Math.floor(Math.random() * strLst.length)];
let time = 0;
let character = 0;
let cpm = 0;
let incorrect_chars = 0;

// Is the game paused.
let paused = true;

// Is the game on blindfolded mode.
let blindfolded = false;

// Score history.
let scoreHistory = [];

// Objects.
const disp = document.getElementById("display");
const time_disp = document.getElementById("time");
const wpm_disp = document.getElementById("wpm");
const acc_disp = document.getElementById("accuracy");
let win_disp = document.getElementById("winhistory");

// Update display.
function updateStringDisplay(color = "blue") {
    // Clear the display.
    disp.innerHTML = "";

    // Loop through and display the characters.
    for (let i = 0; i < string.length; i++) {
        if (i == character) {
            disp.innerHTML += `<span style="background-color: ${color}; color: white;">${string[i]}</span>`;
        } else {
            if (blindfolded) {
                if (i == character) {
                    disp.innerHTML += `<span style="background-color: white; color: white;">${string[i]}</span>`;
                } else if (i == character-1 || i == character+1) {
                    disp.innerHTML += `<span style="background-color: white; color: black; opacity: 75%;">${string[i]}</span>`;
                } else {
                    disp.innerHTML += `<span style="background-color: white; color: black; opacity: 0%;">${string[i]}</span>`;
                }
            } else {
                disp.innerHTML += string[i];
            }
        }
    }
}

updateStringDisplay("blue");

// Check character against string.
function checkChar(event) {
    // Compare the keycodes.
    if (event.keyCode == string.charCodeAt(character)) {
        return true;
    } else {
        return false;
    }
}

// Event listeners.
window.addEventListener("keypress", function (e) {
    if (paused && !(character == string.length)) {
        // Start the game by removing intervals, setting new intervals, and unpausing.
        window.clearInterval(0);
        window.clearInterval(1);
        window.clearInterval(2);

        window.setInterval(inc, 10);
        window.setInterval(wpm, 10);
        window.setInterval(timer, 10);

        paused = false;
    }
    // Prevent regular keystrokes.
    e.preventDefault();
    
    // Compare the keys.
    let ret = checkChar(e);

    // If we didn't hit ctrl or shift we update the disp.
    if (e.keyCode != 17 && e.keyCode != 16) {
        if (ret) {
            character ++;
            updateStringDisplay("blue");
        } else {
            incorrect_chars ++;
            updateStringDisplay("red");
        }
    }

    // Check if we need to pause because we won.
    if (character == string.length && !paused) {
        scoreHistory.push(wpm());
        displayWins();
        console.log(scoreHistory);
    }
    if (character == string.length) {
        paused = true;
    } else {
        paused = false;
    }
});

// Timer.
function timer() {
    if (!paused) {
        // Count down.
        time += 0.01;
    }

    // Update display.
    time_disp.innerText = time.toFixed(2) + "s";
}

// Calculate WPM.
function wpm() {
    let timeElapsed = time/60; // In minutes.
    let wpm = ((character) / 5) / timeElapsed; // Overall wpm without errors.
    let net_wpm = (((character) / 5) - incorrect_chars) / timeElapsed; // Overall wpm with errors.

    // Update display.
    wpm_disp.innerHTML = `WPM: ${Math.ceil(wpm)}<br>NET WPM: ${Math.ceil(net_wpm)}`;

    return wpm;
}

// Calculate accuracy.
function inc() {
    let accuracy = (((string.length-incorrect_chars) / string.length)) * 100;

    if (accuracy < 0) {
        accuracy = 0;
    }

    // Update display.
    acc_disp.innerText = "ACC: " + accuracy.toFixed(2) + '%';
}

// Reset with a new quote.
function newGame(element=document.getElementById("shuffle")) {
    string = strLst[Math.floor(Math.random() * strLst.length)];
    time = 0;
    character = 0;
    cpm = 0;
    incorrect_chars = 0;
    paused = true;

    updateStringDisplay("blue");

    element.blur();

    wpm_disp.innerHTML = "WPM: 0<br>NET WPM: 0";
}


// Display wins.
function displayWins() {
    let average = 0;
    let top = 0;
    
    for (let i = 0; i < scoreHistory.length; i++) {
        if (scoreHistory[i] > top) {
            top = scoreHistory[i];
        }

        average += scoreHistory[i];
    }

    average = average / scoreHistory.length;

    win_disp.innerHTML = `High Score: ${top.toFixed(2)}<br>Average WPM: ${average.toFixed(2)}`;
}

// Toggle blindfold.
function blindfold() {
    blindfolded = !blindfolded;

    let blindfoldbutton = document.getElementById("blindfolded");
    if (blindfolded) {
        blindfoldbutton.src = "images/lined.svg";
    } else {
        blindfoldbutton.src = "images/no lined.svg";
    }

    updateStringDisplay();
}