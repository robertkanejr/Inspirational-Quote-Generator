import React, { useState, useEffect } from "react";

//Material UI Imports
import { Modal, Backdrop, Fade } from "@mui/material";

//Styled Components
import {
	ModalCircularProgress,
	QuoteGeneratorModalCon,
	QuoteGeneratorModalInnerCon,
	QuoteGeneratorSubTitle,
	QuoteGeneratorTitle,
} from "./QuoteGeneratorElements";
import ImageBlob from "../animations/ImageBlob";
import { ImageBlobCon } from "../animations/AnimationElements";
import AnimatedDownloadButton from "../animations/AnimatedDownloadButton";

interface QuoteGeneratorModalProps {
	open: boolean;
	close: () => void;
	processingQuote: boolean;
	setProcessingQuote: React.Dispatch<React.SetStateAction<boolean>>;
	quoteReceived: String | null;
	setQuoteReceived: React.Dispatch<React.SetStateAction<String | null>>;
}

const style = {};

const QuoteGeneratorModal = ({
	open,
	close,
	processingQuote,
	setProcessingQuote,
	quoteReceived,
	setQuoteReceived,
}: QuoteGeneratorModalProps) => {
	const wiseDevQuote = "if you can center a div, anything is possible.";
	const wiseDevQuoteAuthor = "-a wise senior software engineer";

	const [blobUrl, setBlobUrl] = useState<string | null>(null);

	//Function for handling download of quote card
	const handleDownload = () => {
		const link = document.createElement("a");
		if (typeof blobUrl === "string") {
			link.href = blobUrl;
			link.download = "quote.png";
			link.click();
		}
	};

	//Function for handling the receiving of quote card
	useEffect(() => {
		if (quoteReceived) {
			//Set new blob url
			const binaryData = Buffer.from(quoteReceived, "base64");
			const blob = new Blob([binaryData], { type: "image/png" });
			const blobUrlGenerated = URL.createObjectURL(blob);
			console.log(blobUrlGenerated);
			setBlobUrl(blobUrlGenerated);

			//remove/revoke old blob url
			return () => {
				URL.revokeObjectURL(blobUrlGenerated);
			};
		}
	}, [quoteReceived]);

	return (
		<Modal
			id="QuoteGeneratorModal"
			aria-labelledby="spring-modal-quotegeneratormodal"
			aria-describedby="spring-modal-opens-and-closes-generator"
			open={open}
			onClose={close}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<QuoteGeneratorModalCon sx={style}>
					<QuoteGeneratorModalInnerCon>
						{/* State #1: Processing request of quote & quote state is empty */}
						{processingQuote === true && quoteReceived === null && (
							<>
								<ModalCircularProgress size={"8rem"} thickness={2.5} />
								<QuoteGeneratorTitle>Generating quote...</QuoteGeneratorTitle>
								<QuoteGeneratorSubTitle style={{ marginTop: "20px" }}>
									{wiseDevQuote}
									<br />
									<span style={{ fontSize: 26 }}>{wiseDevQuoteAuthor}</span>
								</QuoteGeneratorSubTitle>
							</>
						)}
						{/* State #2: Quote state fulfilled */}
						{quoteReceived !== null && (
							<>
								<QuoteGeneratorTitle>Download your quote!</QuoteGeneratorTitle>
								<QuoteGeneratorSubTitle style={{ marginTop: "20px" }}>
									See a preview:
								</QuoteGeneratorSubTitle>
								<ImageBlobCon>
									<ImageBlob quoteReceived={quoteReceived} blobUrl={blobUrl} />
								</ImageBlobCon>
								<AnimatedDownloadButton handleDownload={handleDownload} />
							</>
						)}
					</QuoteGeneratorModalInnerCon>
				</QuoteGeneratorModalCon>
			</Fade>
		</Modal>
	);
};

export default QuoteGeneratorModal;
