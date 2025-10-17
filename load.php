<?php
$boardfile = 'board.txt';
$turnfile = 'turn.txt';

// If files don't exist, create default
if (!file_exists($boardfile) || !file_exists($turnfile)) {
    $defaultBoard = 
        "02020202" .
        "20202020" .
        "02020202" .
        "00000000" .
        "00000000" .
        "10101010" .
        "01010101" .
        "10101010";
    file_put_contents($boardfile, $defaultBoard);
    file_put_contents($turnfile, "1");
}

// Read board and turn
$board = trim(file_get_contents($boardfile));  // 64-character string
$turn = trim(file_get_contents($turnfile)); // 1 or 2

echo $board . "\n" . $turn;
?>
