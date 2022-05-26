import { createRef, useEffect, useRef, useState } from 'react';
import { ObfuscatedA } from '../obfuscate.js';
import { VOUCHER_URL, DB_API } from '../consts.js';
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
	const [status, set_status] = useState({});

	useEffect(() => {
		if (abort.current) {
			abort.current.abort();
		}
	}, []);

	switch (status.status) {
		case 'errored':
			return (
				<main className="private-links errored">
					<h2>Unable to redeem voucher.</h2>
					<p>We encountered an error while redeeming your voucher.</p>
					<pre>{status.error.toString()}</pre>
					<p>
						In order to be eligible for a refund, please forward the following
						to our support:
					</p>
					<ul>
						<li>The date ({new Date().toISOString()})</li>
						<li>Your voucher code</li>
						<li>Sellix recipt</li>
					</ul>
					<p>
						<Link className="theme-link" to={resolveRoute('/', 'contact')}>
							Contact Us
						</Link>
						.
					</p>
					<p>
						Click{' '}
						<a
							className="theme-link"
							href="i:"
							onClick={event => {
								event.preventDefault();
								set_status({});
							}}
						>
							here
						</a>{' '}
						to go back.
					</p>
				</main>
			);
		case 'redeemed':
			return (
				<main className="private-links redeemed">
					<h2>Voucher successfully redeemed.</h2>
					<p>
						You've successfully redeemed your voucher for the link{' '}
						<ObfuscatedA className="theme-link" href={`https://${status.host}`}>
							{status.host}
						</ObfuscatedA>
						.
					</p>
					<p>
						<b>Please note:</b> Link take 15 minutes - 8 hours to be available.
						You may have to clear your browser cache to access the link. If
						you're still unable to reach your link, please{' '}
						<Link className="theme-link" to={resolveRoute('/', 'contact')}>
							Contact Us
						</Link>
						.
					</p>
					<p>
						Click{' '}
						<a
							className="theme-link"
							href="i:"
							onClick={event => {
								event.preventDefault();
								set_status({});
							}}
						>
							here
						</a>{' '}
						to go back.
					</p>
				</main>
			);
		// no default
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

					const api = new VoucherAPI(DB_API, abort.current.signal);

					event.preventDefault();

					props.layout.current.notifications.current.add(
						<Notification
							title="Redeeming voucher..."
							description="This may take a while."
							type="info"
						/>
					);

					set_status({ status: 'redeeming' });

					try {
						const { host } = await api.redeem(
							voucher.current.value,
							domain.current.value
						);

						set_status({ status: 'redeemed', host });
					} catch (error) {
						if (
							error.message !== 'The operation was aborted' &&
							error.message !== 'The user aborted a request.'
						) {
							if (error.statusCode === 404 || error.statusCode === 400) {
								set_status({});
								props.layout.current.notifications.current.add(
									<Notification
										title={error.type}
										description={error.message}
										type="error"
									/>
								);
							} else {
								set_status({ status: 'errored', error });
							}
						}
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

						const api = new VoucherAPI(DB_API, abort.current.signal);

						try {
							const { tld } = await api.show(voucher.current.value);

							set_tld(tld);
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
					disabled={status.status === 'redeeming'}
				/>
				<ThemeInputBar
					className="domain"
					style={{ width: '100%' }}
					data-disabled={Number(status.status === 'redeeming')}
				>
					<input
						className="thin-pad-right"
						placeholder="Domain"
						ref={domain}
						required
						disabled={status.status === 'redeeming'}
					/>
					<div className="block right" style={{ width: 64 }}>
						{tld || '.com'}
					</div>
				</ThemeInputBar>
				<ThemeButton type="submit" disabled={status.status === 'redeeming'}>
					Redeem
				</ThemeButton>
			</form>
		</main>
	);
}
