//Converter Class
var fs = require("fs");
var Converter = require("csvtojson").Converter;
var converter = new Converter({
	delimiter: ';'
});

//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonArray) {
	console.log(jsonArray); //here is your result jsonarray
	fs.writeFile('./www/moves.json', JSON.stringify(jsonArray), (err) => {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});

//read from file
fs.createReadStream("./moves.csv").pipe(converter);