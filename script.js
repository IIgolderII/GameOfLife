var canvas = document.querySelector("#gameOfLife");
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");

let arrayLength = 20;
let tab = Array.from({ length: arrayLength }, () =>
    Array.from({ length: arrayLength }, () => 0)
); // full of 0

const tileWidth = canvas.height / arrayLength;

let game;

const models = {
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

document.querySelector('#models').addEventListener('click', () => {
    document.querySelector('#models').classList.toggle("active");
});

Array.from(document.querySelectorAll('#models .list .item')).forEach(element => {
    element.addEventListener('click', () => {
        clearInterval(game);

        if (!models[element.dataset.name]) {
            return;
        }

        // document.querySelector('#models').classList.remove("active");

        let model = models[element.dataset.name];

        let topOffset = Math.floor(arrayLength / 2 - model.length / 2);
        let leftOffset = Math.floor(arrayLength / 2 - model[0].length / 2);

        tab = Array.from({ length: arrayLength }, () =>
            Array.from({ length: arrayLength }, () => 0)
        ); // full of false

        for (let i = 0; i < model.length; i++) {
            for (let j = 0; j < model[i].length; j++) {
                tab[i + topOffset][j + leftOffset] = model[i][j];
            }
        }

        draw();

        game = setInterval(() => {
            update();
            draw();
        }, 500);
    });
})

draw();

// document.addEventListener('click', () => {
//     update();
//     draw();
// });

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