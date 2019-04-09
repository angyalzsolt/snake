<?php 
$host = 'localhost';
$db   = 'snake';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES => false,
];
try {
	$pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
	throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// GET DATA
if(!isset($_POST['username'])){
	$stmt = $pdo->query('SELECT * FROM scoreboard ORDER BY `score` DESC LIMIT 4');
	// $result = $stmt->fetch();
	$data = array();
	while ($row = $stmt->fetch()){
	    $data[$row['id']]['name'] = $row['username'];
	    $data[$row['id']]['score'] = $row['score'];
	    $data[$row['id']]['diff'] = $row['difficulty'];
	};
	usort($data,function ($a, $b){return ($a['score'] < $b['score']) ? 1 : -1;});
	// var_dump($data);
	$x = json_encode($data);
	echo $x;
}



// INSERT DATA 
if(isset($_POST['username']) && isset($_POST['difficulty'])){
	// $stmt = $pdo->prepare('SELECT `username` FROM `scoreboard` WHERE `username` = ?');
	// $stmt->execute([$_POST['username']]);
	// $name = $stmt->fetchColumn();
	// if(strlen($name) > 0){
	// 	echo 'Chose antoher username';
	// 	exit;
	// } else {
		$stmt = $pdo->prepare('INSERT INTO scoreboard(username, score, difficulty) VALUES (?, ?, ?)');
		if(!$stmt->execute([$_POST['username'], 0, $_POST['difficulty']])){
			echo 'something went wrong';
		}
	
};

// UPDATE SCORE
if(isset($_POST['score']) && isset($_POST['username'])){
	$score = $_POST['score'];
	$username = $_POST['username'];
	$sql = "UPDATE scoreboard SET score = ? WHERE username = ?";
	$stmt = $pdo->prepare($sql);
	if($stmt->execute([$score, $username])){
		echo 'score added';
	}
}




 ?>