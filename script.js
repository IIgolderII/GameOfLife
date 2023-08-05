var canvas = document.querySelector("#gameOfLife");
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");

let arrayLength = 30;
let tileWidth = canvas.height / arrayLength;
let tab = Array.from({ length: arrayLength }, () =>
    Array.from({ length: arrayLength }, () => 0)
); // full of 0

let rate = 1;

let game;

const models = {
    "Empty": [
        [0],
    ],
    "Block": [
        [1, 1],
        [1, 1],
    ],
    "Bee-hive": [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
    ],
    "Loaf": [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
    ],
    "Boat": [
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
    ],
    "Tub": [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
    ],
    "Blinker": [
        [1, 1, 1],
    ],
    "Toad": [
        [0, 1, 1, 1],
        [1, 1, 1, 0],
    ],
    "Beacon": [
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 1],
    ],
    "Pulsar": [
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    ],
    "Penta-decathlon": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
    ],
    "Glider": [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
    ],
    "Light-weight spaceship": [
        [1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
    ],
    "Middle-weight spaceship": [
        [0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
    ],
    "Heavy-weight spaceship": [
        [0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 0, 0],
    ],
}

document.querySelector('#sidebar').addEventListener('click', () => {
    document.querySelector('#sidebar').classList.toggle("active");
});

Array.from(document.querySelectorAll('#models .list .item')).forEach(element => {
    element.addEventListener('click', () => {
        stop()

        if (!models[element.dataset.name]) {
            return;
        }

        let model = models[element.dataset.name];

        let topOffset = Math.floor(arrayLength / 2 - model.length / 2);
        let leftOffset = Math.floor(arrayLength / 2 - model[0].length / 2);

        tab = Array.from({ length: arrayLength }, () =>
            Array.from({ length: arrayLength }, () => 0)
        ); // full of 0

        for (let i = 0; i < model.length; i++) {
            for (let j = 0; j < model[i].length; j++) {
                tab[i + topOffset][j + leftOffset] = model[i][j];
            }
        }

        draw();
    });
})

draw();

const playPauseButton = document.querySelector('#controls button.playPause');
const gridLengthInput = document.querySelector('#controls #gridLength');
const rateInput = document.querySelector('#controls #rate');

playPauseButton.addEventListener('click', () => {
    if (playPauseButton.classList.contains('play')) {
        start();
    } else {
        stop();
    }
});
document.querySelector('#controls button.next').addEventListener('click', () => {
    stop();
    update();
    draw();
});
gridLengthInput.addEventListener('change', () => {
    stop();
    let value = Math.max(gridLengthInput.value, 10);
    gridLengthInput.value = value;
    arrayLength = value;
    tab = Array.from({ length: arrayLength }, () =>
        Array.from({ length: arrayLength }, () => 0)
    ); // full of 0
    tileWidth = canvas.height / arrayLength;
    draw();
});
rateInput.addEventListener('change', () => {
    let value = Math.max(rateInput.value, .1)
    rateInput.value = value;
    rate = value;
    stop();
    start();
});

// canvas.addEventListener('click', (event) => {
//     console.log(event.offsetX);
// });

function start() {
    game = setInterval(() => {
        update();
        draw();
    }, rate * 500);
    playPauseButton.classList.remove('play');
    playPauseButton.classList.add('pause');
}

function stop() {
    if (game) {
        clearInterval(game);
    }
    playPauseButton.classList.remove('pause');
    playPauseButton.classList.add('play');
}

function update() {
    let newTab = Array.from({ length: arrayLength }, () =>
        Array.from({ length: arrayLength }, () => 0)
    ); // full of false

    for (let i = 0; i < arrayLength; i++) {
        for (let j = 0; j < arrayLength; j++) {
            let neightboursCount =
                (i < arrayLength - 1 && tab[i + 1][j]) + // down
                (i > 0 && tab[i - 1][j]) + // up
                (j < arrayLength - 1 && tab[i][j + 1]) + // right
                (j > 0 && tab[i][j - 1]) + // left
                (i < arrayLength - 1 && j < arrayLength - 1 && tab[i + 1][j + 1]) + // down right
                (i > 0 && j < arrayLength - 1 && tab[i - 1][j + 1]) + // up right
                (i < arrayLength - 1 && j > 0 && tab[i + 1][j - 1]) + // down left
                (i > 0 && j > 0 && tab[i - 1][j - 1]); // up left

            if ((tab[i][j] && neightboursCount > 1 && neightboursCount < 4) || (!tab[i][j] && neightboursCount == 3)) {
                newTab[i][j] = true;
            }
        }
    }

    tab = newTab;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < arrayLength; i++) {
        ctx.moveTo(0, i * tileWidth);
        ctx.lineTo(canvas.width, i * tileWidth);
        ctx.moveTo(i * tileWidth, 0);
        ctx.lineTo(i * tileWidth, canvas.width);
        for (let j = 0; j < arrayLength; j++) {
            if (tab[i][j]) {
                ctx.fillRect(j * tileWidth, i * tileWidth, tileWidth, tileWidth);
            }
        }
    }
    ctx.moveTo(0, canvas.width);
    ctx.lineTo(canvas.width, canvas.width);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.width);
    ctx.stroke();
}