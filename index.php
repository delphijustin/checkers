<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Online Checkers</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <h1>Online Checkers</h1>
  <div class="turn" id="turn-indicator">Player 1's Turn (Red)</div>
  
  <div class="board" id="board"></div>

  <div class="buttons">
    <button id="reset">Reset Game</button>
  </div>
  <script src="script.js"></script>
<script>playerId=<?php echo $_GET['player']+1;?>;</script>
</body>
</html>
