var myGameArea = {
	    canvas : document.createElement("canvas"),
	    start : function() {
	        if (!this.canvas.getContext) {
	        	document.getElementById('id').innerHTML = "Oh dear, your system can't run the game";
	            return;
	        }
	        this.canvas.width = 620;
	        this.canvas.height = 340;
	        this.context = this.canvas.getContext("2d");
	    	this.canvas.setAttribute("id", "cvid");
//	        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	        document.getElementById("myDiv").appendChild(this.canvas);
	        this.canvas.addEventListener("mousedown", myMouseDown, false);
	        this.interval = setInterval(updateGameArea, 200);
	    },
	    clear : function() {
	        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    }
}

function startGame() {
    gamesDone = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    lastCol = 0;
    lastRow = 0;
    BOXCOLS = 8;
    BOXROWS = 6;
    NUMOFGAMES = 20;
    gameNo = 0;
    gameOver = false;
    dotCol = 0;				//ROWS & COLS WRONG WAY AROUND
    dotRow = 0;
    dotPosition = 0;
    dotDirection = 0;
    dotNoSquares = 0;
    dotSquaresWalked = 0;
    dotStage = 0;
    dotSubStage = 0;
    dotDelay = 0;
    dotEscaping = false;
    cyanBox = false;
    cyanDelay = 0;
    cyanRow = 0;
    cyanCol = 0;
    aasText = 0;
    soundOn = true;
    
    reStartDTP();
	
    dotCnt = 1;
    dot = new dot();
    nelson = new nelson();
    
//    document.getElementsByTagName('audio')[0].play();
//    document.getElementsByTagName('audio')[0].pause();
    
//    var snd = new Audio("sounds/dtpStart.mp3");
//    snd.volume = 0.5;
//    snd.play();
    
	document.getElementById('dtpStart').play();

    myGameArea.start();
}

function soundOnA(){
	//Note: Sound on iPhone has to be switched on by the user
	soundOn=true;
	document.getElementById('dtpStart').play();
	document.getElementById('dtpCongrats').play();
	document.getElementById('dtpCongrats').pause();
	document.getElementById('dtpEscape').play();
	document.getElementById('dtpEscape').pause();
	document.getElementById('dtpTopOfNelson').play();
	document.getElementById('dtpTopOfNelson').pause();
}

function soundOff(){
	soundOn=false;
	document.getElementById('dtpStart').pause();
	document.getElementById('dtpCongrats').pause();
	document.getElementById('dtpEscape').pause();
	document.getElementById('dtpTopOfNelson').pause();
}

//function toggleSound(){
//	//Note: Sound on iPhone has to be switched on by the user
//	if (soundOn){
//		soundOn=false;
//		document.getElementById("sndButML").value = 'Sound ON';
//		document.getElementById("sndButXS").value = 'Sound ON';
//		document.getElementById('dtpStart').pause();
//		document.getElementById('dtpCongrats').pause();
//		document.getElementById('dtpEscape').pause();
//		document.getElementById('dtpTopOfNelson').pause();
//	} else {
//		soundOn=true;
//		document.getElementById("sndButML").value = 'Sound OFF';
//		document.getElementById("sndButXS").value = 'Sound OFF';
//		document.getElementById('dtpStart').play();
//		document.getElementById('dtpCongrats').play();
//		document.getElementById('dtpCongrats').pause();
//		document.getElementById('dtpEscape').play();
//		document.getElementById('dtpEscape').pause();
//		document.getElementById('dtpTopOfNelson').play();
//		document.getElementById('dtpTopOfNelson').pause();
//	}
//};

function reStartDTP() {
	currArray = loadCurrArray(gameNo);
	
	arrayOfInt1 = loadArrayOfInt1();
    cyanBox = false;
    for (i = 0; i < 6; i++) 
    {
      for (j = 0; j < 8; j++)
      {
        if (currArray[i][j] == 15)
        {
          cyanBox = true;
          cyanRow = i;
          cyanCol = j;
        }
      }
    }

    dotDirection = arrayOfInt1[gameNo][0];
    dotRow = arrayOfInt1[gameNo][1];
    dotCol = arrayOfInt1[gameNo][2];
    dotNoSquares = arrayOfInt1[gameNo][3];
    dotSquaresWalked = dotNoSquares;
    dotStage = 0;
    dotEscaping = false;
    if (dotDirection == 0) 
    {
    	dotPosition = 1;
    } 
    else 
    {
        dotPosition = 5;
    }	
}

function updateGameArea() {
    myGameArea.clear();
    
    ctx = myGameArea.context;

    dot.update();
    
    if (cyanBox) 
    {
    	if (++cyanDelay == 2)
    	{
    		cyanDelay = 0;
    		if (!cyanBoxMoved())
    		{
    			cyanBox = false;
    			currArray[cyanRow][cyanCol] = 0;
    			currArray[cyanRow][(cyanCol + 1)] = 0;
    			currArray[(cyanRow + 1)][cyanCol] = 0;
    			currArray[(cyanRow + 1)][(cyanCol + 1)] = 0;
    		}
    	}
    }
    
    if (dotStage < 3) {
        //jail squares
        for (i = 0; i < 6; i++)					//row
        {
          k = i * 30;
          for (m = 0; m < 8; m++) 				//col
          {
            if (currArray[i][m] >= 0)
            {
              n = m * 30;
              
              cageChar(n,k,currArray[i][m]);
            }
          }
        }
        
        if (gamesDone[gameNo] == 1)
        {
        	ctx.font = 'bold 10px Arial';
            ctx.fillStyle = 'blue';
            ctx.fillText('Solved', 100, 195);
        }
    }
    
    if ((dotStage > 2) && (gameOver)) 
    {
    	dotEscaping = true;
    }
        
    nelson.update();
    
    if (gameNo < 19)
    {
      str = "Next";
      if (gameNo === 0) 
      {
        str = "Next Puzzle";
      }
      
      ctx.font = 'italic 20px Arial';
      
      ctx.fillStyle = 'red';
      ctx.fillText(str, 10, 230);
    }
    
    j = gameNo + 1;
    
    var txt = 'Restart : ' + j;
    
    ctx.font = 'italic 40px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillRect(8, 238, 220, 36);
    
    ctx.fillStyle = 'yellow';
    ctx.fillText(txt, 10, 270);

    if (gameNo > 0)
    {
        ctx.font = 'italic 20px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText("Previous", 10, 295);
    }
    
    if (dotStage === 5)
    {
        ctx.font = 'normal 30px Arial';
        ctx.fillStyle = 'lightGray';
        ctx.fillText("www.", 45, 75);
        ctx.fillText(".co.uk", 265, 150);
        ctx.font = 'italic 40px Arial';
        ctx.fillText("AASVOGUELLE", 35, 120);
    }

    if ((dotStage > 2) && (gameOver))
    {
        ctx.fillStyle = randomColor();
        ctx.font = 'normal 75px Arial';
        ctx.fillText("WELL DONE", 75, 140);
       
        ctx.fillStyle = randomColor();
        ctx.font = 'normal 75px Arial';
        ctx.fillText("GAME OVER", 75, 240);
    }
}

function loadArrayOfInt1(){

	int1Dets = [ 0, 120,  90, 2, 
	             0, 120, 120, 1, 
	             0, 120, 120, 2, 
	             0, 150,  90, 4, 
	             0, 180, 120, 5, 
	             0, 180, 120, 6, 
	             0, 150,  90, 4, 
	             0, 180, 120, 6, 
	             0,  30, 120, 1, 
	             0, 150, 120, 3, 
	             0, 120, 120, 2, 
	             0, 120, 120, 2, 
	             0, 180, 120, 6, 
	             0, 180, 120, 6, 
	             0, 180, 120, 6, 
	             0,  30, 120, 1, 
	             0, 180, 120, 6, 
	             0, 120, 120, 2, 
	             0, 180, 120, 6, 
	             0, 180, 120, 5 ];

	x=0;
	var arrOfInt1 = new Array();
	for (i=0;i<20;i++) {
		arrOfInt1[i]=new Array();
		for (j=0;j<4;j++) {
			arrOfInt1[i][j]=int1Dets[x++];
		}
	}

	return arrOfInt1;

}

