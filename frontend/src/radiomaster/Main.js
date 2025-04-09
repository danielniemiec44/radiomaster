import * as React from 'react';
import AppBar from "./AppBar";
import CoverVinaiParade from "../images/cover-vinai-parade.jpeg";
import CoverMartinGarrixAnimals from "../images/cover-martin-garrix-animals.jpeg";
import MenuIcon from "./Components/MenuIcon";

export default function Main() {
    // Przykładowe elementy listy - zastąp własnymi danymi
    const listItems = [
        {id: 1, title: "Parade", artist: "VINAI", duration: "3:45", cover: CoverVinaiParade, timeToPlay: 1744073697},
        {id: 1, title: "Animals", artist: "Martin Garrix", duration: "3:45", cover: CoverMartinGarrixAnimals, timeToPlay: 1744073900},
    ];

    const formatDate = (timeToPlay) => {
        const date = new Date(timeToPlay * 1000);
        const day = date.getDate();
        const dzienString = date.toLocaleDateString("pl-PL", {weekday: "long"});

        return `${dzienString} ${date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })}`;
    };

    return (
        <div style={{width: "100%", height: "100%"}} className="flex flex-col min-h-screen">
            <AppBar />

            {/* Zawartość główna */}
            <div className="w-full">
                <div className="bg-red-500 text-white p-3 absolute z-20 flex items-center justify-center bg-red-500 text-white w-full">
                    Aktualnie nic nie jest odtwarzane!
                </div>
            </div>

            {/* Lista na dole po lewej */}
            <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md absolute bottom-0 left-0 top-20 mt-12">
                <h3 className="font-bold m-5 text-xl">Kolejka ({listItems?.length ?? 0})</h3>
                <ul className="space-y-2">
                    {listItems.map((item, index) => (
                        <>
                        <div className="w-full bg-green-600 text-sm rounded-lg text-white w-full p-1.5">
                            {formatDate(item.timeToPlay)}
                        </div>
                        <li key={index} className="hover:bg-gray-200 p-2 rounded cursor-pointer">
                    <div className="rounded-lg p-4 flex items-center justify-start gap-5">
                                <div className="w-10 h-10 flex items-center justify-center">
                                <MenuIcon className="text-gray-600" />
                                </div>
                                {item.cover && (
                                    <div
                                        style={{background: `url('${item.cover}')`, backgroundPosition: "center center", backgroundSize: "contain", backgroundRepeat: "no-repeat", width: "100px", height: "80px", borderRadius: "8px"}}
                                    ></div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xl">{item.title}</span>
                                    <span className="text-md text-gray-600">{item.artist}</span>
                                    <span className="text-md text-gray-600">{item.duration}</span>
                                </div>
                            </div>
                        </li>
                        </>
                        ))}
                </ul>
            </div>
        </div>
    );
}