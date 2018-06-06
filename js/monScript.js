//Variables globales disponible à l'ensemble des fonctions
var tableauAleatoire = new Array();
var carteUne = null;
var carteDeux = null;
var resultat = 0;
var nbPaire = 14;
var interval;
var firstClick = false;
var time = 200000;
var currentTime = 0;

//Fonction executée après le chargement de la page
$(document).ready(function()
{
    console.log('Entrée dans la fonction ready().');
    initialisation();
});

/**
 * Remet le jeu à zéro;
 */
function raz()
{
    console.log('Entrée dans la fonction raz().');
    carteUne = null;
    carteDeux = null;
    resultat = 0;
    firstClick = false;
    currentTime = 0;
    //Met la barre de chargement à zéro
    $("#fill").css("width", "0%");
    //Supprime les evenements sur les images cachées
    $(".hidden").unbind();
    //Vide le contenu du jeu
    $("#main").html("");
    //Initialise le jeu
    initialisation();
}

/**
 * Initialise le jeu
 */
function initialisation()
{
    console.log('Entrée dans la fonction initialisation().');
    //Mélange les cartes
    melanger();
    //Affiche les cartes de manière cachée
    distribuerLesCartes();
    //Ajoute un evenement sur chaque carte
    $('.carte').click(function () {
        gererClicSurImage(this);
    })
    //Permet d'afficher les résultats.
    afficherResultats();
}

/**
 *
 * Permet de gérer les actions lors d'un clic sur une carte.
 *
 * @param image
 */
function gererClicSurImage(image)
{
    console.log('Entrée dans la fonction gererClicSurImage().');
    //Detecte si c'est le premier clic
    if(firstClick === false)
    {
        firstClick = true;
        startTimer();
    }


    //Désactive le clic sur les autres cartes cachées.
    $(".cachee").unbind("click");
    //Fait apparaitre la carte sur laquelle on a cliqué.
    $(image).removeClass("cachee");

    //Si on retourne la premiere carte de la paire à analyser.
    if(carteUne == null)
    {
        carteUne = image;
        console.log(carteUne + ' ' + $(carteUne).attr("class"));
        $(".cachee").click(function(){gererClicSurImage(this)});
    }
    //Si on retourne la seconde carte de la paire à analyser.
    else if(carteDeux == null)
    {
        carteDeux = image;
        console.log(carteDeux + ' ' + $(carteDeux).attr("class"));

        //Si les deux cartes sont identiques
        if($(carteUne).attr("class") === $(carteDeux).attr("class"))
        {
            carteUne = null;
            carteDeux = null;
            resultat++;
            console.log('OK : ' + resultat);
            $(".cachee").click(function(){gererClicSurImage(this)});

            if(resultat == nbPaire)
            {

                window.setTimeout(function(){
                    gagner();
                }, 200);
            }
        }
        //Si les deux cartes ne sont pas identiques
        else
        {
            window.setTimeout(function(){
                cacher();
            }, 400);
        }
    }
}

/**
 * Permet de construire l'ihm.
 */
function distribuerLesCartes()
{
    console.log('Entrée dans la fonction distribuerLesCartes().');
    for(var i = 0;i<tableauAleatoire.length;i++)
    {
        $("#main").html($("#main").html() + getCodeDUneCarte(tableauAleatoire[i]) );
    }
}

/**
 *Fournit le code HTML d'une carte.
 *
 * @param index
 * @returns {string}
 */
function getCodeDUneCarte(index)
{
    console.log('Entrée dans la fonction getCodeDUneCarte().');
    if(index>14)
    {
        index = index - 14;
    }
    return '<div class="cachee carte fruit' + index + '"></div>';
}

/**
 * Permet de remplir le tableau tableauAleatoire avec des nombres aléatoires.
 */
function melanger()
{
    console.log('Entrée dans la fonction melanger().');
    var index = 0;
    for(var y = 1;y<=2;y++)
    {
        for (var i = 1; i <= 14; i++)
        {
            tableauAleatoire[index++] = i;
            console.log(index +' ' + i);
        }
    }

    tableauAleatoire.sort(function(){
        return Math.round(Math.random());
    });
}

/**
 * Permet de cacher la paire d'image non identique.
 */
function cacher()
{
    console.log('Entrée dans la fonction cacher().');
    $(carteUne).addClass("cachee");
    $(carteDeux).addClass("cachee");
    carteUne = null;
    carteDeux = null;
    $(".cachee").click(function(){gererClicSurImage(this)});
    console.log('KO');
}

/**
 * Action effectuée lorsque le joueur gagne
 */
function gagner()
{
    console.log('Entrée dans la fonction gagner().');
    alert('Vous avez gagné !!!!!!!!!');
    insererResultat(currentTime);
    window.clearInterval(interval);
    raz();
}

/**
 * Démarre la barre de progression.
 */
function startTimer(){
    console.log('Entrée dans la fonction startTimer().');
    interval = window.setInterval(function(){miseAJourBarreDeProgression();}, 200);
}

/**
 * Fait évoluer la barre de progression.
 */
function miseAJourBarreDeProgression(){
    console.log('Entrée dans la fonction miseAJourBarreDeProgression().');
    currentTime+=200;

    var tailleBarre = 100;
    var tpsMaxSec = time/1000;
    var tpsCourant = currentTime/1000;

    var progress = (tailleBarre * (tpsCourant))/tpsMaxSec;

    $("#fill").css("width", progress+"%");

    switch (true)
    {
        case progress>33 && progress<66:
            $("#fill").css("background-color", "#FFA500");
            break;
        case progress>66:
            $("#fill").css("background-color", "#FF0000");
            break;
    }

    if(currentTime >= time)
    {

        window.clearInterval(interval);
        window.setTimeout(function()
        {
            alert("Vous avez perdu !!!!!!!!!!!!!");
            raz();
            },1000);
    }
}

/**
 * Cette fonction permet d'insérer un résultat dans la bdd.
 */
function insererResultat(temps)
{
    console.log('Entrée dans la fonction insererResultat(temps). temps = ' + temps);
    //Permet d'enregistrer le temps effectué par le joueur gagnant. (Utilisation de JQuery & Ajax)
    $.ajax({
        url : 'TimeDao.php', // La ressource ciblée.
        type : 'POST', // Le type de la requête HTTP.
        data : 'time=' + temps // Un paramètre.
    });
}

/**
 * Cette fonction permet d'afficher les résultats.
 */
function afficherResultats()
{
    console.log('Entrée dans la fonction afficherResultats().');
    //Permet de charger la div avec l'identifiant 'top' avec les meilleurs resultats.  (Utilisation de JQuery & Ajax)
    $( "#top" ).load( "TimeDao.php");
}
