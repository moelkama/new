<?php
$stdin = fopen('php://stdin', 'r');

while ($line = fgets($stdin))
{
    echo $line;
}
fclose($stdin);
echo "doooooooooon\n";
?>