function loadCurrArray(gameNo){
	switch (gameNo+1){
	case 1:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1,  1, 10, 10,  2, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1, -1, -1, -1, -1, -1, -1 ];
		break;
	case 2:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
		             10, 10, 10, 10, 10, -1, -1, -1, 
		             10,  7, 10, 10, 10, 10, -1, -1, 
		             10, 10, 10, 10,  2, 10, -1, -1, 
		             -1, -1, 10, 10, 10, 10, -1, -1, 
		             -1, -1, -1, 10, 10,  1, -1, -1];
		break;
	case 3:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
		             -1, -1, -1, -1, 10, 10, 10, -1, 
		             -1, 10, 10, 10, 10, 10, 10, -1, 
		             -1, 10, 10, 10,  1, 10, 10, -1, 
		             -1, 10, 10, 10, 10,  1, -1, -1, 
		             -1, -1,  2, 10, 10, 10, -1, -1];
		break;
	case 4:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
		             -1, 10, 10, 10, 10, 10,  2, -1, 
		             -1, 10, 10, 10, 10, 11, 10, -1, 
		             -1, 10,  1, 10,  5,  6, 10, -1, 
		             -1, 10, 10, 10, 10, 10, 10, -1, 
		             -1, -1, -1, -1, -1, -1, -1, -1];
		break;
	case 5:
		gameDets = [ 10, 10, 10, 10, 10, 10, 10,  8, 
		             10, 10,  2, 10, 10,  7, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 12, 10,  1, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10,  6, 10, 
		             -1, 10, 10, 10, 10, 10, 10, 10];
		break;
	case 6:
		gameDets = [  1, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10,  5,  6, 10, 10, 10, 10, 
		             10, 10, 10, 10,  7,  8, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10, 
		              2, 10, 10, 10, 10, 10, 10, 10];
		break;
	case 7:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
		             -1, 10, 10, 15, 19, 10,  2, -1, 
		              1, 10, 10, 20, 21, 10, 10, -1, 
		             10, 10, 10, 10, 10, 10, 10, -1, 
		             -1, 10, 10, 10, 10, 10, 10, -1, 
		             -1, -1, -1, -1, -1, -1, -1, -1]; 
		break;
	case 8:
		gameDets = [ 10, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10,  7, 10, 
		             10, 10, 10, 10, 10, 13, 12, 10, 
		             10, 10,  8,  1, 10, 11, 10, 10, 
		             10,  2, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10];
		break;
	case 9:
		gameDets = [ 10, 10, 10, 15, 20, 10, 10, -1, 
		             10,  1, 10, 19, 21, 10, 10, -1, 
		             10, 10, 11, 10, 10, 10,  7, -1, 
		             10, 10, 10,  6, 10, 10, 11, 10, 
		              2, 10, 10, -1, 10, 10, 10, 10, 
		             10, 10, 10, -1, 10, 10, 10, 10];
		break;
	case 10:
		gameDets = [ -1, 10, 10, 10, 10, 10, -1, -1, 
		             -1, 10,  2, 10,  5, 10, 10, -1, 
		             -1, 10, 10, 10, 10, 10, 10, -1, 
		             -1, 10, 10, 11,  6, 10, 10, -1, 
		             -1, 10, 10,  5, 10,  1, 10, -1, 
		             -1, -1, 10, 10, 10, 10, 10, -1];
		break;
	case 11:
		gameDets = [ 15, 19, 10, 10, 10, 10, 10,  1, 
		             20, 21, 10, 10, 10, 10, 10, 10, 
		             10, 10, 11, 12, 11, 10, 10, 10, 
		             10,  2,  7,  7, 10, 10, 10, 10, 
		             -1, -1, 10, 10, 10, 10, -1, -1, 
		             -1, -1, 10, 10, 10, 10, -1, -1];
		break;
	case 12:
		gameDets = [ -1, -1, 10, 10, 10, 10, -1, -1, 
		             -1, 10,  1, 10, 10, 10, 10, -1, 
		             10, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10,  2, 10, 10, 10, 
		             -1, 10, 10, 10, 10, 10,  1, -1, 
		             -1, -1, 10, 10, 10, 10, -1, -1];
		break;
	case 13:
		gameDets = [ 10, 10, 10, 11, 11, 10, 10, 10, 
		             10, 10, 10,  7, 10, 10, 10, 10, 
		             10, 10,  6, 11, 11,  8, 10, 10, 
		             10, 10,  6, 13, 13,  8, 10, 10, 
		              2, 10, 10,  5,  5, 10, 10, 10, 
		             1, 10, 10, 10, 10, 10, 10, 10];
		break;
	case 14:
		gameDets = [ 10,  6, 10,  7, 15, 19, 10, 10, 
		             10, 10, 10,  7, 20, 21, 10, 10, 
		             10, 10, 10, 10, 10, 11, 11,  2, 
		              5, 10, 10, 11, 10, 11, 11,  1, 
		             10, 10, 10, 11, 10, 10, 10, 10, 
		             10, 10,  8, 10, 10, 10, 10, 10];
		break;
	case 15:
		gameDets = [  2, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10,  6, 10, 10,  5, 
		              6, 10, 10,  7, 10, 10, 10, 10, 
		             10, 10, 10, 10,  1, 10, 10, 10, 
		             10, 10,  5, 10, 10, 10, 10,  5, 
		             10, 10, 10,  8,  6, 10, 10, 10];
		break;
	case 16:
		gameDets = [ -1, 10, 10, -1, -1,  1, 10, 10, 
		             10,  1, 10, 15, 19, 10, 10, 10, 
		              5, 10, 10, 20, 21, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10,  7, 
		             10, 10, 10, -1, 10, 10,  1, 10, 
		              2, 10, 10, -1, -1, 10, 10, -1];
		break;
	case 17:
		gameDets = [ 15, 20, 10,  2, 10, 10,  1, 10, 
		             19, 21,  7, 10, 10, 10, 10, 10, 
		             10, 10, 11,  5,  6, 10, 10, 10, 
		             10, 10, 11,  8, 10,  7, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10, 
		             10, 10, 10, 10, 10, 10, 10, 10];
		break;
	case 18:
		gameDets = [ -1, -1, 10, 10, 10, 10, 10, -1, 
		             -1, 10, 10, 10,  8,  8, 10, -1, 
		             -1, 10,  1, 11, 10,  8, 10, -1, 
		             -1, 10, 10, 11,  6,  6, 10, -1, 
		             -1,  6, 10, 10, 10, 10,  2, -1, 
		             -1, -1, 10, 10, 10, 10, -1, -1];
		break;
	case 19:
		gameDets = [ 15, 20, 10, 10, 10,  8, 12, 11, 
		             19, 21, 10, 10, 10, 10, 11, 11, 
		             11, 11, 11, 10, 10, 11, 10, 11, 
		              5,  5,  5, 10, 10,  7, 10, 11, 
		              2, 10, 10, 10, 10, 10, 10, 11, 
		              1, 11, 12, 11, 11, 11, 11, 11];
		break;
	case 20:
		gameDets = [ 10, 10, 10, 10,  8, 10,  8, 10, 
		              7, 10, 10, 15, 20, 10,  2, 10, 
		             10, 10,  8, 19, 21, 10, 10, 10, 
		             11, 11, 12, 10, 10, 10, 10, 10, 
		             10,  1, 11,  8,  7, 10, 10,  5, 
		             -1, 10, 10, 10, 10, 10, 10,  1];
		break;	
	default:
		gameDets = [ -1, -1, -1, -1, -1, -1, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1,  1, 10, 10,  2, -1, -1, 
                     -1, -1, 10, 10, 10, 10, -1, -1, 
                     -1, -1, -1, -1, -1, -1, -1, -1 ];
	}
	
	x=0;
	var currArray = new Array();
	for (i=0;i<6;i++) {
		 currArray[i]=new Array();
		 for (j=0;j<8;j++) {
		  currArray[i][j]=gameDets[x++];
		 }
	}

	return currArray;
}

function cageChar(x, y, charZ) {
	ctx.beginPath();
	ctx.moveTo(x+0, y+0);
	ctx.lineTo(x+0, y+30);
	ctx.lineTo(x+30, y+30);
	ctx.lineTo(x+30, y+0);  
	
	if (charZ == 0){
		ctx.fillStyle = 'magenta';
		ctx.fill();
	}
	
	if ((charZ >= 15) && (charZ <= 22)){
		ctx.fillStyle = 'cyan';
		ctx.fill();
	}
	
	ctx.closePath();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
    if (charZ > 29)
    {
    	ctx.fillStyle = 'magenta';
    	ctx.beginPath();
    	ctx.moveTo(x+1, y+1);
    	ctx.lineTo(x+1, y+29);
    	ctx.lineTo(x+29, y+29);
    	ctx.lineTo(x+29, y+1);    	
    	ctx.closePath();
    	ctx.fill();
    	ctx.fillStyle = 'yellow';
    	ctx.stroke();
      
    	charZ -= 30;
    }
    
    switch (charZ) 
    {
    	case -1: break;
    	case 0:  break;
    	case 1:  drawKey(x,y);
               	 break;
    	case 2:  drawLock(x,y);
               	 break;
    	case 5:  drawArrowUp(x,y);
               	 break;
    	case 6:  drawArrowRight(x,y);
               	 break;
    	case 7:  drawArrowDown(x,y);
               	 break;
    	case 8:  drawArrowLeft(x,y);
               	 break;
    	case 10: break;
    	case 11: drawOne(x,y);
               	 break;
    	case 12: drawTwo(x,y);
               	 break;
    	case 13: drawThree(x,y);
               	 break;
    	case 15: 
    	case 16: 
    	case 17: 
    	case 18: drawCyanTL(x,y);
               	 break;  
    	case 19: drawCyanTR(x,y);
               	 break;
    	case 20:  drawCyanBL(x,y);
               	 break;
    	case 21:  drawCyanBR(x,y);
               	 break;
    } 
}

function myMouseDown(event) {
	//this does NOT work with Firefox
	var i = event.x;
	var j = event.y;
	
	var canvas = document.getElementById("cvid");

	i -= canvas.offsetLeft;
	j -= canvas.offsetTop;
	
	if ((i >= 10) && (i <= 240) && (j >= 240) && (j <= 270))
	{
	  gamesDone[gameNo] = 0;
	  reStartDTP();
	}
	else 
	    if ((i >= 0) && (i <= 240) && (j >= 0) && (j <= 180))
	    {
	    	cageClicked(i, j);
	    }
	    else 
	        if ((i >= 10) && (i <= 120) && (j >= 214) && (j <= 230))         //NEXT
	        {
	            if (++gameNo == 20) 
	            {
	                gameNo -= 1;
	            } 
	            else 
	            {
	                reStartDTP();
	            }
	        }
	        else 
	            if ((i >= 10) && (i <= 90) && (j >= 280) && (j <= 295))        //PREVIOUS
	            {
	                if (--gameNo < 0) 
	                {
	                    gameNo += 1;
	                } 
	                else 
	                {
	                    reStartDTP();
	                }
	            }
	      //else...
	  //else...
	//else... 
}

