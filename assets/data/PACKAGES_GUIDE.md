# Cognitive Minds Package Configuration Guide

This file explains what can be changed in `packages.json`.

Do not add normal comments such as `// comment` inside `packages.json`,
because JSON does not support comments.


## Package ID

Example:

"id": "one-on-one"

This is the internal identifier used by the website.

Try not to change this once the package has been created.

Examples:

- one-on-one
- small-group
- exam-prep


## Title

Example:

"title": "One-on-One Tutoring"

This is the package name displayed on the website.

Safe to edit.


## Description

Example:

"description": "Individual tutoring tailored to the learner's needs..."

This is the main description shown on the tutoring card.

Safe to edit.


## Tags

Example:

"tags": [
  "One-on-One",
  "In Person or Online"
]

These are the small labels displayed at the top of the card.

You can:

- change the wording
- add tags
- remove tags


## Price

Example:

"price": 500

Enter numbers only.

DO:

"price": 500

DO NOT:

"price": "R500"
"price": "R 500.00"
"price": "500/hour"

The website handles the currency formatting automatically.

If the real price is not known yet, use:

"price": 0

The website will display:

R xxx.xx


## Price Unit

Example:

"priceUnit": "hour"

This controls the wording shown after the price.

Examples:

"priceUnit": "hour"

Displays:

R 500.00 / hour


"priceUnit": "session"

Displays:

R 1 500.00 / session


## Maximum Students

Example:

"maxStudents": 5

The website automatically displays:

Maximum 5 students

Change the number if the maximum group size changes.

Example:

"maxStudents": 8

Displays:

Maximum 8 students


If maximum students does not apply to the package, use:

"maxStudents": null


## Duration

Example:

"durationHours": 3

The website automatically displays:

3-hour session

Examples:

"durationHours": 2

Displays:

2-hour session


"durationHours": 2.5

Displays:

2.5-hour session


If a duration should not be displayed, use:

"durationHours": null


## Features

Example:

"features": [
  "Grades 10–12",
  "Physics and Chemistry",
  "Individual attention",
  "In-person or online",
  "CAPS, IEB, Cambridge and more"
]

Each item becomes a line with a checkmark on the tutoring card.

You can:

- change the wording
- add features
- remove features

Do not manually add maximum students or session duration here if those
are already controlled by `maxStudents` and `durationHours`.


## Discount Settings

Every package can have its own discount.

Example:

"discount": {
  "active": true,
  "percent": 10,
  "sessions": 4
}


### active

"active": true

The discount is ON.

The website shows:

- discount badge
- original crossed-out price
- discounted price


"active": false

The discount is OFF.

The website shows only the normal price.

No discount badge or crossed-out price is created.


### percent

Example:

"percent": 10

Means:

10% discount

The website calculates the discounted price automatically.

Do not manually calculate and enter the discounted price.


### sessions

Example:

"sessions": 4

Means that the discount is valid for 4 sessions.

The website displays:

10% OFF · 4 SESSIONS


Example:

"sessions": 1

The website displays:

10% OFF · 1 SESSION


## Examples


### No Discount

"discount": {
  "active": false,
  "percent": 0,
  "sessions": 0
}

Displays:

R 500.00 / hour


### 10% Discount for 4 Sessions

"discount": {
  "active": true,
  "percent": 10,
  "sessions": 4
}

If the normal price is R500.00, the website calculates:

R500.00 normal price
R450.00 discounted price

and displays approximately:

10% OFF · 4 SESSIONS
R500.00 crossed out
R450.00 / hour


## Active Package

Example:

"active": true

The package is displayed on the website.


"active": false

The package is kept in `packages.json`, but is hidden from the website.

This is useful if Cognitive Minds temporarily stops offering a package.


# Common Changes


## Change a Price

Change:

"price": 500

to:

"price": 550


## Change Maximum Group Size

Change:

"maxStudents": 5

to:

"maxStudents": 6


## Change Session Duration

Change:

"durationHours": 3

to:

"durationHours": 2


## Start a Promotion

Change:

"discount": {
  "active": false,
  "percent": 0,
  "sessions": 0
}

to:

"discount": {
  "active": true,
  "percent": 15,
  "sessions": 4
}


## End a Promotion

Change only:

"active": true

to:

"active": false

inside the discount section.


## Temporarily Hide a Package

At the bottom of that package change:

"active": true

to:

"active": false