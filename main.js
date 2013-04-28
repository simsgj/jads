/*This software is released under MIT License. Texts for  license are listed below:

 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (c) 2012-2013, ITSimples Games

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* 
-----------------------------------
Ficheiro: main.js
ClassName:main
Comment: Classe principal do jogo
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com 
-----------------------------------
*/

/* adsGame - Game namespace */
var adsGame = 
{ 
	// Inicializar o Jogo
	onload:function()
	{
		//Inicializar resolu��o e teste se browser suporta o jogo
		if(!me.video.init('adsGame',ads_width,ads_height,true,1.0)){
			alert("O seu browser n�o suporta o jogo * Aventura do saber \n Use o Firefox, Chrome ou IE9+ para poder jogar. *");
			return;
		}

		//Inicializar formato de m�sica a utilizar
		me.audio.init("mp3,ogg");
		
		//Callback - Carregar os recursos do jogo quando tudo estiver preparado
		me.loader.onload = this.loaded.bind(this);
		
		// console.log("Loaded... C");
		//Preparar todos os recursos do jogo
		me.loader.preload(ads_resources.concat(load_ads_items));

		//me.loader.preload(ads_resources);
		
		//Mudar estado para ecr� de carregamento do jogo. 
		me.state.change(me.state.LOADING);
		
		// ************ Configura��es de DEBUG *************
		//Ver caixa de colis�o
		me.debug.renderHitBox = DEBUG_MODE;
		
		//Create message box object
		// adsGame.message = new adsGame.message();
		
		// New structure for game
		// adsGame.data = game_data;
		
		//Create Inventory box object
		adsGame.Inventory = new adsGame.Inventory();
		
		adsGame.pathFinder = new  adsGame.pathFinder();
		
		//Create object from prisondoor classe
		adsGame.prisonDoors =  new adsGame.PrisonDoors();
		
		// Create object to NPC
		adsGame.Npc = new adsGame.NPC();
		
		// Create object to Shop
        adsGame.Shop = new adsGame.Shop();

	},
	reboot:function(){
		this.data = null;
	},
	
	//Create a global identity for player as hero 
    heroEntity :function(){
        var heroEntityAux = me.game.getEntityByName('Hero');
        
        return heroEntityAux[0];
    }, 
    
	loaded:function()
	{
		// Definir estado Menu 
		me.state.set(me.state.MENU,new TileScreen());
		
		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen());		

		// Configurar entidades do mapasw
		// Class HeroEntity em entities
		//"Hero" - Nome no mapa .tmx
		me.entityPool.add("Hero", HeroEntity);		
		me.entityPool.add("items", ItemEntity);
		me.entityPool.add("items_spawn", ItemSpawnEntity);
		me.entityPool.add("npc_spawn", NpcSpawnEntity);
		me.entityPool.add("doors_spawn", TriggerSpawnEntity);
		me.entityPool.add("throwers_spawn", ThrowersSpawnEntity);
		me.entityPool.add("map_effects_spawn", MapEffectsSpawnEntity);		
		
		
		// Config Keys - in game you can use WASD or arrow keys
		// Configurar teclas a usar, False - L� mais que uma vez True - L� v�rias vezes.
		// Usar true por exemplo para lutar...
		me.input.bindKey(me.input.KEY.UP, "up", false);
		me.input.bindKey(me.input.KEY.DOWN, "down", false);
		me.input.bindKey(me.input.KEY.LEFT, "left", false);
		me.input.bindKey(me.input.KEY.RIGHT, "right", false);
		
		// Teclas para debug - prefiro :)
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");
		
		// For debug mode
		me.input.bindKey(me.input.KEY.CTRL, "ctrl", false);
		me.input.bindKey(me.input.KEY.P, "speedup", true);
		me.input.bindKey(me.input.KEY.L, "speeddown", true);
		
		//Create inventory key
		me.input.bindKey(me.input.KEY.I, "inventory", true);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.T, "touch");
		
		me.input.bindKey(me.input.KEY.SPACE, "mouseOverride", true);
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
		
		// Iniciar o jogo com o Menu
        me.state.change(me.state.MENU);
		
		// Debug Mode
		//me.state.change(me.state.PLAY);
	}
}; // END ****  adsGame *******