function cageClicked(paramInt1, paramInt2)
{
	i = Math.floor(paramInt1 / 30);
	j = Math.floor(paramInt2 / 30);

//	alert("i:" + i + " j:" + j);
	
	if (dotStage == 0)
	{
		if (currArray[j][i] == 1)
		{
			currArray[j][i] = 30;
			lastRow = j;
			lastCol = i;
			dotStage += 1;
		}
	}
	else 
		if (dotStage == 1) 
		{
			switch (currArray[j][i])
			{
				case -1: 
					break;

				case 0: 
					break;

				case 1: 
					currArray[j][i] = 30;
					lastRow = j; lastCol = i;
					break;

				case 2: 
					if (adj_yel_box(j, i))
					{
						if (unlock_ok())
						{
							dotStage += 1;
							dotSubStage = 10;
							dotEscaping = true;
          
							gamesDone[gameNo] = 1;
          
							gameOver = true;
							for (k = 0; k < 20; k++) 
							{
								if (gamesDone[k] == 0)
								{
									gameOver = false;
									break;
								}
							}
							if (gameOver){
//							    var snd = new Audio("sounds/dtpCongrats.mp3");
//							    snd.volume = 0.5;
//							    snd.play();
								if (soundOn){
									document.getElementById('dtpCongrats').play();
								}						
							} else {
//							    var snd = new Audio("sounds/dtpEscape.mp3");
//							    snd.volume = 0.5;
//							    snd.play();
								if (soundOn){
									document.getElementById('dtpEscape').play();
								}
							}
						}
					}
					currArray[lastRow][lastCol] = 30;
					break;

				case 5: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 35;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 6: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 36;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 7: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 37;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 8: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 38;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 10: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 30;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 11: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 40;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 12: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 41;
						lastRow = j;
						lastCol = i;
					}
					break;

				case 13: 
					if (adj_yel_box(j, i))
					{
						currArray[j][i] = 42;
						lastRow = j;
						lastCol = i;
					}
					break;

					//case...
			}
		}
  //else...
}

function unlock_ok()
{
	bool = true;
	for (i = 0; i < 6; i++)
	{
		for (j = 0; j < 8; j++) 
		{
			if ((currArray[i][j] == 1) || ((currArray[i][j] > 4) && (currArray[i][j] < 30)) || (currArray[i][j] > 40))
			{
				bool = false;      
				break;
			}
		}
		if (!bool) 
		{
			break;
		}
	}
	return bool;
}

function adj_yel_box(paramInt1, paramInt2)
{
  bool = true;
  
  paramInt2--;
  if ((paramInt2 < 0) || (paramInt1 != lastRow) || (paramInt2 != lastCol) || (currArray[paramInt1][paramInt2] == 5) || 
      (currArray[paramInt1][paramInt2] == 35) || (currArray[paramInt1][paramInt2] == 7) || (currArray[paramInt1][paramInt2] == 37) || 
      (currArray[paramInt1][paramInt2] == 8) || (currArray[paramInt1][paramInt2] == 38))
  {
    paramInt2++;
    
    paramInt1--;
    if ((paramInt1 < 0) || (paramInt1 != lastRow) || (paramInt2 != lastCol) || (currArray[paramInt1][paramInt2] == 5) || 
        (currArray[paramInt1][paramInt2] == 35) || (currArray[paramInt1][paramInt2] == 6) || (currArray[paramInt1][paramInt2] == 36) || 
        (currArray[paramInt1][paramInt2] == 8) || (currArray[paramInt1][paramInt2] == 38))
    {
      paramInt1++;
      
      paramInt2++;
      if ((paramInt2 > 7) || (paramInt1 != lastRow) || (paramInt2 != lastCol) || (currArray[paramInt1][paramInt2] == 5) || 
          (currArray[paramInt1][paramInt2] == 35) || (currArray[paramInt1][paramInt2] == 6) || (currArray[paramInt1][paramInt2] == 36) || 
          (currArray[paramInt1][paramInt2] == 7) || (currArray[paramInt1][paramInt2] == 37))
      {
        paramInt2--;
        
        paramInt1++;
        if ((paramInt1 > 5) || (paramInt1 != lastRow) || (paramInt2 != lastCol) || (currArray[paramInt1][paramInt2] == 6) || 
            (currArray[paramInt1][paramInt2] == 36) || (currArray[paramInt1][paramInt2] == 7) || (currArray[paramInt1][paramInt2] == 37) || 
            (currArray[paramInt1][paramInt2] == 8) || (currArray[paramInt1][paramInt2] == 38))
        {
          paramInt1--;
          
          paramInt2--;
          if ((paramInt2 < 0) || (currArray[paramInt1][paramInt2] <= 29) || (currArray[paramInt1][paramInt2] == 35) || 
              (currArray[paramInt1][paramInt2] == 37) || (currArray[paramInt1][paramInt2] == 38))
          {
            paramInt2++;
            
            paramInt1--;
            if ((paramInt1 < 0) || (currArray[paramInt1][paramInt2] <= 29) || (currArray[paramInt1][paramInt2] == 35) || 
                (currArray[paramInt1][paramInt2] == 36) || (currArray[paramInt1][paramInt2] == 38))
            {
              paramInt1++;
              
              paramInt2++;
              if ((paramInt2 > 7) || (currArray[paramInt1][paramInt2] <= 29) || (currArray[paramInt1][paramInt2] == 35) || 
                  (currArray[paramInt1][paramInt2] == 36) || (currArray[paramInt1][paramInt2] == 37))
              {
                paramInt2--;
                
                paramInt1++;
                if ((paramInt1 > 5) || (currArray[paramInt1][paramInt2] <= 29) || (currArray[paramInt1][paramInt2] == 36) || 
                    (currArray[paramInt1][paramInt2] == 37) || (currArray[paramInt1][paramInt2] == 38)) 
                {
                  bool = false;
                }
              }
            }
          }
        }
      }
    }
  }

  if (bool) 
  {
    if (currArray[paramInt1][paramInt2] < 40) 
    {
      currArray[paramInt1][paramInt2] = 0;
    } 
    else 
    {
      currArray[paramInt1][paramInt2] -= 30;
    }
  }
  return bool;
}

function nelson() {
    this.startX = 400;
    this.startY = 20;
        
    this.update = function() {    	
    	drawNel(this.startX, this.startY, false);
    }
}

function key() {
    this.startX = 580;
    this.startY = 300;
        
    this.update = function() {    	
    	drawKey(this.startX, this.startY);
    }
}

function dot() {        
    this.update = function() {
    	dotsMovement();
    	
        switch (dotPosition) {
        case 1:	drawLeft1(dotRow, dotCol);break;
        case 2: drawLeft2(dotRow, dotCol);break;
        case 3: drawLeft3(dotRow, dotCol);break;
        case 4: drawLeft4(dotRow, dotCol);break;
        case 5: drawRight1(dotRow, dotCol);break;
        case 6: drawRight2(dotRow, dotCol);break;
        case 7: drawRight3(dotRow, dotCol);break;
        case 8: drawRight4(dotRow, dotCol);break;
        case 9: drawSatLeft(dotRow, dotCol);
          		drawSatDown(dotRow, dotCol);break;
        case 10:drawSatRight(dotRow, dotCol);
          		drawSatDown(dotRow, dotCol);break;
        case 11:drawFlyingBody(dotRow, dotCol);
          		drawFlyingUp(dotRow, dotCol);break;
        case 12:drawFlyingBody(dotRow, dotCol);
          		drawFlyingDown(dotRow, dotCol);break;
        } 
    }
}

function dotsMovement() {
	var stageDets = [ 100, 150, 130, 180, 160, 210, 190, 210, 210, 180, 240, 150, 270, 120, 300, 90, 330, 60, 360, 30 ];
  
	x=0;
	var arrayOfInt = new Array();
	for (i=0;i<10;i++) {
		arrayOfInt[i]=new Array();
		for (j=0;j<2;j++) {
			arrayOfInt[i][j]=stageDets[x++];
		}
	}
  
	i = 0;
	switch (dotStage)
	{
  		case 0: 
  			if (dotDirection == 0)
  			{
  				if (++dotPosition == 5) 
  				{
  					dotPosition = 1;
  				}
  				if (dotPosition == 4)
  				{
//  					dotCol -= 30;
  					dotRow -= 30;
  					if (--dotSquaresWalked == 0)
  					{
  						dotDirection = 1;
  						dotPosition = 5;
  					}
  				}
  			}
  			else if (++dotPosition == 9)
  				{
//  					dotCol += 30;
  					dotRow += 30;
  					dotPosition = 5;
  					if (++dotSquaresWalked == dotNoSquares)
  					{
  						dotDirection = 0;
  						dotPosition = 1;
  					}
  				}
  			//else...
  			break;

  		case 1: 
  			switch (this.dotDirection)
  			{
  				case 0:   
  					if (++dotPosition == 5) 
  					{
  						dotPosition = 1;
  					}

  					if (dotPosition == 4)
  					{
//  						dotCol -= 30;
  						dotRow -= 30;
  						if (--dotSquaresWalked == 0)
  						{
  							dotDirection = 1;
  							dotPosition = 5;
  						}
  					}
  					break;

  				case 1: 
  					if (++dotPosition == 9)
  					{
//  						dotCol += 30;
  						dotRow += 30
  						dotPosition = 5;

  						if (++dotSquaresWalked == dotNoSquares)
  						{
  							dotDirection = 2;
  							dotPosition = 9;
  						}
  					}
  					break;

  				case 2: 
  					if (++dotDelay == 6)
  					{
  						dotDelay = 0;

  						if (++dotPosition == 11) 
  						{
  							dotPosition = 9;
  						}
  					}
  					break;
  					//case..
  			}
  			break;

  		case 2: 
  			if (--dotSubStage == 0)
  			{
  				dotStage += 1;
  				dotSubStage = -1;
  				dotPosition = 11;
  			}
  			else
  			{
  				i = 0;
  				while (i < 6)
  				{
  					for (j = 0; j < 8; j++) 
  					{
  						this.currArray[i][j] = (1 + Math.floor(Math.random() * 2.0) - 2);
  					}
  					i++;
  					//continue;
  				}
  			}
  			break;

  		case 3:
  			if (++dotSubStage < 10)
  			{
  				if (++dotPosition == 13) 
  				{
  					dotPosition = 11;
  				}
  				dotRow = arrayOfInt[dotSubStage][0];
  				dotCol = arrayOfInt[dotSubStage][1];
  			}
  			else
  			{
  				dotStage += 1;
  				dotDirection = 1;
  				dotPosition = 5;
  				dotCol = 10;
  				dotRow = 410;
  				dotNoSquares = 3;
  				dotSquaresWalked = 0;
  				dotSubStage = 10;
  				aasText = 0;
  						
//			    var snd = new Audio("sounds/dtpTopOfNelson.mp3");
//			    snd.volume = 0.5;
//			    snd.play();
				if (soundOn){
	  				document.getElementById('dtpTopOfNelson').play();
				}
  			}
  			break;

  		default:
  			if (dotStage == 4) 
  			{
  				if (++aasText == 40) 
  				{
  					dotStage = 5;
  				}
  			}

      		if (--dotSubStage == 0)
      		{
      			dotSubStage = 10;
      			dotEscaping = false;
      		}

      		if (dotDirection == 0)
      		{
      			if (++dotPosition == 5) 
      			{
      				dotPosition = 1;
      			}  
  
      			if (dotPosition == 4)
      			{
      				dotRow -= 30;
      				if (--dotSquaresWalked == 0)
      				{
      					dotDirection = 1;
      					dotPosition = 5;
      				}
      			}
      		}  
      		else 
      			if (++dotPosition == 9)
      			{
      				dotRow += 30;
      				dotPosition = 5;
      				if (++dotSquaresWalked == dotNoSquares)
      				{
      					dotDirection = 0;
      					dotPosition = 1;
      			}
      		}
      	//else...
      	break;
    //case...
  	}
}

