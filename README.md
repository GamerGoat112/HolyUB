# Getting Started with HolyUnblocker frontend

## APIs

This project depends on the following APIs/scripts:

- [DB server](https://git.holy.how/holy/db-server) (ran on port 3001)
- [Bare Server Node](https://github.com/tomphttp/bare-server-node) (ran on port 8001)
- [Rammerhead](https://github.com/binary-person/rammerhead) (ran on port 8002)

## Rammerhead config:

src/config.js:

```js
// ...
	port: 8002,
	crossDomainPort: 8003,
// ...
// ON PRODUCTION SERVER (SSL) (PROXY PASSED BY NGINX)
	getServerInfo: (req) => {
		return { hostname: new URL(`https://${req.headers.host}`).hostname, port: 443, crossDomainPort: 443, protocol: 'https:' };
	},
// ON DEVELOPMENT SERVER
	getServerInfo: () => ({ hostname: new URL(`https://${req.headers.host}`).hostname, port: 8002, crossDomainPort: 8002, protocol: 'http:' }),
// ...
	password: null,
// ...
```

## Recommended extensions

Protections against clickjacking and CORS prevents the website running locally from interacting with other scripts such as Rammerhead. These extensions will circumvent these protections for development.

- [CORS unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- [Ignore X-Frame headers](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe)


## Scripts

In the project directory, you can run:

**npm start**

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

**npm run build**

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