// *** Improve Speed of question box
/*
-----------------------------------
File: main.js
Function: showQuestionLayer
Comment: Display an question box in the game
-----------------------------------
*/
function showQuestionLayer(itemData, adsQtnData)
{
	if (!showingQuestion){
		heroAnswer = -1;
		var $questionBoxHtml = ('<img class="qtnImage" src="" alt="">' + 
							'<div class="itemText"></div>' +
							'<div class="questionText"></div>' + 
							'<div class="r1"></div>' + 
							'<div class="r2"></div>' +
							'<div class="r3"></div>' + 
							'<div class="r0"></div>' + 
							'<div class="answerValue"></div>');
							
		$('#questionLayer').append($questionBoxHtml);
		$('#questionLayer').fadeIn( 250 );
		
		//Show fields from question box with data
		rndQtnData = adsQtnData;
		$('.qtnImage').attr({
		'src' : 'content/sprites/items/' + itemData.imagem,
		'alt' : 'Testing...' 
		});
		$('.itemText').html( itemData.descricao );
		$('.questionText').html( rndQtnData.pergunta );
		$('.r1').html('(1) ' + rndQtnData.r1 );
		$('.r2').html('(2) ' + rndQtnData.r2 );
		$('.r3').html('(3) ' + rndQtnData.r3 );
		$('.r0').html('(0) Não responder..');
		
		// if is a special item them show the value you can lose and not the name
		if (!itemData.specialItem){
			$('.answerValue').html('+/-' + itemData.valor + ' de ' + itemData.categoria + '.');
		}else{
			$('.answerValue').html('Resposta errada perdes ' + itemData.quantidade + ' de ' + itemData.remover + '.');
		}
		// Create event listener to get answer from player
		$(document).keyup(function(event) {
			var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
			// If correct answer return true else return false
			if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'|| keyPressed =='3'  ) {	
				// Return player answer
				heroAnswer = keyPressed;
			}
		});
		
		// Create a event listener to get the ansewer from the mouse 
        // $('#questionLayer  > div') same as $('#questionLayer').children("div")
        $('#questionLayer  > div').bind('click', function() {
            var answer = this.className;
            console.log( "this.className:", answer );
            // If class start with r then is a answer get the answer from player
            if (answer.indexOf("r") == 0){
                console.log("This is a answer...", answer.substr(1,1));
                heroAnswer = answer.substr(1,1);
                
                //Remove event listener
                $('#questionLayer  > div').unbind('click');
            }
        });
		
		//Message box is showing - avoid call over and over again
		showingQuestion = true;
	}

	return heroAnswer;
}

/*
-----------------------------------
File: main.js
Function: hideQuestionLayer
Comment: hide an question box in the game
-----------------------------------
*/
function hideQuestionLayer(answer)
{
	// C -  if hero correct answer
	// W -  if hero answer to the question but it's not the correct one
	// D -  If hero doesn't answer to the question
	
	// **** TO MAKE - Keep information to the player until press space key
	//				- Show in box question the result of the answer
	//				- Make a new field with that information
    var answerResult ='';
	
	if(answer == 'C')
	{
		answerResult ='Parabéns resposta certa...';
	}else if(answer == 'W')
	{
		answerResult ='Resposta errada...';
	}
	else{		
		answerResult ='Tenta para a próxima...';
	}

	//Hide Question fields
	$('.questionText').fadeOut();
	$('.r1').fadeOut();
	$('.r2').fadeOut();
	$('.r3').fadeOut();
	$('.r0').fadeOut();
	$('.answerValue').fadeOut();
	
	// Kill click events
	$("*", "#questionLayer").unbind("click");
	$('.questionText').remove();
	$('.r1').remove();
	$('.r2').remove();
	$('.r3').remove();
	$('.r0').remove();
	$('.answerValue').remove();
	
	// Show player answer result
	var $addAnswerResult = ('<div class="answerResult"></div>');
	$('#questionLayer').append($addAnswerResult);
	$('.answerResult').html(answerResult);
	$('.answerResult').fadeIn();
	
	// Remove questions window
    $(document).bind('keyup click', function(event) {     
        $('.answerResult').fadeOut();
        $('.answerResult').remove();
        $('#target').remove();
        $('#questionLayer').fadeOut( 50 , function(){
            // When finish to fade out 
            showingQuestion = false;
        });
        // event.stopPropagation();
        // Remove event listener to get answer from player
        $(document).unbind();
    });		
}


