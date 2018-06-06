<?php
/*
* SCRIPT A EXECUTER SUR LE SERVEUR DE BASE DE DONNEES (via phpMyAdmin).
*
* CREATE DATABASE bddmemory;
*
* CREATE TABLE `bddmemory`.`Times` ( `id` INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT , `time` INT NOT NULL);
*/

/*
* CONFIGURATION ACCES BASE DE DONNEES
*/
const HOST = 'localhost';
const NOM_BASE_DE_DONNEES = 'bddMemory';
const LOGIN = 'root';
const MOT_DE_PASSE = '';


//Si TimeDao.php est appelé avec le paramètre 'time' alors on est dans le cas ou l'on désire enregistrer un temps.
if (isset($_POST['time']))
{
	insertOneTime($_POST['time']);
}
//Sinon on est dans le cas ou l'on désire récupérer les meilleurs temps.
else
{
	//Récupération d'un tableau avec les résultats
	$meilleursTemps = getTheThreeBestTime();
	
	echo("Meilleurs scores <br/>");
	
	//Affichage de chaque résultat.
	foreach ($meilleursTemps as $value)
	{
		echo($value . " ms <br/>");
    	}
}

/**
* Permet de récuperer une variable représentant la connexion à la bdd.
*/
function getConnection()
{
	return new PDO('mysql:host=localhost;dbname='.NOM_BASE_DE_DONNEES, LOGIN, MOT_DE_PASSE);
}

/**
* Retourne un tableau contenant les trois meilleurs scores.
*/
function getTheThreeBestTime()
{
    #Code à risque étant donné que l'on se connecte à une base de données
    #La base de données est un élément extérieur que l'on ne maîtrise pas.
    try
    {
		#Récupération d'une variable représentant une connexion à la bdd.
		$cnx = getConnection();
		
		#Création d'une requête contenant un paramètre (?).
		$requete = $cnx->prepare('SELECT time FROM Times ORDER BY time ASC LIMIT ?');

		#On remplace le paramètre 1 par la valeur 3.
		$requete->bindValue(1, 3, PDO::PARAM_INT);

		#On exécute la requête.
		$requete->execute();

		#Récupération du résultat.
		$result = $requete->fetchAll(\PDO::FETCH_COLUMN);

		#On retourne le résultat.
		return $result;
  }
  #Si il y a une erreur
  catch (PDOException $e)
  {
		#On affiche un message d'erreur.
		echo("Impossible d'afficher les résultats <br/>");
		#On log l'info afin de mieux comprendre le problème et pour la maintenance.
		error_log ( "Erreur dans getTheThreeBestTime : " . $e );
		#On quitte le script.
		die();
  }
}
/**
* Permet d'insérer un temps dans la table.
*/
function insertOneTime($time)
{
	#Code à risque étant donné que l'on se connecte à une base de données
	#La base de données est un élément exterieur que l'on ne maîtrise pas.
	try
	{
		#Récupération d'une variable représentant une connexion à la bdd.
		$cnx = getConnection();

		#Création d'une requête contenant un paramètre (?).
		#On met la valeur null pour la colonne id car elle est auto incrementée.
		$handle = $cnx->prepare("INSERT INTO times (`id`, `time`) VALUES (NULL, ?)");

		#On remplace le paramètre 1 par la valeur du temps passé en paramètre de la fonction.
		$handle->bindValue(1, $time, PDO::PARAM_INT);

		#On exécute la requete.
		$handle->execute();
	}
	#Si il y a une erreur
	catch (PDOException $e)
	{
		#On log l'info afin de mieux comprendre le problème et pour la maintenance.
		error_log ( "Erreur dans insertOneTime : " . $e );
		#On quitte le script.
		die();
	}
}

 ?>
