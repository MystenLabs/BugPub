// app/src/app/api/code/[network]/[address]/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { network: string; address: string } },
) {
  const { network, address } = params;

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    let apiUrl: string;
    let apiKey: string | undefined;

    let outData: any;
    let language: string;
    if (
      [
        "ethereum",
        "polygon",
        "ethereum-mainnet",
        "polygon-mainnet",
        "bsc-mainnet",
        "avalanche",
        "optimism",
        "arbitrum",
      ].includes(network)
    ) {
      language = "solidity";
      if (network === "ethereum-mainnet" || network === "ethereum") {
        apiUrl = "https://api.etherscan.io/api";
        apiKey = process.env.ETHERSCAN_API_KEY;
      } else if (network === "polygon-mainnet" || network === "polygon") {
        apiUrl = "https://api.polygonscan.com/api";
        apiKey = process.env.POLYGONSCAN_API_KEY;
      } else {
        return NextResponse.json({ error: "Invalid network" }, { status: 404 });
      }

      const response = await axios.get(apiUrl, {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: address,
          apikey: apiKey,
        },
      });

      const sourceCode = response.data.result[0].SourceCode;
      if (!sourceCode) {
        return NextResponse.json(
          { error: "Contract source code not found" },
          { status: 404 },
        );
      }
      if (sourceCode.startsWith("{{")) {
        // Parse the JSON-encoded source code
        const parsedSourceCode = JSON.parse(sourceCode.slice(1, -1));

        // Extract the actual source code from the parsed object
        if (parsedSourceCode.sources) {
          // If it's a multi-file contract, join all sources
          outData = Object.fromEntries(
            Object.entries(parsedSourceCode.sources).map(
              ([key, value]: any) => [key, value.content],
            ),
          );
        } else {
          // If it's a single file, use the content directly
          outData = parsedSourceCode.content || sourceCode;
        }
      } else if (sourceCode.startsWith("{")) {
        const parsedSourceCode = JSON.parse(sourceCode);
        outData = Object.fromEntries(
          Object.entries(parsedSourceCode).map(([key, value]: any) => [
            key,
            value.content,
          ]),
        );
      } else {
        outData = {
          "main.sol": sourceCode,
        };
      }
    } else if (network.startsWith("sui")) {
      try {
        let [_, networkName] = network.split("-");
        if (!networkName) {
          networkName = "mainnet";
        }
        const response = await axios.get(
          `https://suigpt.tools/api/move/module_names?package_id=${address}&network=${networkName}`,
        );
        const moduleNames = response.data.module_names;
        const moduleContents = await Promise.all(
          moduleNames.map(async (moduleName: string) => {
            const moduleResponse = await axios.get(
              `https://suigpt.tools/api/decompiler/decompiled?package_id=${address}&module_name=${moduleName}&network=${networkName}`,
            );
            return {
              [moduleName]: moduleResponse.data.decompiledCode,
            };
          }),
        );
        outData = Object.assign({}, ...moduleContents);
        language = "move";
      } catch (e: any) {
        if (e.response && e.response.status === 404) {
          const errorData = e.response.data;
          if (errorData.message && errorData.go_decompile_url) {
            return NextResponse.json(
              {
                data: errorData,
              },
              { status: 404 },
            );
          }
        }
        // If it's not the specific 404 error we're looking for, rethrow the error
        throw e;
      }
    } else {
      return NextResponse.json({ error: "Invalid network" }, { status: 404 });
    }

    return NextResponse.json({
      data: outData,
      network: network,
      address: address,
      language: language,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch the source code" },
      { status: 500 },
    );
  }
}
