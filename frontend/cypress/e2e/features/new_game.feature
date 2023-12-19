Feature: Game functionalities

Scenario: Creating new game table
  Given User1 has logged in and navigated to the game lobby
  When User1 creates a new game table
  Then A new table is created, User1 is the only player in it, and it's open for other players to join

Scenario: Joining an open game table
  Given User2 has logged in and navigated to the game lobby where there is an open table created by User1
  When User2 joins the open table
  Then Both User1 and User2 are at the game table

Scenario: Users select team
  Given Both users are at the created table and can see the available teams to join
  When The users select their teams
  Then It's possible to start the game once everyone has selected a team

Scenario: Starting a game
  Given The correct number of players are at the table and everyone is in a team
  When A player starts the game
  Then The game starts