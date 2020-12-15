// Strings
let strLst = [
    `Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.`,
    `I'm a success today because I had a friend who believed in me and I didn't have the heart to let him down.`,
    `Success is not final, failure is not fatal: it is the courage to continue that counts.`,
    `We all make choices in life, but in the end our choices make us. A man chooses, a slave obeys.`,
    `The right man in the wrong place can make all the difference in the world.`,
    `How many are there in you? Whose hopes and dreams do you encompass? Could you but see the eyes in your own, the minds in your mind, you would see how much we share.`,
    `The healthy human mind doesn't wake up in the morning thinking this is its last day on Earth. But I think that's a luxury, not a curse. To know you're close to the end is a kind of freedom. Good time to take inventory.`,
    `Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.`,
    `You know you're in love when you can't fall asleep because reality is finally better than your dreams.`,
    `If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.`,
    `Friendship is born at the moment when one man says to another "What! You too? I thought that no one but myself..."`
];

// Variables.
let string = strLst[Math.floor(Math.random() * strLst.length)];
let time = 0;
let character = 0;
let cpm = 0;
let incorrect_chars = 0;

let paused = true;

// Objects.
const disp = document.getElementById("display");
const time_disp = document.getElementById("time");
const wpm_disp = document.getElementById("wpm");
const acc_disp = document.getElementById("accuracy");

// Update display;
function updateStringDisplay(color = "#008000") {
    // Clear the display.
    disp.innerHTML = "";

    // Loop through and display the characters.
    for (let i = 0; i < string.length; i++) {
        if (i == character) {
            disp.innerHTML += `<span style="background-color: ${color}; color: white;">${string[i]}</span>`;
        } else {
            disp.innerHTML += string[i];
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