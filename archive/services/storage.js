import { tryParse } from 'utils/decoder';

export class Storage {
	constructor(domain, session) {
		if (!domain) {
			console.warn('Storage: to access, supply a domain first.');
			return null;
		}
		if (!localStorage) {
			console.warn('Storage: localStorage not supported.');			
			return null;
		}

		this.identifier = 'APP';
		this.domain = domain;

		this.storage = session ? sessionStorage : localStorage;
	}

	accessor(key, subkey) {
		let accessor;
		if (!subkey) {
			accessor = key;
		} else {
			accessor = key + '.' + subkey;
		}
		accessor = `${this.identifier}.${this.domain}.${accessor}`;
		return accessor;
	}

	get keys() {
		return Object.keys(this.storage)
			.map(key => {
				let match = key.match(new RegExp(`${this.identifier}\\.${this.domain}\\.(.+)\\..+`));
				return match && match.length > 1 ? match[1] : null;
			})
			.filter(result => result !== null);
	}

	// Get all subkeys for a key in this domain.
	subkeys(key) {
		return Object.keys(this.storage)
			.map(key => {
				let match = key.match(new RegExp(`${this.identifier}\\.${this.domain}\\.${key}\\.(.+)`));
				return match && match.length > 1 ? match[1] : null;
			})
			.filter(result => result !== null);
	}

	get(key, subkey) {
		const accessor = this.accessor(key, subkey);
		let output = this.storage.getItem(accessor);
		return output ? tryParse(output) : null;
	}

	// Set a detailed key for a subkey in this domain.
	set(key, subkey, input) {
		let data;
		const accessor = this.accessor(key, subkey);

		if (typeof input !== 'string') {
			data = JSON.stringify(input);
		} else {
			data = input;
		}

		this.storage.setItem(accessor, data);
		return [accessor, data];
	}

	// Set a detailed key for a subkey in this domain.
	remove(key, subkey) {
		const accessor = this.accessor(key, subkey);
		this.storage.removeItem(accessor);
		return accessor;
	}
}