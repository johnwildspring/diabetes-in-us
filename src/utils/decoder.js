import pako from 'pako'; 

// This is used to decode response in fetch.
export const decodeResponse = res => {
	if (res.text && typeof res.text === 'function') {
		return res.text().then(parse);
	} else {
		return parse(res);
	}
}

// This is a safer version of JSON.parse
export const tryParse = data => {
	let result;
	if (typeof data == 'string') {
		try {
			result = JSON.parse(data);
		} catch (e) {
			result = null;
		}
	} else if (typeof data == 'object') {
		result = data;
	} else {
		result = null;
	}

	return result;
}

function parse(input) {
	let data = {};

	// Try to parse input right now.
	try {
		input = JSON.parse(input);
	} catch(e) {
		input = input;
	}

	// If it worked, that means it was not encoded+compinputsed.
	// If it didn't, that means we need to decode+inflate it.
	if (typeof input == 'object') {
		data = input;
	} else {
		try {
			let decode = atob(input); 
			let inflate = pako.inflate(decode, {to: 'string'});
			data = JSON.parse(inflate);
		} catch(e) {
			console.warn('Could not parse data.', e, input);
			data = null;
		}
	}

	return data;
}