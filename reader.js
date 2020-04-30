'use strict';

const http = require('http');
const fs = require('fs');

let arr = [], mTbl = [], sTbl = [], 
	 defaultObj = {}, pObj = {}, mtObj = {}, scObj = {};

const server = http.createServer(function(req, res) {
	let stream = fs.readFileSync(__dirname+'/madhok.txt', 'utf8');
	stream = stream.split(';');
	stream.map((item,index) => {
		if(item.indexOf('Properties') !==-1){
			item = item.split('\r\n');
			item = item.filter((t) => t != 'Properties').filter((t) => t != '');
			pObj['properties'] = item;
			arr.push(pObj);
		} else if(item.indexOf('start_marker_table') !==-1){
			item = item.split('\r\n');
			//todo filter method for data cleanup
			item = item.filter((t) => t != 'Marker Table').filter((t) => t != 'start_marker_table').filter((t) => t != 'end_marker_table').filter((t) => t != '');
			//JSON Restructure
			item.map((item, index) => {
				[defaultObj['markerTime'], ...defaultObj['markerTitle']] = item.split(' ');
				defaultObj['markerTitle'] = defaultObj['markerTitle'].join(' ');
				mTbl.push(defaultObj);
				defaultObj = {};
			});
			mtObj['markerTable'] = mTbl;
			arr.push(mtObj);
		} else if(item.indexOf('start_script_table') !==-1){
			item = item.split('\r\n');
			item = item.filter((t) => t != 'Script Commands').filter((t) => t != 'start_script_table').filter((t) => t != 'end_script_table').filter((t) => t != '');
			//JSON Restructure
			item.map((item, index) => {
				[defaultObj['scriptTime'], ...defaultObj['scriptName']] = item.split(' ');
				defaultObj['scriptName'] = defaultObj['scriptName'].join(' ');
				sTbl.push(defaultObj);
				defaultObj = {};
			});
			scObj['scriptTable'] = sTbl;
			arr.push(scObj);
		}
	});
	fs.writeFileSync(__dirname+'/output.json', JSON.stringify(arr, null, 2) + '\n');
});

server.listen(3000);