function drawLeft1(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+18, y+9);
	ctx.lineTo(x+15, y+13);
	ctx.lineTo(x+20, y+22);
	ctx.lineTo(x+20, y+30);
	ctx.lineTo(x+25, y+26);
	ctx.lineTo(x+33, y+26);
	ctx.lineTo(x+41, y+29);
	ctx.lineTo(x+32, y+23);
	ctx.lineTo(x+30, y+13);
	ctx.lineTo(x+26, y+9);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+11, y+16);
	ctx.lineTo(x+17, y+17);
	ctx.lineTo(x+19, y+15);
	ctx.lineTo(x+18, y+13);
	ctx.lineTo(x+14, y+13);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+20, y+30);
	ctx.lineTo(x+19, y+39);
	ctx.lineTo(x+26, y+49);
	ctx.lineTo(x+35, y+53);
	ctx.lineTo(x+46, y+55); 
	ctx.lineTo(x+58, y+53);
	ctx.lineTo(x+58, y+51);
	ctx.lineTo(x+41, y+29);
	ctx.lineTo(x+33, y+26);
	ctx.lineTo(x+25, y+26); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+21,y+14,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+26, y+49);
	ctx.lineTo(x+42, y+42);
	ctx.lineTo(x+45, y+42);
	ctx.lineTo(x+45, y+46);
	ctx.lineTo(x+43, y+54); 
	ctx.lineTo(x+40, y+54);
	ctx.lineTo(x+42, y+46);
	ctx.lineTo(x+42, y+44);
	ctx.lineTo(x+29, y+50);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+49, y+42);
	ctx.lineTo(x+46, y+42);
	ctx.lineTo(x+46, y+45);
	ctx.lineTo(x+56, y+49);
	ctx.lineTo(x+54, y+56); 
	ctx.lineTo(x+47, y+44);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+26, y+57);
	ctx.lineTo(x+33, y+58);
	ctx.lineTo(x+33, y+53);
	ctx.lineTo(x+31, y+53);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+35, y+57);
	ctx.lineTo(x+38, y+57);
	ctx.lineTo(x+37, y+54);
	ctx.lineTo(x+35, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawLeft2(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+16, y+5);
	ctx.lineTo(x+13, y+9);
	ctx.lineTo(x+18, y+18);
	ctx.lineTo(x+12, y+30);
	ctx.lineTo(x+17, y+28);
	ctx.lineTo(x+24, y+28);
	ctx.lineTo(x+35, y+30);
	ctx.lineTo(x+25, y+25);
	ctx.lineTo(x+27, y+11);
	ctx.lineTo(x+23, y+7);  	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+8, y+12);
	ctx.lineTo(x+15, y+13);
	ctx.lineTo(x+17, y+11);
	ctx.lineTo(x+16, y+9);
	ctx.lineTo(x+12, y+9);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+12, y+30);
	ctx.lineTo(x+11, y+39);
	ctx.lineTo(x+18, y+49);
	ctx.lineTo(x+28, y+52);
	ctx.lineTo(x+43, y+53); 
	ctx.lineTo(x+52, y+49);
	ctx.lineTo(x+52, y+47);
	ctx.lineTo(x+45, y+40);
	ctx.lineTo(x+35, y+30);
	ctx.lineTo(x+24, y+28);
	ctx.lineTo(x+17, y+28); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+18,y+10,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+18, y+49);
	ctx.lineTo(x+33, y+41);
	ctx.lineTo(x+37, y+44);
	ctx.lineTo(x+35, y+53);
	ctx.lineTo(x+32, y+53); 
	ctx.lineTo(x+33, y+44);
	ctx.lineTo(x+21, y+51);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+33, y+41);
	ctx.lineTo(x+37, y+45);
	ctx.lineTo(x+47, y+47);
	ctx.lineTo(x+54, y+43);
	ctx.lineTo(x+45, y+40); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+13, y+56);
	ctx.lineTo(x+20, y+57);
	ctx.lineTo(x+20, y+52);
	ctx.lineTo(x+18, y+52);
	ctx.lineTo(x+17, y+55);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+22, y+57);
	ctx.lineTo(x+27, y+57);
	ctx.lineTo(x+26, y+54);
	ctx.lineTo(x+23, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawLeft3(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+8, y+12);
	ctx.lineTo(x+5, y+16);
	ctx.lineTo(x+10, y+25);
	ctx.lineTo(x+5, y+39);
	ctx.lineTo(x+12, y+35);
	ctx.lineTo(x+20, y+35);
	ctx.lineTo(x+28, y+37);
	ctx.lineTo(x+18, y+30);
	ctx.lineTo(x+19, y+18);
	ctx.lineTo(x+15, y+14);  
	ctx.lineTo(x+8, y+12); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+1, y+19);
	ctx.lineTo(x+7, y+20);
	ctx.lineTo(x+9, y+18);
	ctx.lineTo(x+8, y+16);
	ctx.lineTo(x+4, y+16);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+5, y+39);
	ctx.lineTo(x+5, y+47);
	ctx.lineTo(x+13, y+53);
	ctx.lineTo(x+24, y+55);
	ctx.lineTo(x+35, y+54); 
	ctx.lineTo(x+44, y+49);
	ctx.lineTo(x+44, y+47);
	ctx.lineTo(x+28, y+37);
	ctx.lineTo(x+20, y+35);
	ctx.lineTo(x+12, y+35);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+10,y+15,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+13, y+53);
	ctx.lineTo(x+26, y+45);
	ctx.lineTo(x+30, y+47);
	ctx.lineTo(x+27, y+54);
	ctx.lineTo(x+24, y+55); 
	ctx.lineTo(x+26, y+48);
	ctx.lineTo(x+17, y+54);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+26, y+45);
	ctx.lineTo(x+37, y+43);
	ctx.lineTo(x+46, y+44);
	ctx.lineTo(x+38, y+49);
	ctx.lineTo(x+30, y+47); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+10, y+53);
	ctx.lineTo(x+10, y+57);
	ctx.lineTo(x+7, y+58);
	ctx.lineTo(x+7, y+59);
	ctx.lineTo(x+15, y+59);
	ctx.lineTo(x+15, y+58);
	ctx.lineTo(x+13, y+57);
	ctx.lineTo(x+12, y+55);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+19, y+55);
	ctx.lineTo(x+17, y+59);
	ctx.lineTo(x+22, y+59);
	ctx.lineTo(x+21, y+56);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawLeft4(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+27, y+2);
	ctx.lineTo(x+24, y+6);
	ctx.lineTo(x+27, y+17);
	ctx.lineTo(x+27, y+30);
	ctx.lineTo(x+31, y+28);
	ctx.lineTo(x+36, y+29);
	ctx.lineTo(x+44, y+31);
	ctx.lineTo(x+36, y+25);
	ctx.lineTo(x+37, y+12);
	ctx.lineTo(x+34, y+5);  
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+20, y+9);
	ctx.lineTo(x+26, y+10);
	ctx.lineTo(x+28, y+8);
	ctx.lineTo(x+27, y+6);
	ctx.lineTo(x+23, y+6);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+27, y+30);
	ctx.lineTo(x+28, y+40);
	ctx.lineTo(x+35, y+51);
	ctx.lineTo(x+40, y+52);
	ctx.lineTo(x+50, y+54); 
	ctx.lineTo(x+61, y+53);
	ctx.lineTo(x+68, y+50);
	ctx.lineTo(x+68, y+48);
	ctx.lineTo(x+57, y+41);
	ctx.lineTo(x+44, y+31);
	ctx.lineTo(x+36, y+29);
	ctx.lineTo(x+31, y+28);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+29,y+5,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+35, y+51);
	ctx.lineTo(x+47, y+43);
	ctx.lineTo(x+51, y+46);
	ctx.lineTo(x+50, y+54);
	ctx.lineTo(x+46, y+53); 
	ctx.lineTo(x+47, y+46);
	ctx.lineTo(x+40, y+52);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+47, y+43);
	ctx.lineTo(x+57, y+41);
	ctx.lineTo(x+65, y+46);
	ctx.lineTo(x+62, y+49);
	ctx.lineTo(x+51, y+46); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+37, y+53);
	ctx.lineTo(x+36, y+57);
	ctx.lineTo(x+32, y+58);
	ctx.lineTo(x+41, y+58);
	ctx.lineTo(x+39, y+56);
	ctx.lineTo(x+39, y+53);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+41, y+54);
	ctx.lineTo(x+41, y+56);
	ctx.lineTo(x+43, y+58);
	ctx.lineTo(x+43, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawRight1(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+42, y+9);
	ctx.lineTo(x+45, y+13);
	ctx.lineTo(x+40, y+22);
	ctx.lineTo(x+40, y+30);
	ctx.lineTo(x+35, y+26);
	ctx.lineTo(x+27, y+26);
	ctx.lineTo(x+19, y+29);
	ctx.lineTo(x+28, y+23);
	ctx.lineTo(x+30, y+13);
	ctx.lineTo(x+34, y+9);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+49, y+16);
	ctx.lineTo(x+43, y+17);
	ctx.lineTo(x+41, y+15);
	ctx.lineTo(x+42, y+13);
	ctx.lineTo(x+46, y+13);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+40, y+30);
	ctx.lineTo(x+41, y+39);
	ctx.lineTo(x+34, y+49);
	ctx.lineTo(x+25, y+53);
	ctx.lineTo(x+14, y+55); 
	ctx.lineTo(x+2, y+53);
	ctx.lineTo(x+2, y+51);
	ctx.lineTo(x+19, y+29);
	ctx.lineTo(x+27, y+26);
	ctx.lineTo(x+35, y+26); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+40,y+14,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+34, y+49);
	ctx.lineTo(x+18, y+42);
	ctx.lineTo(x+15, y+42);
	ctx.lineTo(x+15, y+46);
	ctx.lineTo(x+17, y+54); 
	ctx.lineTo(x+20, y+54);
	ctx.lineTo(x+18, y+46);
	ctx.lineTo(x+18, y+44);
	ctx.lineTo(x+31, y+50);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+11, y+42);
	ctx.lineTo(x+14, y+42);
	ctx.lineTo(x+14, y+45);
	ctx.lineTo(x+4, y+49);
	ctx.lineTo(x+6, y+56); 
	ctx.lineTo(x+13, y+44);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+24, y+57);
	ctx.lineTo(x+27, y+58);
	ctx.lineTo(x+27, y+53);
	ctx.lineTo(x+29, y+53);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+25, y+57);
	ctx.lineTo(x+22, y+57);
	ctx.lineTo(x+23, y+54);
	ctx.lineTo(x+25, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawRight2(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+44, y+5);
	ctx.lineTo(x+47, y+9);
	ctx.lineTo(x+42, y+18);
	ctx.lineTo(x+48, y+30);
	ctx.lineTo(x+43, y+28);
	ctx.lineTo(x+36, y+28);
	ctx.lineTo(x+25, y+30);
	ctx.lineTo(x+35, y+25);
	ctx.lineTo(x+33, y+11);
	ctx.lineTo(x+37, y+7);  	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+52, y+12);
	ctx.lineTo(x+45, y+13);
	ctx.lineTo(x+43, y+11);
	ctx.lineTo(x+44, y+9);
	ctx.lineTo(x+48, y+9);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+48, y+30);
	ctx.lineTo(x+49, y+39);
	ctx.lineTo(x+42, y+49);
	ctx.lineTo(x+32, y+52);
	ctx.lineTo(x+17, y+53); 
	ctx.lineTo(x+8, y+49);
	ctx.lineTo(x+8, y+47);
	ctx.lineTo(x+15, y+40);
	ctx.lineTo(x+25, y+30);
	ctx.lineTo(x+36, y+28);
	ctx.lineTo(x+43, y+28); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+41,y+10,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+42, y+49);
	ctx.lineTo(x+27, y+41);
	ctx.lineTo(x+23, y+44);
	ctx.lineTo(x+25, y+53);
	ctx.lineTo(x+28, y+53); 
	ctx.lineTo(x+27, y+44);
	ctx.lineTo(x+39, y+51);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+27, y+41);
	ctx.lineTo(x+23, y+45);
	ctx.lineTo(x+13, y+47);
	ctx.lineTo(x+6, y+43);
	ctx.lineTo(x+15, y+40); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+47, y+56);
	ctx.lineTo(x+40, y+57);
	ctx.lineTo(x+40, y+52);
	ctx.lineTo(x+42, y+52);
	ctx.lineTo(x+43, y+55);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+22, y+57);
	ctx.lineTo(x+27, y+57);
	ctx.lineTo(x+26, y+54);
	ctx.lineTo(x+23, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawRight3(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+52, y+12);
	ctx.lineTo(x+55, y+16);
	ctx.lineTo(x+50, y+25);
	ctx.lineTo(x+55, y+39);
	ctx.lineTo(x+48, y+35);
	ctx.lineTo(x+40, y+35);
	ctx.lineTo(x+32, y+37);
	ctx.lineTo(x+42, y+30);
	ctx.lineTo(x+41, y+18);
	ctx.lineTo(x+45, y+14);  
	ctx.lineTo(x+52, y+12); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+59, y+19);
	ctx.lineTo(x+53, y+20);
	ctx.lineTo(x+51, y+18);
	ctx.lineTo(x+52, y+16);
	ctx.lineTo(x+56, y+16);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+55, y+39);
	ctx.lineTo(x+55, y+47);
	ctx.lineTo(x+47, y+53);
	ctx.lineTo(x+36, y+55);
	ctx.lineTo(x+25, y+54); 
	ctx.lineTo(x+16, y+49);
	ctx.lineTo(x+16, y+47);
	ctx.lineTo(x+32, y+37);
	ctx.lineTo(x+40, y+35);
	ctx.lineTo(x+48, y+35);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+50,y+15,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+47, y+53);
	ctx.lineTo(x+34, y+45);
	ctx.lineTo(x+30, y+47);
	ctx.lineTo(x+33, y+54);
	ctx.lineTo(x+36, y+55); 
	ctx.lineTo(x+34, y+48);
	ctx.lineTo(x+43, y+54);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+34, y+45);
	ctx.lineTo(x+23, y+43);
	ctx.lineTo(x+16, y+44);
	ctx.lineTo(x+22, y+49);
	ctx.lineTo(x+30, y+47); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+50, y+53);
	ctx.lineTo(x+50, y+57);
	ctx.lineTo(x+53, y+58);
	ctx.lineTo(x+53, y+59);
	ctx.lineTo(x+45, y+59);
	ctx.lineTo(x+45, y+58);
	ctx.lineTo(x+47, y+57);
	ctx.lineTo(x+48, y+55);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+41, y+55);
	ctx.lineTo(x+43, y+59);
	ctx.lineTo(x+38, y+59);
	ctx.lineTo(x+39, y+56);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawRight4(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+63, y+2);
	ctx.lineTo(x+66, y+6);
	ctx.lineTo(x+63, y+17);
	ctx.lineTo(x+63, y+30);
	ctx.lineTo(x+59, y+28);
	ctx.lineTo(x+54, y+29);
	ctx.lineTo(x+46, y+31);
	ctx.lineTo(x+54, y+25);
	ctx.lineTo(x+53, y+12);
	ctx.lineTo(x+56, y+5);  
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+70, y+9);
	ctx.lineTo(x+64, y+10);
	ctx.lineTo(x+62, y+8);
	ctx.lineTo(x+63, y+6);
	ctx.lineTo(x+67, y+6);    	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+63, y+30);
	ctx.lineTo(x+62, y+40);
	ctx.lineTo(x+55, y+51);
	ctx.lineTo(x+60, y+52);
	ctx.lineTo(x+40, y+54); 
	ctx.lineTo(x+29, y+53);
	ctx.lineTo(x+22, y+50);
	ctx.lineTo(x+22, y+48);
	ctx.lineTo(x+33, y+41);
	ctx.lineTo(x+46, y+31);
	ctx.lineTo(x+54, y+29);
	ctx.lineTo(x+59, y+28);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+62,y+5,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+55, y+51);
	ctx.lineTo(x+43, y+43);
	ctx.lineTo(x+39, y+46);
	ctx.lineTo(x+40, y+54);
	ctx.lineTo(x+44, y+53); 
	ctx.lineTo(x+43, y+46);
	ctx.lineTo(x+50, y+52);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+43, y+43);
	ctx.lineTo(x+33, y+41);
	ctx.lineTo(x+25, y+46);
	ctx.lineTo(x+28, y+49);
	ctx.lineTo(x+39, y+46); 
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+53, y+53);
	ctx.lineTo(x+54, y+57);
	ctx.lineTo(x+58, y+58);
	ctx.lineTo(x+49, y+58);
	ctx.lineTo(x+51, y+56);
	ctx.lineTo(x+51, y+53);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+49, y+54);
	ctx.lineTo(x+49, y+56);
	ctx.lineTo(x+47, y+58);
	ctx.lineTo(x+47, y+54);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();   
}

