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
		ctx.strokeRect(block.x, block.y, 25, 25);
		ctx.fillRect(block.x, block.y, 25, 25);
	})
	let x = snake.shift();
	ctx.clearRect(x.x - 1, x.y -1, 27, 27);

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
		let direction = snake[snake.length - 1].y + 27;
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
		let direction = snake[snake.length - 1].y - 27;
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
		foodX = Math.floor(Math.random() * Math.floor(470));
		foodY = Math.floor(Math.random() * Math.floor(470));
		if(snake.every(obj => Math.abs(obj.x - foodX) > 10 && Math.abs(obj.y - foodY) > 10)){
			i = false;
		}
	}

	// console.log('x', foodX, 'foodY', foodY)
	ctx.fillStyle = '#ff5e5e';
	ctx.lineWidth = 1;
	ctx.strokeRect(foodX, foodY, 25, 25);
	ctx.fillRect(foodX, foodY, 25, 25);
};


function eatFood(){
	if(Math.abs(snake[snake.length - 1].x - foodX) < 25 && Math.abs(snake[snake.length - 1].y - foodY) < 25 ){
		// console.log('I ate the food');
		ctx.clearRect(foodX -1, foodY-1, 27, 27);
		getFood();
		snake.unshift({x: snake[0].x, y: snake[0].y});
		count++;
		createMsg(`Your score ${count}`);
	}
}

function checkSnake(snakeBody){
	if(snakeBody.length > 1){
		createMsg(`You just ate yourself...Your score: ${count}`);
		sendScore(username, count);
		return resetGame();
	};
}

function checkField(){
	if(snake[snake.length - 1].x > 461 || snake[snake.length- 1].x < - 1 || snake[snake.length- 1].y > 461 || snake[snake.length- 1].y < -1){
		createMsg(`You hit the wall, your score: ${count}`);
		sendScore(username, count);
		return resetGame();
	}
}

// moveSnake();
function startGame(){
	snake.forEach((block)=>{
		ctx.clearRect(block.x - 1, block.y -1, 27, 27);
	});
	snake = [
		{x: 108, y: 0},
		{x: 0, y: 0},
		{x: 27, y: 0},
		{x: 54, y: 0},
		{x: 81, y: 0}
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
	ctx.clearRect(foodX -1, foodY-1, 27, 27);
	foodx = undefined;
	foodY = undefined;
	prevKey = undefined;
	count = 0;
	document.getElementById('username').removeAttribute('disabled');
	document.getElementById('startBtn').removeAttribute('disabled');
	window.removeEventListener('keypress', handler);

}


function createMsg(msg){
	document.querySelector('#msg').innerHTML = '';
	document.querySelector('#msg').innerHTML = msg;
}


function sendData(username, difficulty){
	let xhr = new XMLHttpRequest();
	xhr.open('post', 'db.php', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = ()=>{
		if (xhr.readyState == 4 && xhr.status == 200) {
      		console.log(xhr.responseText);
      		document.getElementById('errorMsg').innerHTML = xhr.responseText;
    	}
	}
	xhr.send(`username=${username}&difficulty=${difficulty}`);
}


function sendScore(username, score){
	let xhr = new XMLHttpRequest();
	xhr.open('post', 'db.php', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = ()=>{
		if (xhr.readyState == 4 && xhr.status == 200) {
      		console.log(xhr.responseText);
    	}
	}
	xhr.send(`username=${username}&score=${count}`);
};


let username;
document.querySelector('#setup').addEventListener('submit', (e)=>{
	e.preventDefault();

	getData().then((record)=>{
		records = Object.values(record);
		renderData(records);
		return record;
	}).catch((error)=>{
		console.log(`Error: ${error}`)
	});

	username = e.target.elements.username.value;
	difficulty = e.target.elements.difficulty.value;
	sendData(username, difficulty);
	e.target.elements.username.value = '';
	document.getElementById('username').blur();
	document.getElementById('username').setAttribute('disabled', 'disabled');
	document.getElementById('startBtn').setAttribute('disabled', 'disabled');
	startGame();	
})

let records = [];
// get the data
const getData = async ()=>{
	const response = await fetch('db.php');
	if(response.status === 200){
		const data = await response.json();
		return data;
	} else {
		throw new Error('Suprise, somthing went wrong');
	}
};


const renderData = (array)=>{
	document.getElementById('target').innerHTML = '<h1><u>ScoreBoard</u></h1>';
	array.forEach((line)=>{
		document.getElementById('target').innerHTML += `
		<p>${line.name}: ${line.score}</p>` 
	})
}


getData().then((record)=>{
	records = Object.values(record);
	renderData(records);
	return record;
}).catch((error)=>{
	console.log(`Error: ${error}`)
});
