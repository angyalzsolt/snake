let snake = [];

let foodX;
let foodY;
let difficulty;
let prevKey;
let count = 0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function moveSnake(){
	eatFood();
	ctx.fillStyle = '#5eff73';
	ctx.lineWidth = 1;
	snake.forEach((block)=>{
		ctx.strokeRect(block.x, block.y, 25, 20);
		ctx.fillRect(block.x, block.y, 25, 20);
	})
	let x = snake.shift();
	ctx.clearRect(x.x - 1, x.y -1, 27, 22);

	// console.log(snake);
}

function moveRight(){
	if(prevKey !== 100){
		return;
	}
	checkField();
	setTimeout(function x(){
		let direction = snake[snake.length - 1].x + 27;
		snake.push({x: direction, y: snake[snake.length - 1].y});
		let snakeBody = snake.filter((block)=>{
			return block.x === direction && block.y === snake[snake.length-1].y;
		});
		checkSnake(snakeBody);
		moveSnake();
		moveRight();
	}, difficulty);
};

function moveLeft(){
	if(prevKey !== 97){
		return;
	}
	checkField();
	setTimeout(function x(){
		let direction = snake[snake.length - 1].x - 27;
		snake.push({x: direction, y: snake[snake.length - 1].y});
		let snakeBody = snake.filter((block)=>{
			return block.x === direction && block.y === snake[snake.length-1].y;
		})
		checkSnake(snakeBody);
		moveSnake();
		moveLeft();
	}, difficulty);
};

function moveDown(){
	if(prevKey !== 115){
		return;
	}
	checkField();
	setTimeout(function x(){
		let direction = snake[snake.length - 1].y + 22;
		snake.push({x: snake[snake.length - 1].x, y: direction});
		let snakeBody = snake.filter((block)=>{
			return block.y === direction && block.x === snake[snake.length-1].x;
		});
		checkSnake(snakeBody);
		moveSnake();
		moveDown();
	}, difficulty);
}

function moveUp(){
	if(prevKey !== 119){
		return;
	}
	checkField();
	setTimeout(function x(){
		let direction = snake[snake.length - 1].y - 22;
		snake.push({x: snake[snake.length - 1].x, y: direction});
			let snakeBody = snake.filter((block)=>{
			return block.y === direction && block.x === snake[snake.length-1].x;
		});
		checkSnake(snakeBody);
		moveSnake();
		moveUp();
	}, difficulty);
}



function getFood(){
	let i = true;
	while(i){
		foodX = Math.floor(Math.random() * Math.floor(490));
		foodY = Math.floor(Math.random() * Math.floor(490));
		if(snake.every(obj => Math.abs(obj.x - foodX) > 5 && Math.abs(obj.y - foodY) > 5)){
			i = false;
		}
	}

	// console.log('x', foodX, 'foodY', foodY)
	ctx.fillStyle = '#ff5e5e';
	ctx.lineWidth = 1;
	ctx.strokeRect(foodX, foodY, 25, 20);
	ctx.fillRect(foodX, foodY, 25, 20);
};


function eatFood(){
	if(Math.abs(snake[snake.length - 1].x - foodX) < 15 && Math.abs(snake[snake.length - 1].y - foodY) < 15 ){
		// console.log('I ate the food');
		ctx.clearRect(foodX -1, foodY-1, 27, 22);
		getFood();
		snake.unshift({x: snake[0].x, y: snake[0].y});
		count++;
		createMsg(`Your score ${count}`);
	}
}

function checkSnake(snakeBody){
	if(snakeBody.length > 1){
		createMsg(`You just ate yourself...Your score: ${count}`);
		return resetGame();
	};
}

function checkField(){
	if(snake[snake.length - 1].x > 490 || snake[snake.length- 1].x < - 5 || snake[snake.length- 1].y > 490 || snake[snake.length- 1].y < -5){
		createMsg(`You hit the wall, your score: ${count}`);
		return resetGame();
	}
}



document.querySelector('#setup').addEventListener('submit', (e)=>{
	e.preventDefault();
	let name = e.target.elements.username.value;
	difficulty = e.target.elements.difficulty.value;
	// console.log('name: ', name, 'diffuculty', difficulty);
	startGame();
})




// moveSnake();
function startGame(){
	snake.forEach((block)=>{
		ctx.clearRect(block.x - 1, block.y -1, 27, 22);
	});
	snake = [
		{x: 30, y: 40},
		{x: 57, y: 40},
		{x: 84, y: 40},
		{x: 111, y: 40}
	];
	if(foodX !== undefined && foodY !== undefined){
		return;
	}

	createMsg('Control with W + A + S + D, good luck!');
	getFood();
	moveSnake();

	window.addEventListener('keypress',handler = (e)=>{
		if(e.charCode === 100 && prevKey !== 97){
			prevKey = e.charCode;
			moveRight();
		} else if(e.charCode === 97 && prevKey !== 100){
			prevKey = 97;
			moveLeft();
		} else if(e.charCode === 115 && prevKey !== 119){
			prevKey = e.charCode;
			moveDown();
		} else if(e.charCode === 119 && prevKey !== 115){
			prevKey = e.charCode;
			moveUp();
		}
	})
}

function resetGame(){
	ctx.clearRect(foodX -1, foodY-1, 27, 22);
	foodx = undefined;
	foodY = undefined;
	prevKey = undefined;
	count = 0;
	window.removeEventListener('keypress', handler);

}


function createMsg(msg){
	document.querySelector('#msg').innerHTML = '';
	document.querySelector('#msg').innerHTML = msg;
}