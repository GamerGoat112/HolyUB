import { Component } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link } from 'react-router-dom';
import { ThemeSelect } from '../../ThemeElements.js';
import Settings from '../../Settings.js';
import categories from './categories.json';
import resolveRoute from '../../resolveRoute.js';
import Footer from '../../Footer.js';
import '../../styles/GamesCategory.scss';
import { Obfuscated } from '../../obfuscate.js';

export default class Category extends Component {
	constructor(props) {
		super(props);

		const data = [];

		for (let i = 0; i < 40; i++) {
			data.push({
				id: i,
				loading: true,
			});
		}

		this.state = {
			data,
			error: undefined,
			possible_error: undefined,
		};
	}
	async possible_error(message) {
		// errors must be VERY verbose for the user
		this.setState({
			possible_error: message,
		});
	}
	/**
	 * @returns {import('react').Ref<import('../../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	api = new GamesAPI(DB_API);
	settings = new Settings(`games category ${this.props.id} settings`, {
		sort: 'Most Played',
	});
	abort = new AbortController();
	async search(query) {
		if (this.abort !== undefined) {
			this.abort.abort();
		}

		this.abort = new AbortController();

		const category = await this.api.category(
			{
				sort: 'search',
				search: query,
				limit: 8,
			},
			this.abort.signal
		);

		this.setState({
			category,
		});
	}

	async fetch() {
		let leastGreatest = false;
		let sort;

		switch (this.settings.get('sort')) {
			case 'Least Played':
				leastGreatest = true;
			// falls through
			case 'Most Played':
				sort = 'plays';
				break;
			case 'Least Favorites':
				leastGreatest = true;
			// falls through
			case 'Most Favorites':
				sort = 'favorites';
				break;
			case 'Name (Z-A)':
				leastGreatest = true;
			// falls through
			case 'Name (A-Z)':
				sort = 'name';
				break;
			default:
				console.warn('Unknown sort', this.settings.get('sort'));
				break;
		}

		try {
			await this.possible_error('Unable to fetch the category data.');

			const data = await this.api.category(
				{
					category: this.props.id,
					sort,
					leastGreatest,
				},
				this.abort.signal
			);

			await this.possible_error();

			return this.setState({
				data,
			});
		} catch (error) {
			console.error(error);

			return this.setState({
				error,
			});
		}
	}
	componentDidMount() {
		this.fetch();
	}
	componentWillUnmount() {
		this.abort.abort();
	}
	render() {
		if (this.state.error !== undefined) {
			let description;

			if (this.state.possible_error === undefined) {
				description = <pre>{this.state.error}</pre>;
			} else {
				description = <pre>{this.state.possible_error}</pre>;
			}

			return (
				<>
					<main className="games-category" ref={this.container}>
						<span>
							An error occured when loading the category:
							<br />
							{description}
						</span>
						<p>
							Try again by clicking{' '}
							<a
								href="i:"
								onClick={event => {
									event.preventDefault();
									global.location.reload();
								}}
							>
								here
							</a>
							.
							<br />
							If this problem still occurs, check{' '}
							<Link
								className="theme-link"
								to={resolveRoute('/', 'faq')}
								target="_parent"
							>
								Support
							</Link>{' '}
							or{' '}
							<Link
								className="theme-link"
								to={resolveRoute('/', 'contact')}
								target="_parent"
							>
								Contact Us
							</Link>
							.
						</p>
					</main>
					<Footer />
				</>
			);
		}

		return (
			<>
				<main className="games-category">
					<section>
						<div className="name">
							<h1>
								<Obfuscated>{categories[this.props.id].name}</Obfuscated>
							</h1>
							<ThemeSelect
								className="sort"
								defaultValue={this.settings.get('sort')}
								onChange={event => {
									this.settings.set('sort', event.target.value);
									this.fetch();
								}}
							>
								<option value="Most Played">Most Played</option>
								<option value="Least Played">Least Played</option>
								<option value="Name (A-Z)">Name (A-Z)</option>
								<option value="Name (Z-A)">Name (Z-A)</option>
							</ThemeSelect>
						</div>
						<div className="items">
							<ItemList items={this.state.data} />
						</div>
					</section>
				</main>
				<Footer />
			</>
		);
	}
}
