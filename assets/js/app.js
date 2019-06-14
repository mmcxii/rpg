const characters = [
    {
        name: 'Abraham Lincoln',
        hp: 120,
        atk: 12,
        baseAtk: 12,
        counterAtk: Math.floor(12 * 1.5),
        user: false,
    },
    {
        name: 'Cincinnatus',
        hp: 140,
        atk: 10,
        baseAtk: 10,
        counterAtk: Math.floor(10 * 1.5),
        user: false,
    },
    {
        name: 'The Sedin Twins',
        hp: 100,
        atk: 14,
        baseAtk: 14,
        counterAtk: Math.floor(14 * 1.5),
        user: false,
    },
    {
        name: 'Nosferatu',
        hp: 160,
        atk: 8,
        baseAtk: 8,
        counterAtk: Math.floor(8 * 1.5),
        user: false,
    },
];

let enemyList = [];

/* Base Functionality */

// List the the characters from and display them in a specific field
function listCharacters(arr, dest) {
    $.each(arr, (i, char) => {
        dest.append(makeCharCard(char));
    });
}

// Build a card with necessary data from each character object
function makeCharCard(char) {
    const charCard = $(`<div>`)
        .addClass('char-card')
        .attr('id', slugify(char.name))
        .css('background', `url('assets/img/characters/${slugify(char.name)}.png')`)
        .css('background-size', 'cover');

    const charLabel = $('<div>').addClass('char-label');
    const charName = $('<span>')
        .addClass('char-name')
        .text(char.name);
    const charHp = $('<span>')
        .addClass('char-hp')
        .text(char.hp);

    charLabel.append(charName).append(charHp);

    charCard.append(charLabel);

    return charCard[0]; // I don't understand why I need to add [0] to select the element
}

// Replaces Character name with a slug version (no spaces, no caps)
function slugify(name) {
    return name.replace(/\s+/g, '-').toLowerCase();
}

function chooseCharacter(char) {
    // Send the Player's Character to the battlefield
    for (let i = 0; i < characters.length; i++) {
        if (slugify(characters[i].name) === char) {
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

    // Update instructions
    $('#instructions').html($('<h2>').text('Select an Enemy to fight:'));
}

function chooseEnemy(char) {
    const remainingEnemies = [];

    for (let i = 0; i < enemyList.length; i++) {
        if (slugify(enemyList[i].name) === char.id) {
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
    if (enemyList.length === 0) {
        // If there aren't, hide the field
        $('#enemies').empty();
        $('#instructions').empty();
    } else {
        // If there are, display them
        $('#enemies-remaining').empty();
        listCharacters(enemyList, $('#enemies-remaining'));
    }
}

/* Combat Functionality */

function attack() {
    // Select the player and the target from the Characters array
    let player, target;
    for (let i = 0; i < characters.length; i++) {
        if ($('#player > .char-card').attr('id') === slugify(characters[i].name)) {
            player = characters[i];
        } else if ($('#target > .char-card').attr('id') === slugify(characters[i].name)) {
            target = characters[i];
        }
    }

    // Combat
    target.hp -= player.atk;
    player.hp -= target.counterAtk;
    player.atk += player.baseAtk;

    // Process combat results
    if (player.hp <= 0) {
        // If player loses all their life, kill them
        killCharacter(player);
    }

    if (target.hp <= 0) {
        // If target loses all their life, kill them
        killCharacter(target);

        // If all enemies are defeated, display the Victory screen
        if (enemyList.length === 0) {
            victoryScreen(player.name);
        }
    }

    // Update HTML
    $('#player > .char-card > .char-label > .char-hp').text(player.hp); // Breaks if selectors are less specific
    $('#target > .char-card > .char-label > .char-hp').text(target.hp);
}

function killCharacter(char) {
    if (char.user) {
        lossScreen(char);
    } else {
        $('#target')
            .empty()
            .html($('<h2>').text(enemyList.length === 1 ? 'Final Target:' : 'Target: '));
    }

    // Allow the next enemy to be chosen
    $('.char-card').on('click', function() {
        chooseEnemy(this);
    });
}

/* End Functionality */

function lossScreen(char) {
    $('#instructions')
        .text(
            `${char.name} ${
                char.name[char.name.length - 1] === 's' ? 'were' : 'was' // Changes based on plurality of Character name
            } defeated by ${$('#target > .char-card > .char-label > .char-name').text()}!`
        )
        .css('textTransform', 'capitalize');
    $('#player').empty();
    $('#atk-btn').text('Very Sad!');
    $('#battlefield').attr('style', 'display: none');
}

function victoryScreen(char) {
    $('#battlefield').attr('style', 'display: none');
    $('#instructions')
        .text(`${char} wins!`)
        .css('textTransform', 'capitalize');
}

/* Initialize Game Window */

function runGame() {
    // Give player instructions
    $('#instructions').html($('<h2>').text('Choose your Character:'));
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
