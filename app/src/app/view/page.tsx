// app/src/app/view/page.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const examples = [
  {
    network: "polygon",
    packageId: "0xe71c43e244b704ea21f3fc084e3ef1120127dd40",
    name: "Bank Contract with Reentrancy Vulnerability",
  },
  {
    network: "ethereum",
    packageId: "0xE16DB319d9dA7Ce40b666DD2E365a4b8B3C18217",
    name: "Rari Captical with Reentrancy Vulnerability",
  },
  {
    network: "ethereum",
    packageId: "0x98a877bb507f19eb43130b688f522a13885cf604",
    name: "Orion Protocol with Reentrancy Vulnerability",
  },
  // {
  //   network: "ethereum",
  //   packageId: "0x26f1457f067bF26881F311833391b52cA871a4b5",
  //   name: "Roat Football Protocol: Predictable source of randomness",
  // }, // This one is not working
  // {
  //   network: "ethereum",
  //   packageId: "0x80121DA952A74c06adc1d7f85A237089b57AF347",
  //   name: "$FFIST: Predictable source of randomness",
  // },
  {
    network: "sui-mainnet",
    packageId:
      "0x276c106843df35116159ef3a803283f6847db03fdbf6d271868020083bc42a22",
    name: "Sui Meme Coin with treasury cap issue",
  },
  {
    network: "sui-mainnet",
    packageId:
      "0x8ec24188ca1d4fb80dc8254a6a142256c8a76ec1cd0251c5a128979919d75509",
    name: "Sui Voting Campaign with Bugs",
  },
  {
    network: "sui-mainnet",
    packageId:
      "0xc9b6e1d0facd591bd8c5d4c42aba58808fb1ce5239555f3a70fda4b7ba7fe8df",
    name: "Sui Fomo Game with Bugs",
  },
  {
    network: "sui-mainnet",
    packageId:
      "0x6d2378d9c309658daa41c77ecd1b4a35608b292a42381c570981b461b3f6d90c",
    name: "Sui Managed Coin with Bugs",
  },
  // {
  //   network: "ethereum",
  //   packageId: "0xF125F8ea827cB27dFDe817b67f38687B58369c6B",
  //   name: "Example Ethereum Smart Contract",
  // },
];

const SearchBox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [network, setNetwork] = useState<string>("sui-mainnet");
  const [selectedExample, setSelectedExample] = useState<string>("");
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [exampleMessage, setExampleMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const updatePageHeight = () => {
      setPageHeight(window.innerHeight);
    };

    updatePageHeight();
    window.addEventListener("resize", updatePageHeight);

    return () => {
      window.removeEventListener("resize", updatePageHeight);
    };
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push(`/view/${network}/${searchTerm}`);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (error) setError("");
    setSearchTerm(event.target.value);
  };

  const handleNetworkChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setNetwork(event.target.value);
  };

  const handleExampleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const selectedExample = examples.find(
        (ex) => ex.packageId === selectedValue,
      );
      if (selectedExample) {
        setNetwork(selectedExample.network);
        setSearchTerm(selectedExample.packageId);
        setExampleMessage(`Example Loaded: ${selectedExample.name}`);
      }
    } else {
      setExampleMessage("");
    }
    setSelectedExample(selectedValue);
  };
  console.log({ network });

  return (
    <main
      className="w-full flex items-center justify-center"
      style={{ height: `${pageHeight / 3}px` }}
    >
      <div className="rounded-lg p-4 bg-white shadow-md max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Search the contract you want to review by AI
        </h2>
        <div className="">
          <form className="flex flex-col items-center" onSubmit={handleSearch}>
            <div className="flex w-full items-center mr-2 border-2 text-black border-gray-300 bg-white rounded-lg ">
              <input
                type="text"
                placeholder="Enter Package ID"
                className="w-3/4  h-12 px-5 text-md focus:outline-none focus:border-none border-none rounded-lg"
                value={searchTerm}
                onChange={handleChange}
              />
              <select
                className="min-w-1/4 px-3 py-2 rounded-lg focus:outline-none text-black border-none focus:border-none"
                onChange={handleNetworkChange}
                value={network}
              >
                <option value="sui-mainnet">Sui</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex justify-center w-full mt-4">
              <button
                type="submit"
                className="flex px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none border-0 text-white mr-2"
              >
                <FaSearch size={20} className="mr-2" /> View
              </button>
              <select
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 focus:outline-none border-0 text-white w-full"
                onChange={handleExampleChange}
                value={selectedExample}
              >
                <option value="">Select Example</option>
                {examples.map((example, index) => (
                  <option key={index} value={example.packageId}>
                    {example.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
          {exampleMessage && (
            <p className="text-green-500 mt-4 text-center">{exampleMessage}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchBox;
