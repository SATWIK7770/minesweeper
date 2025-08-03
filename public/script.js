window.addEventListener('resize', () => location.reload());
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    class Queue {
        constructor() {
        this.items = [];
        }

        enqueue(element) {
        this.items.push(element); 
        }

        dequeue() {
        return this.isEmpty() ? "Queue is empty" : this.items.shift();
        }

        peek() {
        return this.isEmpty() ? "Queue is empty" : this.items[0];
        }

        isEmpty() {
        return this.items.length === 0;
        }

        size() {
        return this.items.length; 
        }

        print() {
        console.log(this.items.join(" -> "));
        }
    }

    class cell{

        static length;

        constructor({position , isHidden=true , content=0 , isFlagged=false}){
            this.position = position;
            this.isHidden = isHidden;
            this.content = content;   
            this.isFlagged = isFlagged;     
        }

        drawCell(){
            if(this.isHidden == true){
                ctx.fillStyle = "#A0C1B9";
                ctx.fillRect(this.position.x , this.position.y , cell.length , cell.length);
                ctx.strokeStyle = "#D3D3D3";
                ctx.strokeRect(this.position.x , this.position.y , cell.length , cell.length);

                if(this.isFlagged == true){
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    const text = "🚩";
                    ctx.fillText(
                        text,
                        this.position.x + cell.length / 2,
                        this.position.y + cell.length / 2
                    );
                }
            }
            else{
                ctx.fillStyle = "#EAEFE5";
                ctx.fillRect(this.position.x , this.position.y , cell.length , cell.length);
                ctx.strokeStyle = "#D3D3D3";
                ctx.strokeRect(this.position.x , this.position.y , cell.length , cell.length);
                
                if(this.content > 0){
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    const text = this.content;
                    ctx.fillText(
                        text,
                        this.position.x + cell.length / 2,
                        this.position.y + cell.length / 2
                    );
                }
                if(this.content == -1){
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    const text = "💣";
                    ctx.fillText(
                        text,
                        this.position.x + cell.length / 2,
                        this.position.y + cell.length / 2
                    );
                }

            }
        }
    }

    class grid{
        static gap = 1;
        constructor(level){
            this.level = level;

            switch(level){
                case "easy":
                    this.cells = 81;
                    this.mines = 10;
                    cell.length = 40;
                    break;
                case "medium":
                    this.cells = 256;
                    this.mines = 40;
                    cell.length = 30;
                    break;
                case "hard":
                    this.cells = 900;
                    this.mines = 160;
                    cell.length = 20;
                    break;
            }
            this.height = Math.sqrt(this.cells) * cell.length + grid.gap * (Math.sqrt(this.cells)-1);
            this.width = this.height;
            this.mineArr = [];
            this.offsetX = Math.round((canvas.width - this.width)/2);
            this.offsetY = Math.round((canvas.height - this.height)/2); 
            this.layout = this.createLayout(this.cells);
            this.flagCount = this.mines;   
            this.valueCellsCount = this.cells - this.mines;
            this.revealedValueCells = 0;       
        }

        createLayout(cells){
            const rows = Math.sqrt(cells);
            const cols = rows;
            let mat = [];
            
            for(let i=0;i<rows;i++){
                mat[i] = [];
                for(let j=0;j<cols;j++){
                    mat[i][j] = new cell({position:{x:this.offsetX + cell.length*j+j , y:this.offsetY + cell.length*i+i}});
                }
            }
            return mat;
        }

        assignMines(mat , firstClickRow , firstClickCol){
            let n = Math.sqrt(this.cells);
            let excludedCoordinates = [[firstClickRow , firstClickCol] , [firstClickRow - 1 , firstClickCol - 1] , [firstClickRow - 1 , firstClickCol] , [firstClickRow - 1 , firstClickCol + 1] , [firstClickRow , firstClickCol - 1] , [firstClickRow , firstClickCol + 1] , [firstClickRow + 1 , firstClickCol - 1] , [firstClickRow + 1 , firstClickCol] , [firstClickRow + 1 , firstClickCol + 1]];
            
            excludedCoordinates = excludedCoordinates.filter(([row, col]) => row >= 0 && row < n && col >= 0 && col < n);

            let excludedCells = [];

            excludedCoordinates.forEach(coordinate => {
                excludedCells.push(n * coordinate[0] + coordinate[1]);
            });

            let pop = [];
            for(let i=0;i<this.cells;i++){
                if(excludedCells.includes(i)){
                    continue;
                }
                pop.push(i);
            }

            for(let i=0;i<this.mines;i++){
                const m = Math.floor(Math.random()*pop.length);
                const cellno = pop[m];
                let r = Math.floor(cellno/Math.sqrt(this.cells));
                let c = cellno % Math.sqrt(this.cells);
                mat[r][c].content = -1;
                this.mineArr.push(pop.splice(m,1)[0]);
            }            
            return mat;
        }

        assignVal(mat){
            let dir = [[-1,0] , [1,0] , [0,1] , [0,-1] , [-1,-1] , [1,-1] , [-1,1] , [1,1]];
            const n = Math.sqrt(this.cells);

            for(let i=0;i<Math.sqrt(this.cells);i++){
                for(let j=0;j<Math.sqrt(this.cells);j++){
                    if(mat[i][j].content != -1){
                        continue;
                    }                
                    
                    for(let [dx , dy] of dir){
                        let r = i+dx;
                        let c = j+dy;
                        if(r<n && r>=0 && c<n && c>=0 && mat[r][c].content!=-1){
                            mat[r][c].content++;
                        }
                    }
                }
            }
            return mat;
        }
        
        drawGrid(){
            for(let i=0;i<Math.sqrt(this.cells);i++){
                for(let j=0;j<Math.sqrt(this.cells);j++){
                    this.layout[i][j].drawCell();
                }
            }
        }

        revealMines(){
            for(let i=0;i<Math.sqrt(this.cells);i++){
                for(let j=0;j<Math.sqrt(this.cells);j++){
                    if(this.layout[i][j].content == -1){
                        this.layout[i][j].isHidden = false
                        this.layout[i][j].drawCell();
                    }
                }
            }
        }
    }

    const param = new URLSearchParams(window.location.search);
    const level = param.get("level");
    let g = new grid(level);
    g.drawGrid();

    const flagCounterOffsetX = Math.round(g.offsetX/2) - 100;
    const flagCounterOffsetY = Math.round((g.offsetY + (g.height/2)));
    const flagDisplay = document.createElement("div");
    document.body.appendChild(flagDisplay);    

    function flagCounterDisplay(flagCounterOffsetX , flagCounterOffsetY , flagDisplay){        
        flagDisplay.textContent = `🚩: ${g.flagCount}`;
        flagDisplay.style.cssText = `position: absolute; left: ${flagCounterOffsetX}px; top: ${flagCounterOffsetY}px; background: #333; color: white; padding: 5px 10px; font: 30px Arial;`;
    }

    flagCounterDisplay(flagCounterOffsetX , flagCounterOffsetY , flagDisplay);

    let intervalID = null; 
    let seconds = 0;
    const timerOffsetX = Math.round(g.offsetX/2) - 100;;
    const timerOffsetY = Math.round((g.offsetY + (g.height/2))) - 75;
    const timerDisplay = document.createElement("div");
    document.body.append(timerDisplay);

    function timerCounterDisplay(timerOffsetX , timerOffsetY , timerDisplay){
        const secs = Math.round(seconds % 60);
        const mins = Math.round(((seconds - secs) / 60) % 60);
        const hours = Math.round((((seconds - secs) / 60) - mins) / 60);

        timerDisplay.textContent = `⏱: ${hours.toString().padStart(2 , '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timerDisplay.style.cssText = `position: absolute; left: ${timerOffsetX}px; top: ${timerOffsetY}px; background: #333; color: white; padding: 5px 10px; font: 30px Arial;`;
    }

    function startTimer(){
        if(!intervalID){
            intervalID = setInterval(() => {
                seconds++;
                timerCounterDisplay(timerOffsetX , timerOffsetY , timerDisplay);
            } , 1000);
        }
    }

    function endTimer(){
        clearInterval(intervalID);
        intervalID = null;
    }

    timerCounterDisplay(timerOffsetX , timerOffsetY , timerDisplay);

    function gameStart(){
        startTimer();
    }

    function gameOver(){
        endTimer();
        gameOverHandler();        
    }

    function gameEnd(){
        endTimer();
        gameEndHandler();
    }
    
    function gameOverHandler() {
        const gameOverDialogBox = document.createElement("div");
        Object.assign(gameOverDialogBox.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#333",
            color: "white",
            padding: "16px",
            textAlign: "center"
        });

        const message = document.createElement("div");
        message.textContent = "Game Over";
        gameOverDialogBox.appendChild(message);

        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style.marginTop = "10px";
        okButton.addEventListener("click", () => {
            gameOverDialogBox.remove();
            setTimeout(() => {
                g.revealMines();
                setTimeout(() => {
                    playAgain();
                } , 800);
            } , 300);
        });

        gameOverDialogBox.appendChild(okButton);

        setTimeout(() => {
            document.body.appendChild(gameOverDialogBox);
        } , 400);
        
        const canvas = document.getElementById("myCanvas");
        if (canvas) canvas.style.pointerEvents = "none";

    }    

    function gameEndHandler(){
        const gameEndDialogBox = document.createElement("div");
        Object.assign(gameEndDialogBox.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#333",
            color: "white",
            padding: "16px",
            textAlign: "center"
        });

        const message = document.createElement("div");
        message.textContent = "Congratulations , you have completed the level";
        gameEndDialogBox.appendChild(message);

        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style.marginTop = "10px";
        okButton.addEventListener("click", () => {
            gameEndDialogBox.remove();
            setTimeout(() => {
                if (currLbData.length < 10 || seconds < Math.max(...currLbData.map(d => d.time))) {
                    showNameInputDialog(seconds);
                }
            }, 100); 
        });

        gameEndDialogBox.appendChild(okButton);
        setTimeout(() => {
            document.body.appendChild(gameEndDialogBox);
        } , 500);
    }

    function showNameInputDialog(time){
    const dialog = document.createElement("div");
    Object.assign(dialog.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#333",
        color: "white",
        padding: "16px",
        textAlign: "center"
    });

    const message = document.createElement("div");
    message.textContent = "🎉 You're in the Top 10! Enter your name:";
    dialog.appendChild(message);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Your name";
    input.style.marginTop = "10px";
    input.style.padding = "5px";
    dialog.appendChild(input);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.style.marginTop = "10px";
    submitButton.style.marginLeft = "10px";
    submitButton.addEventListener("click", () => {
        const name = input.value.trim();
        if (name.length === 0) return;

        fetch("/submitTime", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                time: time,
                level: level
            })
        }).then(() => {
            dialog.remove();
            leaderboardDisplay(leaderboardOffsetX, leaderboardOffsetY, leaderboard); 
            setTimeout(playAgain() , 500);
        });
    });

    dialog.appendChild(submitButton);
    document.body.appendChild(dialog);
    }

    function playAgain(){
        const playAgainDialogBox = document.createElement("div");
        Object.assign(playAgainDialogBox.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#333",
            color: "white",
            padding: "16px",
            textAlign: "center"
        });

        const message = document.createElement("div");
        message.textContent = "Do you want to play again?";
        playAgainDialogBox.appendChild(message);

        const buttonContainer = document.createElement("div");
        Object.assign(buttonContainer.style, {
        display: "flex",
        justifyContent: "space-evenly"
        });

        const yesButton = document.createElement("button");
        yesButton.textContent = "YES";
        yesButton.style.marginTop = "10px";
        yesButton.addEventListener("click", () => {
            window.location.href = `game.html?level=${level}`;
        });
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement("button");
        noButton.textContent = "NO";
        noButton.style.marginTop = "10px";
        noButton.addEventListener("click", () => {
            window.location.href = `index.html`;
        });
        buttonContainer.appendChild(noButton);
        playAgainDialogBox.appendChild(buttonContainer);
        document.body.appendChild(playAgainDialogBox);
    }

    const leaderboardOffsetX = g.offsetX + g.width + 110;
    const leaderboardOffsetY = 60;
    const leaderboard = document.createElement("div");
    document.body.appendChild(leaderboard); 
    
    let currLbData;

    async function getCurrLbData(){
        try {
        const res = await fetch(`/leaderboard?level=${level}`);
        if (!res.ok) throw new Error("Network error");
        return await res.json();
        } 
        catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        return []; 
        }
    }

    function renderLeaderboard(data) {
    leaderboard.innerHTML = "<h3 style='margin-top: 0'>🏆 Leaderboard</h3>";

    if (data.length === 0) {
        leaderboard.innerHTML += "<div>No scores yet.</div>";
        return;
    }

    const list = document.createElement("ol");
    data.forEach(entry => {
        const item = document.createElement("li");

        const hrs = Math.floor(entry.time / 3600);
        const mins = Math.floor((entry.time % 3600) / 60);
        const secs = entry.time % 60;

        let formatTime = [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');

        item.textContent = `${entry.name} - ${formatTime}`;
        list.appendChild(item);
    });

    leaderboard.appendChild(list);
    }

    async function leaderboardDisplay(leaderboardOffsetX , leaderboardOffsetY , leaderboard){
        leaderboard.style.cssText = `
        position: absolute;
        left: ${leaderboardOffsetX}px;
        top: ${leaderboardOffsetY}px;
        background: #333;
        color: white;
        padding: 10px 20px;
        font: 20px Arial;
        max-width: 300px;
        border-radius: 8px;`;

        currLbData = await getCurrLbData();
        renderLeaderboard(currLbData);
    }

    leaderboardDisplay(leaderboardOffsetX , leaderboardOffsetY , leaderboard);

    let firstClick = true;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());     // prevents the default right click menu from appearing
    canvas.addEventListener("mousedown" , function(e){    
        gameStart();
        console.log(e);
        let x = e.x;
        let y = e.y;

        if(x<g.offsetX || x>g.offsetX+g.width || y<g.offsetY || y>g.offsetY+g.height){
            return;
        }

        let col = Math.floor((x-g.offsetX)/(cell.length+grid.gap));
        let row = Math.floor((y-g.offsetY)/(cell.length+grid.gap));    

        if(e.button === 0){
            if(g.layout[row][col].isHidden == false || g.layout[row][col].isFlagged == true){
                return;
            }

            if(firstClick){
            g.layout = g.assignMines(g.layout , row , col);
            g.layout = g.assignVal(g.layout);
            firstClick = false;
            }

            g.layout[row][col].isHidden = false;

            if(g.layout[row][col].content > 0){
                g.revealedValueCells++;
                g.layout[row][col].drawCell();

                if(g.revealedValueCells == g.valueCellsCount){
                    gameEnd();
                }
            }

            else if(g.layout[row][col].content == 0){
                g.layout[row][col].drawCell();
                g.revealedValueCells++;
                let dir = [[-1,0] , [1,0] , [0,1] , [0,-1] , [-1,-1] , [1,-1] , [-1,1] , [1,1]];
                let arr = [];
                const n = Math.sqrt(g.cells);
                const q = new Queue();
                let flagged = 0;
                q.enqueue([row , col]);

                while(!q.isEmpty()){
                    let curr = q.dequeue();
                    for(let [dx , dy] of dir){
                        let r = curr[0] + dx;
                        let c = curr[1] + dy;

                        if(r>=0 && r<n && c>=0 && c<n && g.layout[r][c].content != -1 && g.layout[r][c].isHidden == true){
                            g.revealedValueCells++;
                            g.layout[r][c].isHidden = false;
                            arr.push([r,c]);
                            if(g.layout[r][c].content == 0){
                                q.enqueue([r , c])
                            }                            
                        }
                    }
                }
                for(let[i , j] of arr){
                    if(g.layout[i][j].isFlagged == true){
                        flagged++;
                        g.layout[i][j].isFlagged = false;
                    }
                    g.layout[i][j].drawCell();
                }
                g.flagCount = g.flagCount + flagged;
                flagCounterDisplay(flagCounterOffsetX , flagCounterOffsetY , flagDisplay);

                if(g.revealedValueCells == g.valueCellsCount){
                    gameEnd();
                }
            }

            else{
                g.layout[row][col].drawCell();           
                gameOver();
            }
        }

        else if(e.button === 2){
            const val =  g.layout[row][col].isFlagged;
            g.layout[row][col].isFlagged = !g.layout[row][col].isFlagged;

            if(g.layout[row][col].isFlagged == true && val == false){
                g.flagCount--;
            }
            else if(g.layout[row][col].isFlagged == false && val == true){
                g.flagCount++;
            }

            g.layout[row][col].drawCell();
            flagCounterDisplay(flagCounterOffsetX , flagCounterOffsetY , flagDisplay);
        }
    });
});