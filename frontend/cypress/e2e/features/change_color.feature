Feature: Change Background color
	As a user, I want to be able to change the background color for my home page

Scenario: User changes background color
	Given a user is logged in, navigates to the profile page
	When a user changes background color to "red"
	Then the background color of their homepage should change to "red"