function drawSatLeft(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+13, y+21);
	ctx.lineTo(x+11, y+24);
	ctx.lineTo(x+11, y+28);
	ctx.lineTo(x+12, y+33);
	ctx.lineTo(x+14, y+39);
	ctx.lineTo(x+19, y+38);
	ctx.lineTo(x+20, y+30);
	ctx.lineTo(x+21, y+26);
	ctx.lineTo(x+20, y+22);
	ctx.lineTo(x+17, y+20);  
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+16,y+27,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+10, y+30);
	ctx.lineTo(x+13, y+32);
	ctx.lineTo(x+15, y+28);
	ctx.lineTo(x+11, y+28);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawSatDown(x, y) {	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+12, y+38);
	ctx.lineTo(x+9, y+57);
	ctx.lineTo(x+11, y+55);
	ctx.lineTo(x+20, y+59);
	ctx.lineTo(x+34, y+56);
	ctx.lineTo(x+42, y+49);
	ctx.lineTo(x+31, y+33);
	ctx.lineTo(x+25, y+31);
	ctx.lineTo(x+21, y+33);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+12, y+38);
	ctx.lineTo(x+10, y+43);
	ctx.lineTo(x+11, y+47);
	ctx.lineTo(x+10, y+50);
	ctx.lineTo(x+11, y+55);
	ctx.lineTo(x+12, y+47);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+26, y+31);
	ctx.lineTo(x+26, y+45);
	ctx.lineTo(x+34, y+56);
	ctx.lineTo(x+38, y+54);
	ctx.lineTo(x+27, y+45);
	ctx.lineTo(x+41, y+46);
	ctx.lineTo(x+39, y+42);
	ctx.lineTo(x+28, y+45);
	ctx.lineTo(x+36, y+37);
	ctx.lineTo(x+34, y+34);
	ctx.lineTo(x+27, y+38);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+13, y+57);
	ctx.lineTo(x+13, y+59);
	ctx.lineTo(x+16, y+59);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+25, y+59);
	ctx.lineTo(x+28, y+59);
	ctx.lineTo(x+28, y+57);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawSatRight(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+9, y+24);
	ctx.lineTo(x+6, y+28);
	ctx.lineTo(x+6, y+32);
	ctx.lineTo(x+10, y+37);
	ctx.lineTo(x+14, y+39);
	ctx.lineTo(x+19, y+38);
	ctx.lineTo(x+18, y+33);
	ctx.lineTo(x+19, y+27);
	ctx.lineTo(x+19, y+26);
	ctx.lineTo(x+17, y+24);  
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+14,y+29,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+16, y+28);
	ctx.lineTo(x+18, y+31);
	ctx.lineTo(x+24, y+31);
	ctx.lineTo(x+21, y+28);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawFlyingBody(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+43, y+9);
	ctx.lineTo(x+40, y+13);
	ctx.lineTo(x+40, y+16);
	ctx.lineTo(x+44, y+22);
	ctx.lineTo(x+48, y+24);
	ctx.lineTo(x+53, y+23);
	ctx.lineTo(x+52, y+18);
	ctx.lineTo(x+53, y+13);
	ctx.lineTo(x+53, y+12);
	ctx.lineTo(x+51, y+9);  
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.arc(x+48,y+15,2.5,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+50, y+13);
	ctx.lineTo(x+52, y+16);
	ctx.lineTo(x+58, y+16);
	ctx.lineTo(x+55, y+13);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'gray';
	ctx.beginPath();
	ctx.moveTo(x+40, y+17);
	ctx.lineTo(x+28, y+22);
	ctx.lineTo(x+10, y+21);
	ctx.lineTo(x+5, y+21);
	ctx.lineTo(x+20, y+31);
	ctx.lineTo(x+30, y+37);
	ctx.lineTo(x+42, y+36);
	ctx.lineTo(x+52, y+27);
	ctx.lineTo(x+53, y+23);
	ctx.lineTo(x+48, y+24);
	ctx.lineTo(x+44, y+22);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+32, y+33);
	ctx.lineTo(x+32, y+35);
	ctx.lineTo(x+36, y+35);
	ctx.lineTo(x+36, y+33);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawFlyingUp(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+10, y+21);
	ctx.lineTo(x+9, y+7);
	ctx.lineTo(x+35, y+9);
	ctx.lineTo(x+40, y+17);
	ctx.lineTo(x+28, y+22); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+10, y+21);
	ctx.lineTo(x+1, y+1);
	ctx.lineTo(x+13, y+2);
	ctx.lineTo(x+24, y+4);
	ctx.lineTo(x+35, y+9); 
	ctx.lineTo(x+9, y+7); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawFlyingDown(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+10, y+21);
	ctx.lineTo(x+10, y+39);
	ctx.lineTo(x+36, y+25);
	ctx.lineTo(x+40, y+17);
	ctx.lineTo(x+30, y+16); 
	ctx.lineTo(x+19, y+18); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+10, y+21);
	ctx.lineTo(x+4, y+43);
	ctx.lineTo(x+10, y+44);
	ctx.lineTo(x+20, y+41);
	ctx.lineTo(x+30, y+33); 
	ctx.lineTo(x+36, y+25); 
	ctx.lineTo(x+10, y+39); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function randomColor(){
	r = Math.floor(Math.random() * 256);
	g = Math.floor(Math.random() * 256);
	b = Math.floor(Math.random() * 256);
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawNel(x, y, randomOn) {	

	ctx.beginPath();
	ctx.moveTo(x+17, y+28);
	ctx.lineTo(x+8, y+48);
	ctx.lineTo(x+3, y+69);
	ctx.lineTo(x+1, y+89);
	ctx.lineTo(x+30, y+79);
	ctx.lineTo(x+65, y+73);
	ctx.lineTo(x+116, y+73);
	ctx.lineTo(x+150, y+79);
	ctx.lineTo(x+179, y+89);
	ctx.lineTo(x+177, y+69);    
	ctx.lineTo(x+172, y+48);    
	ctx.lineTo(x+162, y+28);    
	ctx.lineTo(x+130, y+14);    
	ctx.lineTo(x+49, y+14);    
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+96, y+1);
	ctx.lineTo(x+108, y+29);
	ctx.lineTo(x+117, y+29);
	ctx.lineTo(x+132, y+1);   
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+108, y+29);
	ctx.lineTo(x+99, y+32);
	ctx.lineTo(x+95, y+39);
	ctx.lineTo(x+95, y+45);
	ctx.lineTo(x+102, y+49);
	ctx.lineTo(x+114, y+49);
	ctx.lineTo(x+121, y+44);
	ctx.lineTo(x+125, y+37);
	ctx.lineTo(x+124, y+31);
	ctx.lineTo(x+117, y+29);       
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(x+40, y+78);
	ctx.lineTo(x+56, y+109);
	ctx.lineTo(x+75, y+134);
	ctx.lineTo(x+104, y+134);
	ctx.lineTo(x+123, y+109);
	ctx.lineTo(x+140, y+78);
	ctx.lineTo(x+116, y+72);
	ctx.lineTo(x+65, y+72);       
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+55, y+83);
	ctx.lineTo(x+63, y+84);
	ctx.lineTo(x+74, y+82);
	ctx.lineTo(x+79, y+79);
	ctx.lineTo(x+69, y+79);     
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+100, y+79);
	ctx.lineTo(x+105, y+82);
	ctx.lineTo(x+116, y+84);
	ctx.lineTo(x+124, y+83);
	ctx.lineTo(x+110, y+79);     
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+84, y+84);
	ctx.lineTo(x+79, y+99);
	ctx.lineTo(x+85, y+114);
	ctx.lineTo(x+94, y+114);
	ctx.lineTo(x+100, y+99);  
	ctx.lineTo(x+95, y+84);     
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+76, y+123);
	ctx.lineTo(x+83, y+127);
	ctx.lineTo(x+96, y+127);
	ctx.lineTo(x+101, y+123);
	ctx.lineTo(x+94, y+122);  
	ctx.lineTo(x+86, y+122);     
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+42, y+89);
	ctx.lineTo(x+1, y+95);
	ctx.lineTo(x+1, y+119);
	ctx.lineTo(x+3, y+119);
	ctx.lineTo(x+3, y+100);
	ctx.lineTo(x+5, y+100);
	ctx.lineTo(x+5, y+119);
	ctx.lineTo(x+7, y+119);   
	ctx.lineTo(x+7, y+100);
	ctx.lineTo(x+9, y+100);
	ctx.lineTo(x+9, y+119);
	ctx.lineTo(x+5, y+120);
	ctx.lineTo(x+19, y+152);
	ctx.lineTo(x+32, y+159);
	ctx.lineTo(x+89, y+159); 
	ctx.lineTo(x+89, y+140);
	ctx.lineTo(x+55, y+140);
	ctx.lineTo(x+36, y+120);
	ctx.lineTo(x+60, y+120); 
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+138, y+89);
	ctx.lineTo(x+120, y+120);
	ctx.lineTo(x+155, y+130);
	ctx.lineTo(x+159, y+148);
	ctx.lineTo(x+171, y+148);
	ctx.lineTo(x+174, y+119);
	ctx.lineTo(x+170, y+119);
	ctx.lineTo(x+170, y+100);   
	ctx.lineTo(x+172, y+100);
	ctx.lineTo(x+172, y+119);
	ctx.lineTo(x+174, y+119);
	ctx.lineTo(x+174, y+100);
	ctx.lineTo(x+176, y+100);
	ctx.lineTo(x+176, y+119);
	ctx.lineTo(x+178, y+119); 
	ctx.lineTo(x+178, y+95);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : '#BFBCCF';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+44, y+162);
	ctx.lineTo(x+40, y+179);
	ctx.lineTo(x+139, y+179);
	ctx.lineTo(x+131, y+143);
	ctx.lineTo(x+92, y+162);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(0, 102, 102)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+160, y+150);
	ctx.lineTo(x+161, y+159);
	ctx.lineTo(x+171, y+159);
	ctx.lineTo(x+172, y+150);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+149, y+157);
	ctx.lineTo(x+150, y+160);
	ctx.lineTo(x+135, y+175);
	ctx.lineTo(x+153, y+163);
	ctx.lineTo(x+156, y+164);
	ctx.lineTo(x+155, y+161);
	ctx.lineTo(x+159, y+155);
	ctx.lineTo(x+152, y+158);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+40, y+121);
	ctx.lineTo(x+57, y+138);
	ctx.lineTo(x+94, y+138);
	ctx.lineTo(x+94, y+155);
	ctx.lineTo(x+149, y+131);
	ctx.lineTo(x+118, y+121);
	ctx.lineTo(x+106, y+136);
	ctx.lineTo(x+73, y+136);
	ctx.lineTo(x+62, y+121);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+70, y+162);
	ctx.lineTo(x+71, y+168);
	ctx.lineTo(x+82, y+168);
	ctx.lineTo(x+84, y+162);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+95, y+162);
	ctx.lineTo(x+97, y+168);
	ctx.lineTo(x+108, y+168);
	ctx.lineTo(x+109, y+162);
	ctx.lineTo(x+109, y+154);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+69, y+225);
	ctx.lineTo(x+65, y+239);
	ctx.lineTo(x+114, y+239);
	ctx.lineTo(x+110, y+225);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(0, 102, 102)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+72, y+240);
	ctx.lineTo(x+75, y+250);
	ctx.lineTo(x+104, y+250);
	ctx.lineTo(x+107, y+240);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'black';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+56, y+180);
	ctx.lineTo(x+70, y+229);
	ctx.lineTo(x+72, y+231);
	ctx.lineTo(x+58, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+58, y+180);
	ctx.lineTo(x+72, y+231);
	ctx.lineTo(x+74, y+233);
	ctx.lineTo(x+61, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+61, y+180);
	ctx.lineTo(x+74, y+233);
	ctx.lineTo(x+77, y+234);
	ctx.lineTo(x+65, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+65, y+180);
	ctx.lineTo(x+77, y+234);
	ctx.lineTo(x+79, y+234);
	ctx.lineTo(x+70, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+70, y+180);
	ctx.lineTo(x+79, y+234);
	ctx.lineTo(x+82, y+234);
	ctx.lineTo(x+75, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+75, y+180);
	ctx.lineTo(x+82, y+234);
	ctx.lineTo(x+84, y+234);
	ctx.lineTo(x+80, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+80, y+180);
	ctx.lineTo(x+84, y+234);
	ctx.lineTo(x+87, y+234);
	ctx.lineTo(x+85, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+85, y+180);
	ctx.lineTo(x+87, y+234);
	ctx.lineTo(x+90, y+234);
	ctx.lineTo(x+90, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(191, 188, 207)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+90, y+180);
	ctx.lineTo(x+90, y+234);
	ctx.lineTo(x+92, y+234);
	ctx.lineTo(x+95, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(130, 156, 182)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+95, y+180);
	ctx.lineTo(x+92, y+234);
	ctx.lineTo(x+95, y+234);
	ctx.lineTo(x+100, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(57, 125, 151)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+100, y+180);
	ctx.lineTo(x+95, y+234);
	ctx.lineTo(x+97, y+234);
	ctx.lineTo(x+105, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(34, 85, 105)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+105, y+180);
	ctx.lineTo(x+97, y+234);
	ctx.lineTo(x+100, y+234);
	ctx.lineTo(x+110, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(20, 62, 84)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+110, y+180);
	ctx.lineTo(x+100, y+234);
	ctx.lineTo(x+102, y+234);
	ctx.lineTo(x+115, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(20, 62, 84)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+115, y+180);
	ctx.lineTo(x+102, y+234);
	ctx.lineTo(x+105, y+233);
	ctx.lineTo(x+118, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(20, 62, 84)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+118, y+180);
	ctx.lineTo(x+105, y+233);
	ctx.lineTo(x+107, y+231);
	ctx.lineTo(x+121, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(11, 41, 53)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+121, y+180);
	ctx.lineTo(x+107, y+233);
	ctx.lineTo(x+109, y+219);
	ctx.lineTo(x+123, y+180);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(1, 6, 8)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+119, y+249);
	ctx.lineTo(x+116, y+252);
	ctx.lineTo(x+116, y+258);
	ctx.lineTo(x+120, y+262);
	ctx.lineTo(x+130, y+266);
	ctx.lineTo(x+144, y+266);
	ctx.lineTo(x+151, y+268);
	ctx.lineTo(x+167, y+267);
	ctx.lineTo(x+166, y+264);
	ctx.lineTo(x+159, y+263);
	ctx.lineTo(x+158, y+261);
	ctx.lineTo(x+160, y+261);
	ctx.lineTo(x+162, y+258);
	ctx.lineTo(x+161, y+253);
	ctx.lineTo(x+159, y+249);
	ctx.lineTo(x+154, y+247);
	ctx.lineTo(x+145, y+247);
	ctx.lineTo(x+137, y+250);
	ctx.lineTo(x+131, y+250);
	ctx.lineTo(x+125, y+248);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(0, 102, 102)';
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x+61, y+249);
	ctx.lineTo(x+64, y+252);
	ctx.lineTo(x+64, y+258);
	ctx.lineTo(x+60, y+262);
	ctx.lineTo(x+50, y+266);
	ctx.lineTo(x+36, y+266);
	ctx.lineTo(x+29, y+268);
	ctx.lineTo(x+13, y+267);
	ctx.lineTo(x+14, y+264);
	ctx.lineTo(x+21, y+263);
	ctx.lineTo(x+22, y+261);
	ctx.lineTo(x+20, y+261);
	ctx.lineTo(x+18, y+258);
	ctx.lineTo(x+19, y+253);
	ctx.lineTo(x+21, y+249);
	ctx.lineTo(x+26, y+247);
	ctx.lineTo(x+35, y+247);
	ctx.lineTo(x+43, y+250);
	ctx.lineTo(x+49, y+250);
	ctx.lineTo(x+55, y+248);
	ctx.closePath();
	
	ctx.fillStyle = (randomOn) ? randomColor() : 'rgb(0, 102, 102)';
	ctx.fill();
}