/*
-----------------------------------
File: main.js
Function: randomInt
Comment: get a random number between min and max value
-----------------------------------
*/
function randomInt( min, max )
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
-----------------------------------
File: main.js
Function: randomFloat
Comment: get a random float number between min and max value
-----------------------------------
*/
function randomFloat(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

/**
 * Create  solid tiles on collision layer
 * @public
 * @param {int} start position of tile x (in Pixels world coordinates)
 * @param {int} start position of tile y  (in Pixels world coordinates)
 * @param {int} blockWidth
 * @param {int} blockHeight 
 */     
 function makeSolid( startX , startY , blockWidth , blockHeight ) {
      // Map position 0,0 is always a solid tile - get number
      var solidTileId = me.game.collisionMap.getTileId( 0 , 0)
      
      // World Coordinates to map Coordinates
      var startX = Math.round(startX / 32);
      var startY = Math.round(startY / 32);
      
      for (var x = 0 ; x < blockWidth ; x++ ){
           for (var y = 0 ; y < blockHeight ; y++ ){
               me.game.collisionMap.setTile ( startX + x  , startY + y , solidTileId );
           }
      }
 }


//bootstrap :)
//window.onReady(function(){
	var init_game = function(data)
	{

		// Inicializar vari�vel para ler recursos dos items
		var countNpc = 0;
		var countItems = 0;
		// var countTrg = 0;
		// var countSI = 0;
		// var countThrow = 0;
		var ads_items_tmp=[];
		// console.log("Loaded... A");
		
		//Get data Items
		$.each(data.items, function(i,data)
		{
			// To load automatic the items - it�s not necessary in the load resources
			ads_items_tmp.push({name: data.imagem.replace(".png",""),	type: "image",	
			src: ""+ ads_items_path + "" + data.imagem + ""});
			countItems++;
			// Add index of item in de array to use in inventory
			data.itemIndex = i;
			
			//ads_items_data.push(data);
		});
		
		//Get data to items - It's not necessary $.each without []
		ads_items_data = data.items;
		
		// Copy array ads_items_tmp to ads_items_final to load resource items
		load_ads_items = ads_items_tmp.slice();
		
		//Get NPC data
		// $.each(data.npc, function(i,data)
		// {
			// countNpc++;
			// adsNpcData.push(data);		
		// });
		
		//Get questions data
		// $.each(data.questions, function(i,data)
		// {
			// countQtn++;
			// adsQtnData.push(data);		
		// });
		
		//Get triggers data
		// $.each(data.triggers, function(i,data)
		// {
			// countTrg++;
			// triggersData.push(data);		
		// });
		
		// //Get specialItems data
		// $.each(data.specialItems, function(i,data)
		// {
			// countSI++;
			// specialItemsData.push(data);		
		// });

		//Get throwers data
		// $.each(data.throwers, function(i,data)
		// {
			// countThrow++;
			// throwersData.push(data);		
		// });
		
		//Get npcData data - It's not necessary $.each
		specialItemsData = data.specialItems;
		
		//Get npcData data - It's not necessary $.each
		adsNpcData = data.npc;
		
		//Get projectilData data - It's not necessary $.each
		projectilsData = data.projectils;
		
		//Get data to map effects - It's not necessary $.each without []
		mapEffectsData = data.mapEffects;
		
		//Get data to triggers - It's not necessary $.each without []
		triggersData = data.triggers;
		
		//Get data to throwers - It's not necessary $.each without []
		throwersData = data.throwers;
        
        //Get data where don't swamp items
		noItemsData = data.noItems;
		
		console.log("noItemsData", noItemsData);
		

		// console.log("Carregados " + countItems + " Items");
		// console.log("ads_items_data " + ads_items_data + " .");
		
		// console.log("Carregados " + countNpc + " NPC");
		// console.log("adsNpcData " + adsNpcData + " .");
		
		// console.log("Carregados " + countQtn + " Questions");
		// console.log("adsQtnData " + adsQtnData + " .");
		
		// Implement with a new level
		// adsGame.onload( data );
		
		adsGame.onload();
	};
$( function(){
    $.when(
    	$.get( ads_json_files + "gamedata01.json" )
    		.done( function( data ){
    			if( typeof data != "object" ){
    				alert( "Data is invalid --- gamedata01.json ---" );
    			}
    			// console.debug( "recebi o seguinte", data );
    			lvlData = data; 
    		})
    		.fail( function(){
    			alert( "Invalid DATA file! --- gamedata01.json ---" );
    		}),
    		
    	// Load questions jason data
        $.get( ads_json_files + "questions.json" )
            .done( function( data ){
                if( typeof data != "object" ){
                    alert( "Data is invalid --- question.json ---" );
                }
                // console.debug( "recebi o seguinte", data );
                // init_game( data );
                
                //Get Questions to variable
                adsQtnData = data.questions;
               
            })
            .fail( function(){
                alert( "Invalid DATA file! --- question.json ---" );
            })    		
	).done(function(){

        //place your code here, the scripts are all loaded
        init_game( lvlData );
         console.log("Questions Loaded..", adsQtnData);
    
    });
});