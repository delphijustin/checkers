<?php
$boardfile = 'board.txt';
$turnfile = 'turn.txt';

// Reset the game
if (isset($_POST['reset'])) {
    $defaultBoard = 
        "02020202" .  // row 0
        "20202020" .  // row 1
        "02020202" .  // row 2
        "00000000" .  // row 3
        "00000000" .  // row 4
        "10101010" .  // row 5
        "01010101" .  // row 6
        "10101010";   // row 7
    file_put_contents($boardfile, $defaultBoard);
    file_put_contents($turnfile, "1");
    echo "OK";
    exit;
}

// Save board move
if (isset($_POST['board']) && isset($_POST['turn'])) {
    $board = preg_replace('/\s/', '', $_POST['board']); // remove whitespace
    file_put_contents($boardfile, $board);
    file_put_contents($turnfile, $_POST['turn']);
    echo "OK";
    exit;
}

echo "ERROR";
?>
