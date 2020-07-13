import React from 'react';

import { Loader } from './Loader.jsx';

const Record = props => {
	const issuanceDate = new Date(props.issuance_date);
	const issuanceDateString = `${issuanceDate.toLocaleString('en-us', {month: "long"})} ${issuanceDate.getDate()}, ${issuanceDate.getFullYear()}`;
	return (
		<div className="Record">
			<div>Job Number: {props.job__ || ''}</div>
			<div>Permit Type: {props.permit_type || ''}</div>
			<div>Issuance Date: {issuanceDateString}</div>
			<h4>Permittee Information</h4>
			<div>Business Name: {props.permittee_s_business_name || ''}</div>
			<div>First Name: {props.permittee_s_first_name || ''}</div>
			<div>Last Name: {props.permittee_s_last_name || ''}</div>
			<div>Phone: {props.permittee_s_phone__ || ''}</div>
			<h4>Owner Information</h4>
			<div>Business Name: {props.owner_s_business_name || ''}</div>
			<div>First Name: {props.owner_s_first_name || ''}</div>
			<div>Last Name: {props.owner_s_last_name || ''}</div>
			<div>Phone: {props.owner_s_phone__ || ''}</div>
		</div>
	)
};

export const Records = props => {
	const { locCenter, records = [], loading = true } = props;
	if (loading) {
		return <Loader />;
	} else {
		return (
			<div className="Records">
				<div className="StreetView">
					<img src={`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${locCenter.formatted_address}&key=AIzaSyAhm5eJ2tzDbbgrQ25RTFOJHSjuHEL1Fpg`} />
				</div>
				<div className="HeaderInfo">
					<h3 className="Name">{locCenter.addressName}</h3>
					<i>{records.length} records found.</i>
				</div>
				{records.map(record => <Record key={record.job__} {...record} />)}
			</div>
		)
	}
}