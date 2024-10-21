    const gameCanvas = document.querySelector('.gameCanvas');
    const startButton = document.getElementById('start');
    let scoreParagraph = document.getElementById('score');
    let highScoreParagraph = document.getElementById('highScore');
    scoreParagraph.innerText = `SCORE: 0`;
    scoreParagraph.style.textDecoration = 'underline';
    highScoreParagraph.style.textDecoration = 'underline';
    let addscore = 0;
    let highScore = localStorage.getItem('highScore') ? JSON.parse(localStorage.getItem('highScore')) : 0;
   
    
    for(let i = 0; i <= 209; i++) {
        if(i >= 200) {
            const takenSquare = document.createElement('div');
            takenSquare.classList.add('taken');
            gameCanvas.appendChild(takenSquare);
        }else{
            const gameSquare = document.createElement('div');
            gameSquare.classList.add('gameSquare');
            gameCanvas.appendChild(gameSquare);
        }
    }
    
    let gameSquaresArray = Array.from(document.querySelectorAll('.gameSquare'));
    let takenSquaresArray = Array.from(document.querySelectorAll('.taken'));
    let gameSquares = [...gameSquaresArray, ...takenSquaresArray]; /* Array.from(gameSquaresArray + takenSquaresArray); */
    const width = 10;
    
    
    const colors = [
        '#b81ab0', //pink
        '#D91656', //red
        '#ec559b', //light pink
        '#FFEB55', //yellow
        '#F9A03F', //orange
        '#2E2ED6', //blue
        '#24AE24', //green
        '#FFD700', //gold
        '#FFA500', //orange
        '#FF4500', //orange red
        '#FF6347', //tomato
        '#FF69B4', //hot pink
        '#FF7F50', //coral
        
    ]

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]
    
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    
    const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    let currentPosition = 4;
    let currentRotation = 0;
    let rnd = Math.floor(Math.random() * tetrominos.length);
    let rndColor = Math.floor(Math.random() * colors.length);
    let current = tetrominos[rnd][currentRotation];
    
    
    draw = () => {
        current.forEach(index => {
            gameSquares[currentPosition + index].classList.add('tetromino');
            gameSquares[currentPosition + index].style.backgroundColor = colors[rndColor];
        })
    }
    
    undraw = () => {
        current.forEach(index => {
            gameSquares[currentPosition + index].classList.remove('tetromino');
            gameSquares[currentPosition + index].style.backgroundColor = '';
        })
    }
    
    goDown = () => {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    
    let timer;
    
    freeze = () => {
        if(current.some(index => gameSquares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => gameSquares[currentPosition + index].classList.add('taken'));
            
            //start new tetromino

            const rndShape = Math.floor(Math.random() * tetrominos.length);
            rnd = rndShape;
            const rndColour = Math.floor(Math.random() * colors.length);
            rndColor = rndColour;
            currentRotation = 0;
            currentPosition = 4;  
            current = tetrominos[rnd][currentRotation];
            score();
            gameOver();
            draw();
        }
    }

    goLeft = () => {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -= 1;
        if(current.some(index => gameSquares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    goRight = () => {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if(!isAtRightEdge) currentPosition += 1;
        if(current.some(index => gameSquares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    checkRotation = () => {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        console.log(isAtRightEdge);
        if(isAtLeftEdge || isAtRightEdge){
            if(isAtLeftEdge){
                currentPosition += 1;
            } else {
                currentPosition -= 2;
            }
        }
    }


    rotate = (e) => {
        undraw();
        if(e.keyCode === 37){
            if(currentRotation === 0) {
                currentRotation = 3;
            } else{
                currentRotation -= 1;
            }
        } else {
            if(currentRotation === 3){
                currentRotation = 0;
            } else{
                currentRotation +=1;
            }
        }
        checkRotation();
        current = tetrominos[rnd][currentRotation];
        draw(); 
    }

    controls = (e) => {
        if (e.keyCode === 83){
            goDown();
        } else if (e.keyCode === 65){
            goLeft();
        } else if (e.keyCode === 68){
            goRight();
        } else if(e.keyCode === 37 || e.keyCode === 39){
            rotate(e);
        }   
    }

    score = () => {
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => gameSquares[index].classList.contains('taken'))) {
                addscore += 10;
                scoreParagraph.innerText = `SCORE: ` + `${addscore}`;
                if(addscore > highScore){
                    highScore = addscore;
                    highScoreParagraph.innerText = `HIGH SCORE: ` + `${highScore}`;
                    localStorage.setItem('highScore', JSON.stringify(highScore));
                }

                row.forEach(index => {
                    gameSquares[index].classList.remove('taken');
                    gameSquares[index].classList.remove('tetromino');
                    gameSquares[index].style.backgroundColor = '';
                });
                
                const squaresRemoved = gameSquares.splice(i, width);
                gameSquares = squaresRemoved.concat(gameSquares);
                gameSquares.forEach(cell => gameCanvas.appendChild(cell));
            }
        }

    }

    gameOver = () => {
        if(current.some(index => gameSquares[currentPosition + index].classList.contains('taken'))){
            alert('Game Over');
            clearInterval(timer);
            window.location.reload();
        }
    }

    document.addEventListener('keydown', controls);
    startButton.addEventListener('click', () => {
        if(timer){
            clearInterval(timer);
            timer = setInterval(goDown, 1000);
        } else {
            draw();
            timer = setInterval(goDown, 1000);
        }
    });