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
import QuoteGeneratorModal from "@/components/QuoteGenerator";

//Assets
import LightningCloud from "../assets/lightning-cloud.png";
import SunCloud from "../assets/cloud-and-sun.png";
import { API } from "aws-amplify";
import { quotesQueryName } from "@/src/graphql/queries";
import { GraphQLResult } from "@aws-amplify/api-graphql";

//interface for DynamoDB object
interface UpdateQuoteInfoData {
	id: string;
	queryName: string;
	quotesGenerated: Number;
	createdAt: string;
	updatedAt: string;
}

//type guard for fetch function
function isGraphQLResultForquotesQueryName(response: any): response is GraphQLResult<{
	quotesQueryName: {
		items: [UpdateQuoteInfoData];
	};
}> {
	return response.data && response.data.quotesQueryName && response.data.quotesQueryName.items;
}

export default function Home() {
	const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);
	const [openGenerator, setOpenGenerator] = useState(false);
	const [processingQuote, setProcessingQuote] = useState(false);
	const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

	//function to fetch DynamoDB object (quotes generated)
	const updateQuoteInfo = async () => {
		try {
			const response = await API.graphql<UpdateQuoteInfoData>({
				query: quotesQueryName,
				authMode: "AWS_IAM",
				variables: {
					queryName: "LIVE",
				},
			});
			// console.log("response", response);

			//Create type guards
			if (!isGraphQLResultForquotesQueryName(response)) {
				throw new Error("Unexpected response from API.graphql");
			}
			if (!response.data) {
				throw new Error("Response data is undefined");
			}

			//Get received number of quotes from DynamoDB
			const receivedNumberOfQuotes = response.data.quotesQueryName.items[0].quotesGenerated;
			//set number of quotes displayed
			setNumberOfQuotes(receivedNumberOfQuotes);
		} catch (error) {
			console.log("Error getting quote data.", error);
		}
	};

	useEffect(() => {
		updateQuoteInfo();
	}, []);

	//Functions for quote generator modal
	const handleCloseGenerator = () => {
		setOpenGenerator(false);
	};

	const handleOpenGenerator = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setOpenGenerator(true);
		setProcessingQuote(true);
		try {
			//Run Lambda function
			// setProcessingQuote(false);
			setTimeout(() => {
				setProcessingQuote(false);
			}, 3000);
		} catch (error) {
			console.log("Error generating quote", error);
			setProcessingQuote(false);
		}
	};

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
				<QuoteGeneratorModal
					open={openGenerator}
					close={handleCloseGenerator}
					processingQuote={processingQuote}
					setProcessingQuote={setProcessingQuote}
					quoteReceived={quoteReceived}
					setQuoteReceived={setQuoteReceived}
				/>

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
						<GenerateQuoteButton onClick={handleOpenGenerator}>
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
