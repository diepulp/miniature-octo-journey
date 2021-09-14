document.addEventListener('DOMContentLoaded', () => {

    const GRID = document.querySelector('.grid');
    const SCORE_DISPLAY = document.querySelector('#score');
    const START_BUTTON = document.querySelector('#start-button');
    const width = 10;

    let squares = Array.from(document.querySelectorAll('.grid div'));
    let nextRandom = 0;
    let timerId;


    //The Tetrominoes

    //drawing using grid indexes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]


    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //Random selector
    // random = Math.floor(Math.random() * theTetrominoes.length);
    // current = theTetrominoes[random][currentRotation];
    // currentPosition = 4;

    //Randomly select a Tetromino and its first rotation
    function randomTetromino() {
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
    }
    randomTetromino();


    //draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    function unDraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

    //make the tetrimonoe move down every second
    //let timerId = setInterval(moveDown, 1000);

    //moveDown function
    function moveDown() {
        unDraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze function

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width]
            .classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index]
                .classList.add('taken'));
            //get a new tetromino
              //start a new tetromino
              random = nextRandom
              nextRandom = Math.floor(Math.random() * theTetrominoes.length)
              current = theTetrominoes[random][currentRotation]
              currentPosition = 4
            //randomTetromino();
            draw();
            displayShape();
        }
    }


    //move the piece left unless there is a blockage or another piece is there

    function moveLeft() {

        unDraw();

        //returns true if the index is 10, 20...
        const isLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        //only allow the piece to move left
        if (!isLeftEdge) {
            currentPosition--;
        }

        //store the piece if there is another one already there
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition++;
        }
        draw();
    }

    //move the piece right unless there is a blockage or another piece is there

    function moveRight() {

        unDraw();

        const isRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        //allow to move right only
        if (!isRightEdge) {
            currentPosition++;
        }

        //if some of the Tetromino squares overlap push them back a space in an array
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition--;
        }

        draw();

    }//end moveRight

    //Rotate 

    function rotate() {

        unDraw();

        currentRotation++;

        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];

        draw();
    }


    // KeyCodes and Events
    //N.B write a keycode.info look-a-ike website


    //assign function to control keys

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {//UP
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    //Display the next up

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;

    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ];

    //display next in the moni-grid

    function displayShape(){
        //remove the tetromino from the grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        })
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('tetromino');
        })
    }

    //add funcrionality to start buttin

    START_BUTTON.addEventListener('click', () => {
        if (timerId){
            clearInterval(timerId);
            timerId = null;
        }else{
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })









})//end of main
