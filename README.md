## Let's Go Metro

Let's Go Metro is a mobile application that shows you the relevant transit route for your trip and notifies you when your bus or train is about to leave and when to get off.

|Table of Contents|
|1. Installation|
|2. Links|
|3. Team Members|
|4. Our Approach|
|5. Technologies Used|
|6. Bugs and Fixes|
|7. Icebox|
|8. Resources| 

### Installation
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

To run on an Android emulator, install Android studio and have an emulator up and running. Then run:
```
react-native run-android
```

### Links
[Github repo](https://github.com/CodingForProduct/Lets-Go-Metro)  
[Trello board](https://trello.com/b/H8ZakZ6u/ideas)

### Team Members
* [Winnie Luk](https://github.com/winniecluk)
* [Valeriia Tischenko](https://github.com/v1-lab)
* Honorary Team Member: [Carol Gonzalez](https://github.com/carolag)

### Our Approach
We were both working with a framework that was completely new to us, so we decided to create something really simple but useful: an application that, given two points, tells you which routes to take, displays when the routes are leaving, and sends you notifications a few minutes before the bus is about to leave or arrive. We wanted to make learning our focal point rather than producing an involved or complicated application.

### Technologies Used
* React Native 0.44.0
* React 16.0
* Node 7.0

**Node Modules**
* React Native Maps
* React Native Elements

### Bugs and Fixes
* The input value for the directions text input was not disappearing even though the animated view container was set to a height of 0, so for a quick fix, we had to clear the value of the input.
* The dialog box for the pointers sometimes stays on the screen when the user touches it and sometimes will only momentarily flash. This may be a problem with the package.

### Icebox
* user database to persist previously chosen routes
* payment to refill TAP card
* allowing the user to unlock a resource (free access to textbooks or online newspapers during a ride, free access to certain films -- like the entertainment on an airplane ride)
* unlock game that can only be play during a ride
* user settings to turn on a 'find a friend' feature that lets users of the app who are on the same ride connect
* offer several routes
* track every bus/train needed to reach destination

### Resources
[Official React documentation](https://facebook.github.io/react-native/docs/getting-started.html)
