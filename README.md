# READ ME

This repository requires a lot of setup. Because of this, this repository cannot be deployed to services such as Heroku, Repl.it, etc..

If you aren't familiar with manually setting up proxy scripts or webservers, **please wait for a deployable version**.

# Prerequisites

## APIs

This project depends on the following APIs/scripts:

- [DB server](https://git.holy.how/holy/db-server) (ran on port 3001)
- [Bare Server Node](https://github.com/tomphttp/bare-server-node) (ran on port 8001)
- [Rammerhead](https://github.com/binary-person/rammerhead) (ran on port 8002)

## Rammerhead config

`src/config.js`:

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

## Recommended VSC Extensions

- [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

## Recommended Chromium extensions

Protections against clickjacking and CORS prevents the website running locally from interacting with other scripts such as Rammerhead. These extensions will circumvent these protections for development.

- [CORS unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- [Ignore X-Frame headers](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe)

# Scripts

In the project directory, you can run:

**npm start**

> Runs the React development server.

By default, the development server listens on [http://localhost:3000](http://localhost:3000).

**npm run build**

> Builds and obfuscates the React app.

Output is found in the `build` folder.
