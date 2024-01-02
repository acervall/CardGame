Feature: Start Game
 As a user, I want to be able to start a game with other players

 Background:
 	Given a user is logged in, navigates to lobby and selects color
	Given if the amount of players is more than two the game can start
	Given the "Start Game" button should be visible, user starts game

Scenario: Player plays a card
	When a player plays a card
	Then the correct card should be selected and end up in the discard pile