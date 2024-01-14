<?php
echo "++++++++++++++++++++++++\n";
// $stdin = fopen('php://stdin', 'r');

// while ($line = fgets($stdin))
// {
//     echo $line;
// }
fclose($stdin);
foreach ($_ENV as $variable => $value)
{
    echo $variable . ': ' . $value;
    echo "\n";
}
// $i = 0;
// while ($i < 1000)
// {
//     $j = 0;
//     while ($j < 10000)
//     {
//         echo $i . "-" . $j;
//         echo "\n";
//         $j++;
//     }
//     $i++;
// }
echo "++++++++++++++++++++++++\n";
?>