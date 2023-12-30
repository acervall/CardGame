Feature: Game functionalities

Scenario: Creating new game table
  Given User1 has logged in and navigated to the game lobby
  When User1 selects color red
  Then Amount of player online is visible for other users

Scenario: Joining an open game table
  Given User2 has logged in and navigated to the game lobby where User1 is color red
  When User2 select color green
  Then Enough players are online and the game can start

Scenario: Starting a game
  Given The correct number of players are at the table and everyone is in a team
  When A player starts the game
  Then The game starts