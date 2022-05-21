import { createRef, useEffect, useRef, useState } from 'react';
import { ObfuscatedA } from '../obfuscate.js';
import { VOUCHER_URL, VO_API } from '../root.js';
import VoucherAPI from '../VoucherAPI.js';
import { ThemeButton, ThemeInput, ThemeInputBar } from '../ThemeElements.js';
import { Notification } from '../Notifications.js';
import '../styles/PrivateLinks.scss';
import { Link } from 'react-router-dom';
import resolveRoute from '../resolveRoute.js';

export default function PrivateLinks(props) {
	const voucher = createRef();
	const domain = createRef();
	const abort = useRef();
	const [tld, set_tld] = useState();
	const [host, set_host] = useState();

	useEffect(() => {
		if (abort.current) {
			abort.current.abort();
		}
	}, []);

	if (host) {
		return (
			<main className="private-links redeemed">
				<h2>Voucher successfully redeemed.</h2>
				<p>
					You've successfully redeemed your voucher for the link{' '}
					<ObfuscatedA className="theme-link" href={`https://${host}`}>
						{host}
					</ObfuscatedA>
					.
				</p>
				<p>
					<b>Please note:</b> Link take 15 minutes - 8 hours to be available.
					You may have to clear your browser cache to access the link. If you're
					still unable to reach your link, please{' '}
					<Link className="theme-link" to={resolveRoute('/', 'contact')}>
						Contact Us
					</Link>
					.
				</p>
			</main>
		);
	}

	return (
		<main className="private-links">
			<p>
				To use this service, you will need a voucher. Purchase a voucher{' '}
				<ObfuscatedA className="theme-link" href={VOUCHER_URL}>
					here
				</ObfuscatedA>
				.
			</p>
			<form
				onSubmit={async event => {
					if (abort.current) {
						abort.current.abort();
					}

					abort.current = new AbortController();

					const api = new VoucherAPI(VO_API, abort.current.signal);

					event.preventDefault();

					props.layout.current.notifications.current.add(
						<Notification
							title="Redeeming voucher..."
							description="This may take a while."
							type="info"
						/>
					);

					try {
						const { host } = await api.redeem(
							voucher.current.value,
							domain.current.value
						);

						set_host(host);
					} catch (error) {
						if (
							error.message !== 'The operation was aborted' &&
							error.message !== 'The user aborted a request.'
						) {
							props.layout.current.notifications.current.add(
								<Notification
									title={error.name}
									description={error.message}
									type="error"
								/>
							);
						}

						return;
					}
				}}
				className="redeem"
			>
				<ThemeInput
					onBlur={async () => {
						if (!voucher.current.value) {
							return;
						}

						if (abort.current) {
							abort.current.abort();
						}

						abort.current = new AbortController();

						const api = new VoucherAPI(VO_API, abort.current.signal);

						try {
							const data = await api.show(voucher.current.value);

							set_tld(data.tld);
						} catch (error) {
							if (
								error.message !== 'The operation was aborted' &&
								error.message !== 'The user aborted a request.'
							) {
								console.error(error);
								props.layout.current.notifications.current.add(
									<Notification
										title={error.name}
										description={error.message}
										type="error"
									/>
								);
							}
						}
					}}
					style={{ width: '100%' }}
					ref={voucher}
					placeholder="Voucher"
					required
				/>
				<ThemeInputBar className="domain" style={{ width: '100%' }}>
					<input
						className="thin-pad-right"
						placeholder="Domain"
						ref={domain}
						required
					/>
					<div className="block right" style={{ width: 64 }}>
						{tld || '.com'}
					</div>
				</ThemeInputBar>
				<ThemeButton type="submit">Redeem</ThemeButton>
			</form>
		</main>
	);
}
