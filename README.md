## Introduction
   First of all, in order to solve the problem of difficult debugging on the mobile terminal, sometimes we do not need powerful and complicated debugging tools like Winner (and the deployment environment is time-consuming and laborious), maybe we just need a buffer to record the current stack when the page is running incorrectly,also,developers have good hack portals that can open these error messages without affecting the rendering performance of the page. Or when the mobile phone page opens, the sudden white screen lets you say WTF-1 .
  If you happen to have this need, congratulations, you get it!
This repository is an npm package that rewrites the browser console.log method. It is very small, only a hundred lines of code, using ES6 features, easy to install and use.
## How to use it
In order to ensure that the console.log method is rewritten before your program is executed, you need to introduce it in the first line of your program entry.
```
npm install h5debug
//then
import Hdebug from 'h5debug'
```
This is enough, the program has rewritten the log method quietly.

If you need to display the wrong stack information when the page is blank, you need to set the css selector of your root element. The default is '#root'. The setting method is as follows:
```
Hdebug.setRootEleSelector(/*your css class*/)
```
If you want to open the history log information or the wrong stack in your m application, you only need to perform the following methods.
```
Hdebug.hackInstall()
```
## NET
add net sniffer,you can get ajax log
## TODO
1、test

## DEMO
![eg1](https://raw.githubusercontent.com/whitemiaool/mconsole/master/doc/TimLine%E5%9B%BE%E7%89%8720180815155411.png)
![eg2](https://raw.githubusercontent.com/whitemiaool/mconsole/master/doc/TimLine%E5%9B%BE%E7%89%8720180815155508.png)