function drawKey(x, y) {	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.moveTo(x+2, y+11);
	ctx.lineTo(x+2, y+11);
	ctx.lineTo(x+2, y+18);
	ctx.lineTo(x+5, y+21);
	ctx.lineTo(x+9, y+21); 
	ctx.lineTo(x+10, y+20); 
	ctx.lineTo(x+11, y+17);
	ctx.lineTo(x+18, y+17);
	ctx.lineTo(x+18, y+19);
	ctx.lineTo(x+21, y+19); 
	ctx.lineTo(x+21, y+17); 
	ctx.lineTo(x+24, y+17);
	ctx.lineTo(x+24, y+19);
	ctx.lineTo(x+27, y+19);
	ctx.lineTo(x+27, y+12); 
	ctx.lineTo(x+11, y+12); 
	ctx.lineTo(x+10, y+9); 
	ctx.lineTo(x+9, y+8); 
	ctx.lineTo(x+5, y+8); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+6, y+12);
	ctx.lineTo(x+6, y+17);
	ctx.lineTo(x+7, y+18);
	ctx.lineTo(x+8, y+17);
	ctx.lineTo(x+8, y+12); 
	ctx.lineTo(x+7, y+11); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawLock(x, y) {	
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.moveTo(x+9, y+3);
	ctx.lineTo(x+7, y+5);
	ctx.lineTo(x+7, y+12);
	ctx.lineTo(x+11, y+12);
	ctx.lineTo(x+11, y+7); 
	ctx.lineTo(x+12, y+6); 
	ctx.lineTo(x+17, y+6);
	ctx.lineTo(x+18, y+7);
	ctx.lineTo(x+18, y+12);
	ctx.lineTo(x+22, y+12); 
	ctx.lineTo(x+22, y+5); 
	ctx.lineTo(x+20, y+3); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(x+6, y+12);
	ctx.lineTo(x+4, y+14);
	ctx.lineTo(x+4, y+26);
	ctx.lineTo(x+5, y+27);
	ctx.lineTo(x+24, y+27); 
	ctx.lineTo(x+25, y+26); 
	ctx.lineTo(x+25, y+14); 
	ctx.lineTo(x+23, y+12); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+13, y+17);
	ctx.lineTo(x+12, y+18);
	ctx.lineTo(x+12, y+20);
	ctx.lineTo(x+13, y+21);
	ctx.lineTo(x+13, y+22); 
	ctx.lineTo(x+11, y+24); 
	ctx.lineTo(x+18, y+24); 
	ctx.lineTo(x+16, y+22); 
	ctx.lineTo(x+16, y+21); 
	ctx.lineTo(x+17, y+20); 
	ctx.lineTo(x+17, y+18); 
	ctx.lineTo(x+16, y+17); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawOne(x, y) {	
	ctx.fillStyle = 'cYan';
	ctx.beginPath();
	ctx.moveTo(x+10, y+3);
	ctx.lineTo(x+8, y+5);
	ctx.lineTo(x+5, y+7);
	ctx.lineTo(x+5, y+14);
	ctx.lineTo(x+8, y+13); 
	ctx.lineTo(x+10, y+11); 
	ctx.lineTo(x+10, y+27);
	ctx.lineTo(x+24, y+27);
	ctx.lineTo(x+24, y+3); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawTwo(x, y) {	
	ctx.fillStyle = 'cYan';
	ctx.beginPath();
	ctx.moveTo(x+5, y+3);
	ctx.lineTo(x+3, y+5);
	ctx.lineTo(x+3, y+13);
	ctx.lineTo(x+9, y+13);
	ctx.lineTo(x+9, y+10); 
	ctx.lineTo(x+12, y+9); 
	ctx.lineTo(x+16, y+9);
	ctx.lineTo(x+19, y+10);
	ctx.lineTo(x+19, y+13); 
	ctx.lineTo(x+3, y+20);
	ctx.lineTo(x+3, y+27);
	ctx.lineTo(x+27, y+27);
	ctx.lineTo(x+27, y+21); 
	ctx.lineTo(x+19, y+21); 
	ctx.lineTo(x+27, y+17);
	ctx.lineTo(x+27, y+5);
	ctx.lineTo(x+25, y+3); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawThree(x, y) {	
	ctx.fillStyle = 'cYan';
	ctx.beginPath();
	ctx.moveTo(x+5, y+3);
	ctx.lineTo(x+3, y+5);
	ctx.lineTo(x+3, y+11);
	ctx.lineTo(x+8, y+11);
	ctx.lineTo(x+11, y+8); 
	ctx.lineTo(x+20, y+8); 
	ctx.lineTo(x+20, y+12);
	ctx.lineTo(x+11, y+12);
	ctx.lineTo(x+11, y+18); 
	ctx.lineTo(x+20, y+18);
	ctx.lineTo(x+20, y+22);
	ctx.lineTo(x+11, y+22);
	ctx.lineTo(x+8, y+19); 
	ctx.lineTo(x+8, y+19); 
	ctx.lineTo(x+3, y+19);
	ctx.lineTo(x+3, y+25);
	ctx.lineTo(x+5, y+27);
	ctx.lineTo(x+25, y+27);
	ctx.lineTo(x+27, y+25);
	ctx.lineTo(x+27, y+17);
	ctx.lineTo(x+26, y+16); 
	ctx.lineTo(x+26, y+12); 
	ctx.lineTo(x+27, y+11);
	ctx.lineTo(x+27, y+5);
	ctx.lineTo(x+25, y+3);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawArrowUp(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+5, y+17);
	ctx.lineTo(x+10, y+17);
	ctx.lineTo(x+10, y+22);
	ctx.lineTo(x+20, y+22);
	ctx.lineTo(x+20, y+17); 
	ctx.lineTo(x+25, y+17); 
	ctx.lineTo(x+15, y+7);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawArrowRight(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+8, y+10);
	ctx.lineTo(x+8, y+20);
	ctx.lineTo(x+13, y+20);
	ctx.lineTo(x+13, y+25);
	ctx.lineTo(x+23, y+15); 
	ctx.lineTo(x+13, y+5); 
	ctx.lineTo(x+13, y+10);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawArrowDown(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+5, y+13);
	ctx.lineTo(x+15, y+23);
	ctx.lineTo(x+25, y+13);
	ctx.lineTo(x+20, y+13);
	ctx.lineTo(x+20, y+8); 
	ctx.lineTo(x+10, y+8); 
	ctx.lineTo(x+10, y+13);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawArrowLeft(x, y) {	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(x+7, y+15);
	ctx.lineTo(x+17, y+25);
	ctx.lineTo(x+17, y+20);
	ctx.lineTo(x+22, y+20);
	ctx.lineTo(x+22, y+10); 
	ctx.lineTo(x+17, y+10); 
	ctx.lineTo(x+17, y+5);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function drawCyanTL(x, y) {	
	ctx.fillStyle = randomColor();
	ctx.beginPath();
	ctx.moveTo(x+1, y+1);
	ctx.lineTo(x+1, y+29);
	ctx.lineTo(x+4, y+29);
	ctx.lineTo(x+4, y+4);
	ctx.lineTo(x+29, y+4); 
	ctx.lineTo(x+29, y+1); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'magenta';
	ctx.stroke();
}

function drawCyanTR(x, y) {	
	ctx.fillStyle = randomColor();
	ctx.beginPath();
	ctx.moveTo(x+1, y+1);
	ctx.lineTo(x+29, y+1);
	ctx.lineTo(x+29, y+29);
	ctx.lineTo(x+26, y+29);
	ctx.lineTo(x+26, y+4); 
	ctx.lineTo(x+1, y+4); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'magenta';
	ctx.stroke();
}	

function drawCyanBL(x, y) {	
	ctx.fillStyle = randomColor();
	ctx.beginPath();
	ctx.moveTo(x+1, y+1);
	ctx.lineTo(x+1, y+29);
	ctx.lineTo(x+29, y+29);
	ctx.lineTo(x+29, y+26);
	ctx.lineTo(x+4, y+26); 
	ctx.lineTo(x+4, y+1); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'magenta';
	ctx.stroke();
}

function drawCyanBR(x, y) {	
	ctx.fillStyle = randomColor();
	ctx.beginPath();
	ctx.moveTo(x+29, y+1);
	ctx.lineTo(x+29, y+29);
	ctx.lineTo(x+1, y+29);
	ctx.lineTo(x+1, y+26);
	ctx.lineTo(x+26, y+26); 
	ctx.lineTo(x+26, y+1); 
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'magenta';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x+25, y+23);
	ctx.lineTo(x+23, y+25);
	ctx.lineTo(x+17, y+26);
	ctx.lineTo(x+13, y+25);
	ctx.lineTo(x+8, y+24); 
	ctx.lineTo(x+2, y+26); 
	ctx.lineTo(x-1, y+26);
	ctx.lineTo(x-2, y+24);
	ctx.lineTo(x+1, y+20); 
	ctx.lineTo(x-2, y+15); 
	
	ctx.lineTo(x-2, y+11);
	ctx.lineTo(x-1, y+8);
	ctx.lineTo(x-5, y+11);
	ctx.lineTo(x-6, y+1);
	ctx.lineTo(x-2, y+4); 
	ctx.lineTo(x-1, y+2); 
	ctx.lineTo(x-2, y-1);
	ctx.lineTo(x-3, y-3);
	ctx.lineTo(x-3, y-6); 
	ctx.lineTo(x-1, y-8); 
	
	ctx.lineTo(x+2, y-9);
	ctx.lineTo(x+3, y-9);
	ctx.lineTo(x+5, y-8);
	ctx.lineTo(x+7, y-6);
	ctx.lineTo(x+8, y-7); 
	ctx.lineTo(x+12, y-7); 
	ctx.lineTo(x+11, y-3);
	ctx.lineTo(x+8, y-1);
	ctx.lineTo(x+6, y+2); 
	ctx.lineTo(x+7, y+4); 
	
	ctx.lineTo(x+10, y+6);
	ctx.lineTo(x+13, y+12);
	ctx.lineTo(x+13, y+15);
	ctx.lineTo(x+11, y+16);
	ctx.lineTo(x+9, y+15); 
	ctx.lineTo(x+6, y+15); 
	ctx.lineTo(x+5, y+12);
	ctx.lineTo(x+3, y+8);
	ctx.lineTo(x+5, y+12); 
	ctx.lineTo(x+6, y+15);
	
	ctx.lineTo(x+8, y+15);
	ctx.lineTo(x+8, y+17);
	ctx.lineTo(x+10, y+17); 
	ctx.lineTo(x+11, y+16); 
	ctx.lineTo(x+13, y+17);
	ctx.lineTo(x+15, y+20);
	ctx.lineTo(x+20, y+20); 
	ctx.lineTo(x+23, y+20);
	
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x+1, y-6);
	ctx.lineTo(x+2, y-6);
	ctx.lineTo(x+3, y-3);
	ctx.lineTo(x+3, y-2);
	ctx.lineTo(x+2, y+1); 
	ctx.lineTo(x+1, y+1); 
	ctx.lineTo(x, y-2); 
	ctx.lineTo(x, y-3); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(x-11, y-15);
	ctx.lineTo(x-9, y-15);
	ctx.lineTo(x-2, y+21);
	ctx.lineTo(x-5, y+22);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x-10, y-1);
	ctx.lineTo(x-7, y-1);
	ctx.lineTo(x-7, y+3);
	ctx.lineTo(x-10, y+3);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(x-15, y-16);
	ctx.lineTo(x-16, y-23);
	ctx.lineTo(x-9, y-23);
	ctx.lineTo(x+1, y-22);
	ctx.lineTo(x+13, y-16);
	ctx.lineTo(x+17, y-13);
	ctx.lineTo(x+23, y-7);
	ctx.lineTo(x+17, y-11);
	ctx.lineTo(x+9, y-14);
	ctx.lineTo(x-4, y-16);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}

function cyanBoxMoved()
{
	bool = false;
	i = 0;

	if (--(currArray[cyanRow][cyanCol]) == 14)
	{
		currArray[cyanRow][cyanCol] = 18;
	}

	for (;;)
	{
		if (currArray[cyanRow][cyanCol] == 15)
		{
			if ((cyanCol + 2 <= 7) && (currArray[cyanRow][(cyanCol + 2)] == 10) && (currArray[(cyanRow + 1)][(cyanCol + 2)] == 10))
			{
				currArray[cyanRow][cyanCol] = 10;
				currArray[(cyanRow + 1)][cyanCol] = 10;
				currArray[cyanRow][(cyanCol + 1)] = 15;
				currArray[(cyanRow + 1)][(cyanCol + 1)] = 20;
				currArray[cyanRow][(cyanCol + 2)] = 19;
				currArray[(cyanRow + 1)][(cyanCol + 2)] = 21;
				bool = true;
				cyanCol += 1;
				break;
			}

			i++;

			if (i == 4) 
			{
				break;
			}
			currArray[cyanRow][cyanCol] += 1;
		}

		if (currArray[cyanRow][cyanCol] == 16)
		{
			if ((cyanRow + 2 <= 5) && (currArray[(cyanRow + 2)][cyanCol] == 10) && (currArray[(cyanRow + 2)][(cyanCol + 1)] == 10))
			{
				currArray[cyanRow][cyanCol] = 10;
				currArray[cyanRow][(cyanCol + 1)] = 10;
				currArray[(cyanRow + 1)][cyanCol] = 16;
				currArray[(cyanRow + 1)][(cyanCol + 1)] = 19;
				currArray[(cyanRow + 2)][cyanCol] = 20;
				currArray[(cyanRow + 2)][(cyanCol + 1)] = 21;
				bool = true;
				cyanRow += 1;
				break;
			}

			i++;

			if (i == 4) 
			{
				break;
			}
			currArray[cyanRow][cyanCol] += 1;
		}

		if (currArray[cyanRow][cyanCol] == 17)
		{
			if ((cyanCol - 1 >= 0) && (currArray[cyanRow][(cyanCol - 1)] == 10) && (currArray[(cyanRow + 1)][(cyanCol - 1)] == 10))
		 	{
				currArray[cyanRow][(cyanCol - 1)] = 17;
				currArray[(cyanRow + 1)][(cyanCol - 1)] = 20;
				currArray[cyanRow][cyanCol] = 19;
				currArray[(cyanRow + 1)][cyanCol] = 21;
				currArray[cyanRow][(cyanCol + 1)] = 10;
				currArray[(cyanRow + 1)][(cyanCol + 1)] = 10;
				bool = true;
				cyanCol -= 1;
				break;
		 	}

			i++;

			if (i == 4) 
			{
				break;
			}
			currArray[cyanRow][cyanCol] += 1;
	 	}

		if (currArray[cyanRow][cyanCol] == 18)
		{
			if ((cyanRow - 1 >= 0) && (currArray[(cyanRow - 1)][cyanCol] == 10) && (currArray[(cyanRow - 1)][(cyanCol + 1)] == 10))
			{
				currArray[(cyanRow - 1)][cyanCol] = 18;
				currArray[(cyanRow - 1)][(cyanCol + 1)] = 19;
				currArray[cyanRow][cyanCol] = 20;
				currArray[cyanRow][(cyanCol + 1)] = 21;
				currArray[(cyanRow + 1)][cyanCol] = 10;
				currArray[(cyanRow + 1)][(cyanCol + 1)] = 10;
				bool = true;
				cyanRow -= 1;
				break;
			}

			i++;

			if (i == 4) 
			{
				break;
			}
		 	currArray[cyanRow][cyanCol] = 15;
		}
 	}
  	return bool;
 }

