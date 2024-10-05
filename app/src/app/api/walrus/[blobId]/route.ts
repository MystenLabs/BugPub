import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { blobId: string } },
) {
  const { blobId } = params;
  console.log("blobId about to be requested", blobId);
  const walrusAggregatorUrl = `https://aggregator-devnet.walrus.space`;
  const blobUrl = `${walrusAggregatorUrl}/v1/${blobId}`;
  console.log("blobUrl", blobUrl);

  if (!blobId) {
    return NextResponse.json({ error: "Blob ID is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://aggregator-devnet.walrus.space/v1/${blobId}`,
    );
    //https://aggregator-devnet.walrus.space/v1/hdcMOI2MGdZvfqYQVuS6J8xUBh5WMLqk2QNevdkMiVE
    const blob = response.data;
    console.log("response.data", response.data);
    console.log("response.data type", typeof response.data);
    return NextResponse.json(
      { data: blob },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not fetch blob",
      },
      {
        status: 500,
      },
    );
  }
}
