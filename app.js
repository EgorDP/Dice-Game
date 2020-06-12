/**
 * Pig Dice Rules:
 * - 2 player game 
 * - In a turn, a player can roll a dice as many times as possible, each number gets added to his current round score
 * - If a 1 is rolled, the round score is deleted and it becomes the other player's turn
 * - There is also a hold option, where the player can add his current round score to their total score, set the round score to zero, and change players
 * - A total score of 30 means a player has won the game (this account for total plus round score)
 */
var scores = [0,0];
var roundScore = 0;
var previousScore = 0;
var activePlayer = 0;
var maxScore = 30;

var hiddenRules = false;
var gameActive = true;
var lightTheme = true;
var currentTheme = 'active';


//document.querySelector("#current-" + activePlayer).textContent = dice; //Setter
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
//var x = document.querySelector("#score-0").textContent; //Getter
document.querySelector(".dice").style.display = 'none';
document.getElementById('score-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('current-1').textContent = '0';


/**
 * Roll button:
 * - Generate a random number
 * - Optional rules affect score/current
 * - Updates current
 *   - Deletes if one and changes player
 *   - Adds to current otherwise
 */
document.querySelector('.btn-roll').addEventListener('click', function() {
    if(!gameActive){
        return;
    }
    // Create Random number
    dice = Math.floor(Math.random() * 6) + 1;

    //Implement hidden rules    
    if(hiddenRules){
        if(previousScore == 2 && dice == 2){
            roundScore *= 2;
        } 
        if(previousScore == 6 && dice == 3){
            roundScore = 0;
        }
        if(previousScore == 5 && dice == 4){
            roundScore += 5;
        }
    }   
    previousScore = dice;

    // Display the results
    var diceDOM =  document.querySelector('.dice');
   diceDOM.style.display = 'block';
   diceDOM.src = 'dice-' + dice + '.png'; //Attribute selector 

    // Update the round score IF the rolled number was NOT a 1
    if(dice !== 1){
        // Check if the player won
        if(scores[activePlayer] + roundScore + dice >= maxScore){
            console.log('We have a winner! It is player ' + (activePlayer + 1) );
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gameActive = false;
        }
        //Add score
        roundScore += dice;
        console.log("Round score:" + roundScore);
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    }else{
        //Delete current score
        roundScore = 0;
        document.getElementById('current-' + activePlayer).textContent = '0';
        // Change players
        //document.querySelector('.player-0-panel').classList.remove('action');
        //document.querySelector('.player-1-panel').classList.add('active');
        changePlayer();
    }
}); 


/**
 * Hold Button:
 * - Update player score with current
 * - Reset current score
 * - Change player
 */
document.querySelector('.btn-hold').addEventListener('click',function(){
    if(!gameActive){
        return;
    }
    //Update score
    updateScore();

    // Set current score to zero 
    document.getElementById('current-' + activePlayer).textContent = '0';
    roundScore = 0;
    // Change player
    changePlayer();
});

document.querySelector('.btn-theme').addEventListener('click',changeTheme);


/**
 * New Game Button:
 * - Reset scores array, and all html scores
 * - Remove winner panel
 * - Reset active panel
 */
document.querySelector('.btn-new').addEventListener('click', function() {
    gameActive = true;
    scores[0] = 0;
    scores[1] = 0;
    roundScore = 0;
    document.getElementById('score-1').textContent = '0';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('winner');
    document.querySelector('#name-' + activePlayer).textContent = 'Player ' + (activePlayer +1);
    /*document.querySelector('.btn-roll').className = "ion-ios-loop";
    document.querySelector('.btn-roll').innerHTML = 'Roll dice'; */
    document.querySelector('.player-0-panel').classList.add(currentTheme);
    document.querySelector('.player-1-panel').classList.remove(currentTheme);
    activePlayer = 0;
});

document.querySelector('.btn-options').addEventListener('click',function(){
    var optionsDOM = document.querySelector('.icon');
    hiddenRules = !hiddenRules;
    optionsDOM.classList.toggle('ion-ios-toggle-outline');
    optionsDOM.classList.toggle('ion-ios-toggle');
});


function updateScore(){
    var scoreDOM = document.querySelector('#score-' + activePlayer);
    var score = scoreDOM.textContent;
    var final = parseInt(score) + parseInt(roundScore);
    scoreDOM.textContent = final;
    scores[activePlayer] += roundScore;
    //console.log("Player " + activePlayer + ": "  + scores[activePlayer]);
}
function changePlayer() {
    activePlayer = (activePlayer + 1) % 2;
    document.querySelector('.player-0-panel').classList.toggle(currentTheme);
    document.querySelector('.player-1-panel').classList.toggle(currentTheme);
}

function changeTheme() {
    lightTheme = !lightTheme;
    var bodyDOM = document.getElementById('body');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove(currentTheme);
    if(lightTheme){
        //Change background-image to light
        bodyDOM.style.backgroundImage = 'url(water.jpg)';
        currentTheme = 'active';
        //Toggle normal panel background colors
        document.querySelector('.player-1-panel').style.backgroundColor = '#fff';
        document.querySelector('.player-0-panel').style.backgroundColor = '#fff';
        //Change active panel to light
        document.querySelector('.player-' + activePlayer + '-panel').classList.add(currentTheme);
    }else{
        currentTheme = 'active-dark';
        //Change background-image to dark
        bodyDOM.style.backgroundImage = 'linear-gradient(rgba(62, 20, 20, 0.4), rgba(62, 20, 20, 0.4)), url(water.jpg)';
        //Toggle dark panel background colors
        document.querySelector('.player-0-panel').style.backgroundColor = 'rgba(207, 207, 207, 0.774)';
        document.querySelector('.player-1-panel').style.backgroundColor = 'rgba(207, 207, 207, 0.774)';
        //Change active panel to dark
        document.querySelector('.player-' + activePlayer + '-panel').classList.add(currentTheme);
    }
}



