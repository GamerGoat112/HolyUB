let routes;

// eslint-disable-next-line no-unused-vars
export default routes = [
	{
		dir: '/',
		pages: [
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
		dir: '/games/',
		pages: ['popular', 'favorites', 'category', 'player', 'all'],
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
