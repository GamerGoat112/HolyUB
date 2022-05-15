import { createRef, useEffect, useRef, useState } from 'react';
import { ObfuscatedA } from '../obfuscate.js';
import { VOUCHER_URL, VO_API } from '../root.js';
import VoucherAPI from '../VoucherAPI.js';
import { ThemeButton, ThemeInput, ThemeInputBar } from '../ThemeElements.js';
import { Notification } from '../Layout.js';
import '../styles/PrivateLinks.scss';

export default function PrivateLinks(props) {
	const voucher = createRef();
	const domain = createRef();
	const abort = useRef();
	const [tld, set_tld] = useState();

	useEffect(() => {
		if (abort.current) {
			abort.current.abort();
		}
	}, []);

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

					try {
						// PLACEHOLDER
						// no idea what to do with this data...
						// see https://discord.com/channels/956789074121863178/957489824909111317/972748339223334962
						await api.redeem_voucher(
							voucher.current.value,
							domain.current.value
						);
					} catch (error) {
						if (
							error.message !== 'The operation was aborted' &&
							error.message !== 'The user aborted a request.'
						) {
							props.layout.current.notifications.current.add(
								<Notification
									title={error.name}
									description={error.message}
									duration={10e5}
									type="error"
								/>
							);
						}
					}
				}}
				className="redeem"
			>
				<ThemeInput
					onChange={async () => {
						if (abort.current) {
							abort.current.abort();
						}

						abort.current = new AbortController();

						const api = new VoucherAPI(VO_API, abort.current.signal);

						try {
							const data = await api.show_voucher(voucher.current.value);

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
