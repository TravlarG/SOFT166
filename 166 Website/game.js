var cardArray = ['Red','Red','Blue','Blue','Green','Green','Brown','Brown','Orange','Orange'];
// Initializes an array representing the content of each card 
var cardValues = [];
var cardIds = [];
// Generation of two empty arrays, which will be used to store the IDs of the randomly generated cards.
var titlesFlipped = 0;
// Variable keeps track of how many cards are flipped upright, should this exceed two and not be correct they will be flipped over.

function getLightURI(element)
{
    var IP = "http://192.168.0.50/api/";
    var username = "stlaB2I6VZ8O80Qepc-1xfmLrHgyTFvB9IGupaQz";
    var lights = "/lights/";
    var URI = IP + username + lights;
    // Sets the static login information associated with the hue lights, where upon all the information will be concatenated under URI.
    return URI + element.attr("id")+"/";
}

Array.prototype.shuffle = function(){
    // Creates a method using the prototype property, this method will be called at random times to shuffle the CardArray at the beginning of each generation. 
    var i = this.length, x, temp;

    while(--i > 0){
        x = Math.floor(Math.random() * (i+1)); // Used to return a random number, which will be used when plotting the card positions from array. 
        temp = this[x];
        this[x] = this[i];
        this[i] = temp;
    }
}

function togglelight(element)
{
    // Retrieves the light URI that was created via the getLightURI function. 
    var getState = $.getJSON(getLightURI(element), function (data)
        {
            var state = data["state"]["on"];
            if (state)
            {
                state = false;
            }
            else
            {
                state = true;
            }

            var lightState = {"on" : state}; // Sets the light state to on. 

            $.ajax({
                url: getLightURI(element) + "state/",
                type: "PUT",
                data: JSON.stringify(lightState)
            })
        });
}

function GameStart(){
	titlesFlipped = 0; // Sets to null. 
    var output = '';
    cardArray.shuffle(); // Shuffles the card array at game start to set random locations.

    for(var i = 0; i < cardArray.length; i++) // Running a for loop over the length of the array, this loop will run and iterate until all of the divs are populated. 
    {
        output += '<div id="tile_'+i+'" onclick="CardFlip(this,\''+cardArray[i]+'\')"></div>';
        // Each div ID will get the dynamic title number, which will be title_0 - title_9
        // Each card will be given an on click event as "CardFlip" which is a method that flips the tiles over.
        // Two arguments are then parsed, this which represents the current div being accessed, and then the array will be put through. 
	}
    document.getElementById('game').innerHTML = output;
    // Takes the cards as the output and then places in the games board. 
}

function CardFlip(tile,val){ // Runs with the two arguments previously created
    
    if(tile.innerHTML == "" && cardValues.length < 2) // Used as error checking, will make sure the cards are not only empty but hold a value less than two. 
    {
        tile.innerHTML = val;
        
        if(cardValues.length == 0) // Checks if card value array is empty
        {
            cardValues.push(val);
            // Will push a value to the cards memory array, which will make sure a flipped upright card is assigned a value. 
            cardIds.push(tile.id);
            // Will push a value to the card id array, which will make sure both arrays have a populated value to show which card is being clicked. 
        } 
        else if(cardValues.length == 1) // As the number of flipped upright cards can be two, if the cardValue is greater than 0 the else if condition will run.
        // Repeating the same actions as the previous if statement. 
        {
			cardValues.push(val);
            cardIds.push(tile.id);

            if(cardValues[0] == cardValues[1]) // This if statement will check if the two cards match
            {
				titlesFlipped += 2; // This keeps the tiles flipped over as they are a match.

				cardValues = [];
                cardIds = [];
                // Clears both arrays as the cards are now flipped upright, so new ones can be chosen.

                if(titlesFlipped == cardArray.length) // Checks to see if the board is completely matched by seeing if all of the flipped cards are equal to the length of the array. 
                { 
					alert("Board cleared... generating new board");
					document.getElementById('game').innerHTML = "";
                    newBoard();
                    // Will alert the user to a javascript prompt, and when they hit okay a new game will be generated. 
				}
            } 
            else 
            {
				function CardFlipBack(){ // If a match is not made, flip the two cards back over. 
				    
				    var tile_1 = document.getElementById(cardIds[0]);
				    var tile_2 = document.getElementById(cardIds[1]);

            	    tile_1.innerHTML = "";
                    tile_2.innerHTML = "";
                    
				    // Clear both arrays
				    cardValues = [];
            	    cardIds = [];
				}
				setTimeout(CardFlipBack, 700); // This interval will set how long the cards are flipped over, allowing the end user to see just what cards are where.
			}
		}
	}
}