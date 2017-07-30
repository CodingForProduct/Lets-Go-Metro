## Let's Go Metro

![App Screen](https://github.com/CodingForProduct/Lets-Go-Metro/blob/master/app/images/app-1.png)
![App Screen](https://github.com/CodingForProduct/Lets-Go-Metro/blob/master/app/images/app-2.png)
![App Screen](https://github.com/CodingForProduct/Lets-Go-Metro/blob/master/app/images/app-3.png)
![App Screen](https://github.com/CodingForProduct/Lets-Go-Metro/blob/master/app/images/app-4.png)

Let's Go Metro is a mobile application that shows you the relevant transit route for your trip and notifies you when your bus or train is about to leave and when it is about to arrive.

<hr />

|Table of Contents|
|---|
|1. [Installation](#installation)|
|2. [Links](#links)|
|3. [Team Members](#team)|
|4. [Our Approach](#approach)|
|5. [Technologies Used](#technologies)|
|6. [Bugs and Fixes](#bugs)|
|7. [Icebox](#icebox)|
|8. [Resources](#resources)| 

<hr />

### <a name="installation">Installation</a>
Running this application on an emulator requires installing several dependencies: Node.js, Watchman, and the React Native CLI.
```
brew install node
brew install watchman
npm i -g react-native-cli
```

To run on an iOS emulator, you have to install Xcode first. Then run:
```
react-native run-ios
```

<hr />

### <a name="links">Links</a>
[Github repo](https://github.com/CodingForProduct/Lets-Go-Metro)  
[Trello board](https://trello.com/b/H8ZakZ6u/ideas)  
[Pitch deck](https://docs.google.com/presentation/d/12PuX33JjcyC0a2zNRF38UAvUnuGjVfEG6d3wJeB6u4Q/edit?usp=sharing)

<hr />

### <a name="team">Team Members</a>
* [Winnie Luk](https://github.com/winniecluk)
* [Valeriia Tischenko](https://github.com/v1-lab)
* Honorary Team Member: [Carol Gonzalez](https://github.com/carolag)

<hr />

### <a name="approach">Our Approach</a>
We were both working with a framework that was completely new to us, so we decided to create something really simple but useful: an application that, given two points, tells you which routes to take, displays when the routes are leaving, and sends you notifications a few minutes before the bus is about to leave or arrive. We wanted to make learning our focal point rather than producing an involved or complicated application.

<hr />

### <a name="technologies">Technologies Used</a>
* React Native 0.44.0
* React 16.0
* Node 7.0

**Node Modules**
* React Native Maps
* React Native Elements

<hr />

### <a name="bugs">Bugs and Fixes</a>
* The input value for the directions text input was not disappearing even though the animated view container was set to a height of 0, so for a quick fix, we had to clear the value of the input.
* The dialog box for the pointers sometimes stays on the screen when the user touches it and sometimes will only momentarily flash. This may be a problem with the package.
* app doesn't automatically zoom out or in to see entire route
* reset doesn't work completely (map is not recentered on start point)

<hr />

### <a name="icebox">Icebox</a>
* user database to persist previously chosen routes
* payment to refill TAP card
* allowing the user to unlock a resource (free access to textbooks or online newspapers during a ride, free access to certain films -- like the entertainment on an airplane ride)
* unlock game that can only be play during a ride
* user settings to turn on a 'find a friend' feature that lets users of the app who are on the same ride connect
* offer several routes
* track every bus/train needed to reach destination

<hr />

### <a name="resources">Resources</a>
[Official React documentation](https://facebook.github.io/react-native/docs/getting-started.html)
