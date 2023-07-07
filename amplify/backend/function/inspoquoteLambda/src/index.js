/* Amplify Params - DO NOT EDIT
	API_QUOTEGENERATOR_GRAPHQLAPIIDOUTPUT
	API_QUOTEGENERATOR_QUOTEAPPDATATABLE_ARN
	API_QUOTEGENERATOR_QUOTEAPPDATATABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

//AWS packages
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

//Image generation packages
const sharp = require("sharp");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

//Function update DynamoDB table
async function updateQuoteDDBObject() {
	const quoteTableName = process.env.API_QUOTEGENERATOR_QUOTEAPPDATATABLE_NAME;
	const quoteObjectID = "12232-234234-234234234-234234234";

	try {
		var quoteParams = {
			TableName: quoteTableName,
			Key: {
				id: quoteObjectID,
			},
			UpdateExpression: "SET quotesGenerated = #quotesGenerated + :inc",
			ExpressionAttributeValues: {
				":inc": 1,
			},
			ExpressionAttributeNames: {
				"#quotesGenerated": "quotesGenerated",
			},
			ReturnValues: "UPDATED_NEW",
		};

		const updateQuoteObject = await docClient.update(quoteParams).promise();
		return updateQuoteObject;
	} catch (error) {
		console.log("Error updating quote object in DynamoDB", error);
	}
}

exports.handler = async (event) => {
	console.log(`EVENT: ${JSON.stringify(event)}`);

	const apiURL = "https://zenquotes.io/api/random";

	//Function to generate quote image
	async function getRandomQuote(apiURLInput) {
		//Validate response to the api
		const response = await fetch(apiURLInput);
		//format response into json
		var quoteData = await response.json();
		console.log(quoteData);

		//Get quote and author text from json
		let quoteText = quoteData[0].q;
		let quoteAuthor = quoteData[0].a;

		//Image construction
		const width = 750;
		const height = 483;
		const text = quoteText;
		//Create array of words in quote
		const words = text.split(" ");
		//set amount of words per line
		const lineBreak = 4;
		let newText = "";

		//Define some tspanElements with 4 words each
		let tspanElements = "";
		for (let i = 0; i < words.length; i++) {
			newText += words[i] + " ";
			if ((i + 1) % lineBreak === 0) {
				tspanElements += `<tspan x="${width / 2}" dy="1.2em">${newText}</tspan>`;
				newText = "";
			}
		}
		if (newText !== "") {
			tspanElements += `<tspan x="${width / 2}" dy="1.2em">${newText}</tspan>`;
		}
		console.log(tspanElements);

		// Construct the SVG Image
		const svgImage = `
        <svg width="${width}" height="${height}" >
          <style>
              .title { 
              fill: #ffffff; 
              font-size: 20px; 
              font-weight: bold;
          }
          .quoteAuthorStyles {
              font-size: 35px;
              font-weight: bold;
              padding: 50px;
          }
          .footerStyles {
              font-size: 20px;
              font-weight: bold;
              fill: lightgrey;
              text-anchor: middle;
              font-family: Verdana;
          }
          </style>
          <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)"/>
          <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Verdana" fill="white">"</text>
          <g>
              <rect x="0" y="0" width="${width}" height="auto"></rect>
                  <text id="lastLineOfQuote" x="375" y="120" font-family="Verdana" font-size="35" fill="white" text-anchor="middle">
                  ${tspanElements}
              <tspan class="quoteAuthorStyles" x="375" dy="1.8em">- ${quoteAuthor}</tspan>
          </text>
          </g>
          <text x="${width / 2}" y="${
			height - 10
		}" class="footerStyles">Developed by Bob Kane | Quotes from ZenQuotes.io</text>
        </svg>
      `;

		//Add background images for SVG creation
		const backgroundImages = [
			"backgrounds/Aubergine.png",
			"backgrounds/Mantle.png",
			"backgrounds/Midnight-City.png",
			"backgrounds/Orangey.png",
		];

		//Pick random background image
		const randomIndex = Math.floor(Math.random() * backgroundImages.length);
		const selectedBackgroundImage = backgroundImages[randomIndex];
		//Get timestamp
		const timestamp = new Date().toLocaleString().replace(/[^\d]/g, "");
		//creating a Buffer from SVG image to store as a binary string
		const svgBuffer = Buffer.from(svgImage);

		//Save image path to temp storage
		const imagePath = path.join("/tmp", "quote-card.png");

		//Use sharp to generate image with background
		const image = await sharp(selectedBackgroundImage)
			//Composite the images together
			.composite([
				{
					input: svgBuffer,
					top: 0,
					left: 0,
				},
			])
			//Save image to file
			.toFile(imagePath);

		//Function to update DynamoDB object in table
		try {
			updateQuoteDDBObject();
		} catch (error) {
			console.log("Error updating quote object in DynamoDB.", error);
		}

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "image/png",
				"Access-Control-Allow-Origin": "*",
			},
			body: fs.readFileSync(imagePath).toString("base64"),
			isBase64Encoded: true,
		};
	}

	return await getRandomQuote(apiURL);
};
