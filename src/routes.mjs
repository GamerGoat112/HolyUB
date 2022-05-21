let routes;

// eslint-disable-next-line no-unused-vars
export default routes = [
	{
		dir: '/',
		pages: [
			'',
			'faq',
			'contact',
			'privacy',
			'terms',
			'credits',
			'proxy',
			'licenses',
			'privatelinks',
		],
	},
	{
		dir: '/theatre/',
		pages: ['category', 'player', 'all'],
	},
	{
		dir: '/theatre/games/',
		pages: ['', 'favorites', 'all'],
	},
	{
		dir: '/theatre/apps/',
		pages: [''],
	},
	{
		dir: '/compat/',
		pages: ['rammerhead', 'stomp', 'ultraviolet', 'flash'],
	},
	{
		dir: '/settings/',
		pages: ['search', 'appearance', 'tabcloak'],
	},
];
