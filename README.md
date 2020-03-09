# Starting with Puppeteer

This is an example repository to be used as a companion to a series of begginer-friendly posts I plan on write about doing magic stuff with Puppeteer.

> awesome post links will go here, eventually

Reading the articles are non-obligatory (but I'll be very happy if you do) and this repo can be read as it is. A lot of different approaches will be used here as examples and maybe inspire your own implementations.

## Content

All the code here is separated by context modules with their own set of awesome features.

### Util

- **Browser**: You can find here how to launch your `Puppeteer` instance along with using it with superpowers, with all the resources [`pupppeteer-extra`](https://github.com/berstend/puppeteer-extra) provides us.
- **Page**: Provides useful functions of interesting ways of taking your screenshots and scrapping full page's HTML code and uploading somewhere. Maybe a S3 bucket or something?
- **Stealth**: Shows how to perform a scrapper stealth test using the `puppeteer-extra` stealth module and showing up the results.
- **Time**: Functions to be used to check the amount of time used to perform scrapping operations
- **Upload**: Shows a logic to upload all your screenshots and HTML data into a local bucket, customizable to work with S3 as well.

### Core

- **Google**: Really simple example of scrapping Google's first page of results for a keyword search.

### Config

- **Logger**: Custom logger configured using `Winston`. I quite like it, feel free to use as well.


## Building the image

- Run `docker build -t starting-with-puppeteer:latest .`

## Running the example

- Install all necessary dependencies with a `npm install`
- Create your own `.env` following the variables defined on the `.env.example`
- Run `docker-compose up scrapper`
- Profit
