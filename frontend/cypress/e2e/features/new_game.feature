Feature: Start Game
 As a user, I want to be able to start a game with other players

 Scenario: The can start if enough players
 	Given a user is logged in, navigates to lobby and selects color
 	When if the amount of players is more than two the game can start
 	Then the "Start Game" button should be visible, user starts game