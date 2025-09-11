<!DOCTYPE html>
<html>
<head>
<?php 
$squareSize = 50;
$squaresPerRow = 8;
$pieceSizePercentage = .6;
$borderSize = 0;
$hexAtPieceCreation;
$playingBlack = false; //always set to false: needs a change
?>
<style>
   
   body{
        background-color: lightblue;

   }
    


    
    .white{

    }
    
    .black{
        filter: grayscale(100%);
    }
    
    .square{
        /* border-color: green; */
        border-style: solid;
        border-width: 0px;
        color: green;
        height: <?php echo $squareSize;?>px;
        width: <?php echo $squareSize;?>px;
        z-index: -1;
        position: relative;
        
        
    }
    
    .board{
        display: grid;
        /* grid-template-columns: auto auto auto auto auto auto auto auto; */
        grid-template-columns: repeat(<?=$squaresPerRow?>,0fr);
        /* gap: 0px; */
        position: absolute;
        border-color: green;
        border-style: solid;
        border-width: 1px;
        
    }

    .piece{
        position: absolute;
        width: <?php echo $squareSize*$pieceSizePercentage?>px;
        height: <?php echo $squareSize*$pieceSizePercentage?>px;
        background-repeat: no-repeat;
        background-size: 

        
    }

    .pawn{
        background-image: url("pawn.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;

    }

    .bishop{
        background-image: url("bishop.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;

    }

    .knight{
        background-image: url("knight.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;

    }

    .rook{
        background-image: url("rook.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;

    }

    .queen{
        background-image: url("queen.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;

    }

    .king{
        background-image: url("king.png");
        background-size: <?=$squareSize * $pieceSizePercentage?>px <?=$squareSize * $pieceSizePercentage?>px;
        

    }

    button{
        height: 20px;
        width: 100px;
    }
   


</style>

</head>
    <body>
        <button type="button" onclick="flipBoard()" id="button" >Flip board</button>
        
        
        
        <div class = "board">
        <?php
        $count = 0;
        for($j = 0; $j < $squaresPerRow; $j++){
            if($j%2==0){
                $color = "white";
            }else{
                $color = "brown";
            }
            for($i = 0; $i < $squaresPerRow; $i++){
                ?><div class = "square" id = <?=$count?> style="position: relative; top: -<?php echo ($i * $squareSize);?>; background-color: <?php echo($color);?>"> <?=$count++?>
            </div>
                
                
                <?php
                
                if($color==="white"){
                    $color="brown";
                    // echo "<script> console.log(here);</script>";
                    // error_log($color);
                }else{
                    $color = "white";
                    // error_log($color);
                }
            // echo "<script> console.log($r);</script>";
            // echo "<script> console.log($r);</script>";
            }

        }
        
        
        
        $boardInfo = [[1,3,0], [1,2,1], [1,1,2], [1,4,3], [1,5,4], [1,1,5], [1,2,6], [1,3,7],
                    [1,0,8], [1,0,9], [1,0,10], [1,0,11], [1,0,12], [1,0,13], [1,0,14], [1,0,15],
                    [0,0,48],[0,0,49],[0,0,50],[0,0,51],[0,0,52],[0,0,53],[0,0,54],[0,0,55],
                    [0,3,56], [0,2,57], [0,1,58], [0,4,59], [0,5,60], [0,1,61], [0,2,62], [0,3,63]];
                    //White/black 0=white, piece_type pawn=0 bishop=1 knight=2 rook=3 queen=4 king=5, square index

        ?>
        <script>
        var phpBoard = <?php echo json_encode($boardInfo); ?>; 
        var phpSquaresPerRow = <?php echo json_encode($squaresPerRow); ?>;
        var phpPlayingBlack = <?php echo json_encode($playingBlack); ?>
        </script>

        <?php
        
       
        for ($i = 0; $i < count($boardInfo); $i++){
            $j = $boardInfo[$i][2];
            

            echo "<div class = \"piece ";
            echo($boardInfo[$i][0] == 0) ? ("white"):("black");
            echo " ";
            switch ($boardInfo[$i][1]){
                case 0: 
                    echo "pawn"; 
                    break; 
                case 1: 
                    echo "bishop"; 
                    break; 
                case 2: 
                    echo "knight";
                    break; 
                case 3: 
                    echo "rook";
                    break; 
                case 4: 
                    echo "queen";
                    break; 
                case 5: 
                    echo "king";
                    break;
                }
            echo "\" id = ";
            echo $i;
            echo " style = \"top: ";
            // error_log("56 " . intdiv(56, 8));
            if(!$playingBlack){
            echo ((intdiv($boardInfo[$i][2], $squaresPerRow) * $squareSize) + ($squareSize * (1 - $pieceSizePercentage)/2));
            echo "px; ";
            echo "left: ";
            echo ((($boardInfo[$i][2] % $squaresPerRow) * $squareSize) + ($squareSize * (1 - $pieceSizePercentage)/2));
            }
            else{
            echo ((-(intdiv($boardInfo[$i][2], $squaresPerRow)) * $squareSize) + ($squareSize * 7) + ($squareSize * (1 - $pieceSizePercentage)/2));
            echo "px; ";
            echo "left: ";
            echo (((7 - ($boardInfo[$i][2] % $squaresPerRow)) * $squareSize) + ($squareSize * (1 - $pieceSizePercentage)/2));
            }
            echo "px;\"></div>";

            // echo "<div class = \"piece " . (($boardInfo[$i][0] == 0) ? ("white"):("black")) . "\" id = " . (string)$i . "></div>";
            // error_log($boardInfo[$i][0] == 0);
        }
        // error_log('now');
        ?>

    </div>

    <?php
    
    ?>
        <!-- <div
        class = "piece white" id = "0"></div>
        <div
        class = "piece black" id = "1"></div>
        <div
        class = "piece white" id = "2"></div>
        </div> -->

        

                <!-- <div
                class = "card" id = "1"></div> -->
    

        
            
        

        
            
        
         
        

        <script src="firstJS.js"></script>
        



    </body>


</html>
