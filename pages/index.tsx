import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

//Components
import {
	BackgroundImage1,
	BackgroundImage2,
	GradientBackground,
	Footer,
	CustomLink,
	QuoteGeneratorCon,
	QuoteGeneratorInnerCon,
	QuoteGeneratorTitle,
	QuoteGeneratorSubTitle,
	GenerateQuoteButton,
	GenerateQuoteButtonText,
} from "@/components/QuoteGenerator/QuoteGeneratorElements";

//Assets
import LightningCloud from "../assets/lightning-cloud.png";
import SunCloud from "../assets/cloud-and-sun.png";
import { API } from "aws-amplify";
// import { quotesQueryName } from "@/src/graphql/queries";

// //interface for DynamoDB object
// interface UpdateQuoteInfoData {
// 	id: string;
// 	queryName: string;
// 	quotesGenerated: Number;
// 	createdAt: string;
// 	updatedAt: string;
// }

//type guard for fetch function
export default function Home() {
	const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

	// //function to fetch DynamoDB object (quotes generated)
	// const updateQuoteInfo = async () => {
	// 	try {
	// 		const response = await API.graphql<UpdateQuoteInfoData>({
	// 			query: quotesQueryName,
	// 			authMode: "AWS_IAM",
	// 			variables: {
	// 				queryName: "LIVE",
	// 			},
	// 		});
	// 		console.log("response", response);
	// 	} catch (error) {
	// 		console.log("Error getting quote data.", error);
	// 	}
	// };

	// useEffect(() => {
	// 	updateQuoteInfo();
	// }, []);

	return (
		<>
			<Head>
				<title>Inspirational Quote Generator</title>
				<meta
					name="description"
					content="A full stack web application that generates inspirational quotes."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* Background */}
			<GradientBackground>
				{/* Quote Generator Modal Pop-Up*/}
				{/* <QuoteGeneratorModal /> */}

				{/* Quote Generator */}
				<QuoteGeneratorCon>
					<QuoteGeneratorInnerCon>
						<QuoteGeneratorTitle>Daily Inspiration Quote Generator</QuoteGeneratorTitle>

						<QuoteGeneratorSubTitle>
							In need of some inspiration? Generate a quote card with a random inspirational quote provided
							by{" "}
							<CustomLink href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">
								ZenQuotes API
							</CustomLink>
							.
						</QuoteGeneratorSubTitle>
						<GenerateQuoteButton>
							<GenerateQuoteButtonText>Generate Quote</GenerateQuoteButtonText>
						</GenerateQuoteButton>
					</QuoteGeneratorInnerCon>
				</QuoteGeneratorCon>

				{/* Background Images */}
				<BackgroundImage1 src={LightningCloud} height="300" alt="Cloud with lightning bolt" />
				<BackgroundImage2 src={SunCloud} height="300" alt="Clouds" />
				{/* Footer */}
				<Footer>
					<>
						Quotes Generated: {numberOfQuotes}
						<br />
						Developed by Bob Kane
					</>
				</Footer>
			</GradientBackground>
		</>
	);
}
