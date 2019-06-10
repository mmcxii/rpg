const characters = [
    {
        name: 'joe',
        hp: 100,
        atk: 8,
        counterAtk: 12,
        user: false,
    },
    {
        name: 'bob',
        hp: 100,
        atk: 8,
        counterAtk: 12,
        user: false,
    },
    {
        name: 'ted',
        hp: 100,
        atk: 8,
        counterAtk: 12,
        user: false,
    },
    {
        name: 'bill',
        hp: 100,
        atk: 8,
        counterAtk: 12,
        user: false,
    },
];

let enemyList = [];

function attack() {
    // Select the player and the target from the Characters array
    let player, target;
    for (let i = 0; i < characters.length; i++) {
        if ($('#player > .char-card')[0].id === characters[i].name) {
            player = characters[i];
        } else if ($('#target > .char-card')[0].id === characters[i].name) {
            target = characters[i];
        }
    }

    // Combat

    target.hp -= player.atk;
    player.hp -= target.counterAtk;
    player.atk += 8;

    // Process combat results
    if (player.hp <= 0) {
        // If player loses all their life, kill them
        killCharacter(player);
    } else if (target.hp <= 0) {
        // If target loses all their life, kill them
        killCharacter(target);
    } else {
        // Update HTML
        $('#player > .char-card > .char-label > .char-hp')[0].textContent = player.hp;
        $('#target > .char-card > .char-label > .char-hp')[0].textContent = target.hp;
    }
}

function chooseCharacter(char) {
    // Send the Player's Character to the battlefield
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].name === char) {
            characters[i].user = true;
            $('#player').append(makeCharCard(characters[i]));
        }

        // Send the remaining characters to the enemies field
        if (!characters[i].user) {
            enemyList.push(characters[i]);
        }
    }

    // Give Enemies the ability to be chosen
    listCharacters(enemyList, $('#enemies-remaining'));
    $('.char-card').on('click', function() {
        chooseEnemy(this);
    });

    // Hide Character Select Screen, Display Combat Screens
    $('#character-select').attr('style', 'display: none');
    $('#enemies').attr('style', 'display: flex');
    $('#battlefield').attr('style', 'display: block');
}

function chooseEnemy(char) {
    const remainingEnemies = [];

    for (let i = 0; i < enemyList.length; i++) {
        if (enemyList[i].name === char.id) {
            // Send the chosen enemy to the battlefield
            $('#target').append(makeCharCard(enemyList[i]));
        } else {
            // Store enemies not chosen in a temporary array
            remainingEnemies.push(enemyList[i]);
        }
    }
    // Update the remaining enemies with those not chosen
    enemyList = remainingEnemies;

    // Check if there are any enemies remaining
    enemyList.length === 0
        ? // If there aren't, hide the field
          $('#enemies').empty()
        : // If there are, display them
          $('#enemies-remaining').empty(),
        listCharacters(enemyList, $('#enemies-remaining'));
}

function killCharacter(char) {
    char.user
        ? console.log('player defeated')
        : $('#target')
              .empty()
              .append($('<h2>').text(enemyList.length === 1 ? 'Final Target:' : 'Target: '));

    // Allow the next enemy to be chosen
    $('.char-card').on('click', function() {
        chooseEnemy(this);
    });
}

// List the the characters from and display them in a specific field
function listCharacters(arr, dest) {
    $.each(arr, (i, char) => {
        dest.append(makeCharCard(char));
    });
}

// Build a card with necessary data from each character object
function makeCharCard(char) {
    const charCard = $(`<div class='char-card' id=${char.name}>`);

    const charLabel = $("<div class='char-label'>");
    const charName = $("<span class='char-name'>").text(char.name);
    const charHp = $("<span class='char-hp'>").text(char.hp);

    charLabel.append(charName).append(charHp);

    charCard.append(charLabel);

    return charCard[0]; // I don't understand why I need to add [0] to select the element
}

function runGame() {
    // Populate the Choose a Character Field
    listCharacters(characters, $('#character-select'));
    $('.char-card').on('click', function() {
        // Give characters the ability to be chosen
        chooseCharacter(this.id);
    });

    // Hide the battlefield
    $('#enemies').attr('style', 'display: none');
    $('#battlefield').attr('style', 'display: none');
}

// Start the game
runGame();
