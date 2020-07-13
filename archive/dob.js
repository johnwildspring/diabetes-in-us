function unique(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item.job__) ? false : (seen[item.job__] = true);
    });
}

export function getDOBRecords(house, street) {
	const url = new URL('https://data.cityofnewyork.us/resource/83x8-shf7.json');
	const params = [
		['house__', house],
		['street_name', street.toUpperCase()]
	];
	url.search = new URLSearchParams(params);
	return fetch(url, {
		headers: {
			'X-App-Token': '7QJwTHTCrEJhiqONmuguBl43j'
		}
	})
		.then(res => res.json())
		.then(res => {
			if (Array.isArray(res)) {
				return res;
			} else {
				throw new Error('Issue requesting data.');
			}
		})
		.then(res => res.filter(record => !!record.issuance_date))
		.then(res => res.map(record => {
			record.filing_date = (new Date(record.filing_date)).getTime();
			record.expiration_date = (new Date(record.expiration_date)).getTime();
			record.issuance_date = (new Date(record.issuance_date)).getTime();
			record.job_start_date = (new Date(record.job_start_date)).getTime();
			console.log(record.issuance_date);
			return record;
		}))
		.then(res => res.sort((a,b) => b.issuance_date - a.issuance_date))
		.then(res => unique(res));
}