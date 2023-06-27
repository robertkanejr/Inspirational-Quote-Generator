import React from "react";
import Image from "next/image";

interface ImageBlobProps {
	quoteReceived: String;
	blobUrl: string | null;
}

const ImageBlob = ({ quoteReceived, blobUrl }: ImageBlobProps) => {
	return <div>ImageBlob</div>;
};

export default ImageBlob;
