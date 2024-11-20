# WARNING: This is an old repository and not used anymore!
## Please refer to https://github.com/c4ldas/c4ldas-seapi for more info

## Description
~~This is a source code of a small web page project to share Streamelements overlays with your colleagues.~~

~~Currently, if you want to share an overlay with custom widgets and alerts with a colleague, you have some options:~~

~~1 - Have them add you as a Streamelements Editor role in their account, so you can create an overlay in their account~~

~~2 - Create an overlay in your account, and have a shareable link to send to them. Unfortunately, this is only available for companies or people who contributed with custom widgets for Streamelements before.~~

~~3 - Using the new Elements overlay page. The new Elements is in open beta, but allows you to create shareable overlays to send to people. It has a new interface and it can be overwhelming for those used to the "old" interface. Streamelements team informed the "old" interface will continue working and they do not have plans to retire it so far.~~

~~This project works like the second one, but without the need of having sharing capabilities provided by Streamelents. You can create an overlay code based on any of your overlays, and share that code with a colleague. The other colleague will reach out to the same website and use the option "Install overlay Code". The overlay will be installed in their account as well as the URL button to drag to OBS~~ 

## Fair use

~~_The overlay code is supposed to work only once. After used, they will be removed from database. In case you want to share the same overlay with more people, you will need to generate new codes._~~

~~_You can generate as many codes as you want each time, but I humbly ask that you do not abuse of that, as it is just a small project and I do not have plans to increase the database and/or the storage. It is not a problem to generate 5 or 10 codes and share them to be used, and after used, generate 10 more. But do not generate like 100 codes and keep them indefinitely, even because the database can be cleaned after some time to remove old codes (I would say once a month at least)_~~

## How to use it
## WARNING: This is an old repository and not used anymore!
## Please refer to https://github.com/c4ldas/c4ldas-seapi for more info

~~You have two ways of using the overlay share.~~

~~1 - [Sharing your overlay](README.md#sharing-your-overlay): This will allow to send a copy of your overlay to another person. You will generate a code and share that code to the person you want it installed. Note: Each code works only once, but you can generate as many codes as you want (attention to the fair use).~~

~~2 - [Installing the overlay ](README.md#installing-the-overlay): This will allow you to install an overlay shared by another person. You will get a code from that person and use that code to install the overlay into your account.~~

### Sharing your overlay

~~In order to share your overlay, go to https://seapi.c4ldas.com.br/ and click on `Share overlay / custom widget`. You will be redirected to Streamelements authorization page, to allow the API to consult your overlay list. Once authorized, the next page will show all overlays that you have in your account.~~

~~- Click on any of the overlays and it will generate a code.~~

~~- Click on `Copy Code` button and send it to the person that will install the overlay.~~

~~Note: _The code is valid only once. As soon as the other person use it to install, the code will be removed from database. In case you want to share your overlay with more people, generate more codes and send each one for each person individually._~~

### Installing the overlay 

~~To install the overlay using the code received, go to https://seapi.c4ldas.com.br/ and click on `Install overlay code` button.~~

~~- Paste the overlay code you received and click on `Install Overlay` button.~~

~~- You will be redirect to Streamelements authorization page, to allow the API to install the overlay into your account. Once authorized, the overlay will be installed and you will be presented to a page to add the overlay to your OBS Studio.~~

~~- From this page, you have two options:~~

  ~~- Drag the button `Drag me to OBS Studio` to the scene you want to have the overlay. This will add the overlay as a browser source to OBS Studio with the name and dimensions set up during the creation. You can rename it later if you want.~~

  ~~- Click on `Copy URL` button, go to your OBS Studio, create a new Browser source, name it and paste the URL copied. Also, pay attention to the overlay dimensions (usually 1920 in width and 1080 in height, but it can vary) and set it correctly.~~


